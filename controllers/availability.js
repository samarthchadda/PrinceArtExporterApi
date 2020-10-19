
const Availability = require('../models/availability');

const getDb = require('../util/database').getDB; 


exports.getAllAvailData=(req,res,next)=>{
  
    Availability.fetchAllAvails()
                .then(avails=>{                   
                    res.json({message:"All Data returned",avails:avails})

                })
                .catch(err=>console.log(err));
}


exports.getSingleAvailData=(req,res,next)=>{
  
    const empId = +req.params.empId;
   
    Availability.findAvailByEmpId(JSON.parse(empId))
    .then(availDoc=>{
       
        if(availDoc){
           
             res.json({status:true, data:availDoc});
        }
        else{
            res.json({status:false,message:"No such availability exist"});
        }          

    })    
}



//POST
exports.availRegister = (req,res,next)=>{
  
    //parsing data from incoming request
    const empId = +req.body.empId;
    const availStatus = req.body.availStatus;    
    const timeslot = req.body.timeslot;
    let startDate = req.body.startDate;    
    let endDate = req.body.endDate;

    startDate = new Date(startDate).getTime();
    console.log(startDate);

    endDate = new Date(endDate).getTime();
    console.log(endDate);


    Availability.findAvailByEmpIdAndDate(empId,startDate,endDate)
            .then(availData=>{
                if(availData){
                    
                    return res.json({status:false, message:'Availability already registered for this week'});
                }
                
                    //saving in database
                    const availability = new Availability(empId,availStatus,timeslot,startDate,endDate);

                    return availability.save()
                    .then(resultData=>{
                        
                        res.json({status:true,message:"Availability Registered",availability:resultData["ops"][0]});
                        
                    })
                    .catch(err=>console.log(err));                      
            })
        .then(resultInfo=>{                   
            
        })
        .catch(err=>console.log(err));      

}



exports.editAvailStatus=(req,res,next)=>{
    //parsing data from incoming request
    const empId = +req.body.empId;
    const day = req.body.day;
    const newStatus = +req.body.newStatus;  

    let startDate = req.body.startDate;    
    let endDate = req.body.endDate;

    startDate = new Date(startDate).getTime();
    console.log(startDate);

    endDate = new Date(endDate).getTime();
    console.log(endDate);


    let statusKey;
    if(day.toLowerCase() == "monday")
    {
        statusKey = 0;
    }
    if(day.toLowerCase() == "tuesday")
    {
        statusKey = 1;
    }
    if(day.toLowerCase() == "wednesday")
    {
        statusKey = 2;
    }
    if(day.toLowerCase() == "thursday")
    {
        statusKey = 3;
    }
    if(day.toLowerCase() == "friday")
    {
        statusKey = 4;
    }
    if(day.toLowerCase() == "saturday")
    {
        statusKey = 5;
    }
    if(day.toLowerCase() == "sunday")
    {
        statusKey = 6;
    }
    
   
    Availability.findAvailByEmpIdAndDate(empId,startDate,endDate)
             .then(availDoc=>{                
                 if(!availDoc)
                 {
                     return res.json({ message:'Availability does not exist',status:false});
                 }
                 
                 availDoc.availStatus[statusKey] = newStatus;
                 
                 const db = getDb();
                 db.collection('availabilities').updateOne({empId:empId,startDate:startDate,endDate:endDate},{$set:availDoc})
                             .then(resultData=>{
                                 
                                 res.json({message:'Details Updated',status:true});
                             })
                             .catch(err=>console.log(err));
             })

}



exports.editAvailTimeslot=(req,res,next)=>{
    //parsing data from incoming request
    const empId = +req.body.empId;
    const day = req.body.day;
    const newTimeSlot = req.body.newTimeSlot;  

    let startDate = req.body.startDate;    
    let endDate = req.body.endDate;

    startDate = new Date(startDate).getTime();
    console.log(startDate);

    endDate = new Date(endDate).getTime();
    console.log(endDate);


    let statusKey;
    if(day.toLowerCase() == "monday")
    {
        statusKey = 0;
    }
    if(day.toLowerCase() == "tuesday")
    {
        statusKey = 1;
    }
    if(day.toLowerCase() == "wednesday")
    {
        statusKey = 2;
    }
    if(day.toLowerCase() == "thursday")
    {
        statusKey = 3;
    }
    if(day.toLowerCase() == "friday")
    {
        statusKey = 4;
    }
    if(day.toLowerCase() == "saturday")
    {
        statusKey = 5;
    }
    if(day.toLowerCase() == "sunday")
    {
        statusKey = 6;
    }
    
   
    Availability.findAvailByEmpIdAndDate(empId,startDate,endDate)
             .then(availDoc=>{               
                 if(!availDoc)
                 {
                     return res.json({ message:'Availability Does not exist',status:false});
                 }
                 
                 availDoc.timeslot[statusKey] = newTimeSlot;
                 
                 const db = getDb();
                 db.collection('availabilities').updateOne({empId:empId,startDate:startDate,endDate:endDate},{$set:availDoc})
                             .then(resultData=>{
                                 
                                 res.json({message:'Details Updated',status:true});
                             })
                             .catch(err=>console.log(err));

             })

}




