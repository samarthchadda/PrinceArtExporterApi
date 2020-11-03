
const Availability = require('../models/availability');

const getDb = require('../util/database').getDB; 


exports.getAllEmpAvailData=(req,res,next)=>{
  
    Availability.fetchAllEmpAvails()
                .then(avails=>{                   
                    res.json({message:"All employee data returned",avails:avails})

                })
                .catch(err=>console.log(err));
}

exports.getAllSaloonAvailData=(req,res,next)=>{
  
    Availability.fetchAllSaloonAvails()
                .then(avails=>{                   
                    res.json({message:"All saloon sata returned",avails:avails})

                })
                .catch(err=>console.log(err));
}


exports.getSingleEmpAvailData=(req,res,next)=>{
  
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

exports.getSingleSaloonAvailData=(req,res,next)=>{
  
    const saloonId = +req.params.saloonId;
   
    Availability.findAvailBySaloonId(JSON.parse(saloonId))
    .then(availDoc=>{
       
        if(availDoc){
           
             res.json({status:true, data:availDoc});
        }
        else{
            res.json({status:false,message:"No such availability exist"});
        }          

    })    
}


exports.getSingleEmpAvailDataByDate=(req,res,next)=>{
  
    const empId = +req.body.empId;

    let startDate = req.body.startDate;    
    let endDate = req.body.endDate;
    startDate = new Date(startDate).getTime();
    console.log(startDate);

    endDate = new Date(endDate).getTime();
    console.log(endDate);
   
    Availability.findAvailByEmpIdAndDate(empId,startDate,endDate)
    .then(availDoc=>{
       
        if(availDoc){
           
            // console.log(new Date(availDoc.startDate))
             res.json({status:true, data:availDoc});
        }
        else{
            res.json({status:false,message:"No such availability exist"});
        }          

    })    
}


exports.getSingleSaloonAvailDataByDate=(req,res,next)=>{
  
    const saloonId = +req.body.saloonId;

    let startDate = req.body.startDate;    
    let endDate = req.body.endDate;
    startDate = new Date(startDate).getTime();
    console.log(startDate);

    endDate = new Date(endDate).getTime();
    console.log(endDate);
   
    Availability.findAvailBySaloonIdAndDate(saloonId,startDate,endDate)
    .then(availDoc=>{
       
        if(availDoc){
           
            // console.log(new Date(availDoc.startDate))
             res.json({status:true, data:availDoc});
        }
        else{
            res.json({status:false,message:"No such availability exist"});
        }          

    })    
}



//POST
exports.availEmpRegister = (req,res,next)=>{
  
    //parsing data from incoming request
    const empId = +req.body.empId;
    const saloonId = null;    
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
                    
                    availData.availStatus = availStatus;
                    availData.timeslot = timeslot;
                    const db = getDb();
                    return db.collection('availabilities').updateOne({empId:empId,startDate:startDate,endDate:endDate},{$set:availData})
                                .then(resultData=>{
                                    
                                   return res.json({message:'Details Updated',status:true});
                                })
                                .catch(err=>console.log(err));
                    // return res.json({status:false, message:'Availability already registered for this week'});
                }
                
                    //saving in database
                    const availability = new Availability(empId,saloonId,availStatus,timeslot,startDate,endDate);

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



exports.availSaloonRegister = (req,res,next)=>{
  
    //parsing data from incoming request
    const empId = null;
    const saloonId = +req.body.saloonId;    
    const availStatus = req.body.availStatus;    
    const timeslot = req.body.timeslot;
    let startDate = req.body.startDate;    
    let endDate = req.body.endDate;

    startDate = new Date(startDate).getTime();
    console.log(startDate);

    endDate = new Date(endDate).getTime();
    console.log(endDate);

    Availability.findAvailBySaloonIdAndDate(saloonId,startDate,endDate)
            .then(availData=>{
                if(availData){
                    availData.availStatus = availStatus;
                    availData.timeslot = timeslot;
                    const db = getDb();
                    return db.collection('availabilities').updateOne({saloonId:saloonId,startDate:startDate,endDate:endDate},{$set:availData})
                                .then(resultData=>{
                                    
                                   return res.json({message:'Details Updated',status:true});
                                })
                                .catch(err=>console.log(err));
                    // return res.json({status:false, message:'Availability already registered for this week'});
                }
                
                    //saving in database
                    const availability = new Availability(empId,saloonId,availStatus,timeslot,startDate,endDate);

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



exports.availEmpEdit = (req,res,next)=>{
  
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
    .then(availDoc=>{                
        if(!availDoc)
        {
            return res.json({ message:'Availability does not exist',status:false});
        }
        
        availDoc.availStatus = availStatus;
        availDoc.timeslot = timeslot;
                
        const db = getDb();
        db.collection('availabilities').updateOne({empId:empId,startDate:startDate,endDate:endDate},{$set:availDoc})
                    .then(resultData=>{
                        
                        res.json({message:'Details Updated',status:true});
                    })
                    .catch(err=>console.log(err));
    }) 

}



exports.availSaloonEdit = (req,res,next)=>{
  
    //parsing data from incoming request
    const saloonId = +req.body.saloonId;
    const availStatus = req.body.availStatus;    
    const timeslot = req.body.timeslot;
    let startDate = req.body.startDate;    
    let endDate = req.body.endDate;

    startDate = new Date(startDate).getTime();
    console.log(startDate);

    endDate = new Date(endDate).getTime();
    console.log(endDate);

    Availability.findAvailBySaloonIdAndDate(saloonId,startDate,endDate)
    .then(availDoc=>{                
        if(!availDoc)
        {
            return res.json({ message:'Availability does not exist',status:false});
        }
        
        availDoc.availStatus = availStatus;
        availDoc.timeslot = timeslot;
                
        const db = getDb();
        db.collection('availabilities').updateOne({saloonId:saloonId,startDate:startDate,endDate:endDate},{$set:availDoc})
                    .then(resultData=>{
                        
                        res.json({message:'Details Updated',status:true});
                    })
                    .catch(err=>console.log(err));
    }) 
}



exports.editEmpAvailStatus=(req,res,next)=>{
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



exports.editSaloonAvailStatus=(req,res,next)=>{
    //parsing data from incoming request
    const saloonId = +req.body.saloonId;
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
    
   
    Availability.findAvailBySaloonIdAndDate(saloonId,startDate,endDate)
             .then(availDoc=>{                
                 if(!availDoc)
                 {
                     return res.json({ message:'Availability does not exist',status:false});
                 }
                 
                 availDoc.availStatus[statusKey] = newStatus;
                 
                 const db = getDb();
                 db.collection('availabilities').updateOne({saloonId:saloonId,startDate:startDate,endDate:endDate},{$set:availDoc})
                             .then(resultData=>{
                                 
                                 res.json({message:'Details Updated',status:true});
                             })
                             .catch(err=>console.log(err));
             })

}



exports.editEmpAvailTimeslot=(req,res,next)=>{
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


exports.editSaloonAvailTimeslot=(req,res,next)=>{
    //parsing data from incoming request
    const saloonId = +req.body.saloonId;
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
    
   
    Availability.findAvailBySaloonIdAndDate(saloonId,startDate,endDate)
             .then(availDoc=>{               
                 if(!availDoc)
                 {
                     return res.json({ message:'Availability Does not exist',status:false});
                 }
                 
                 availDoc.timeslot[statusKey] = newTimeSlot;
                 
                 const db = getDb();
                 db.collection('availabilities').updateOne({saloonId:saloonId,startDate:startDate,endDate:endDate},{$set:availDoc})
                             .then(resultData=>{
                                 
                                 res.json({message:'Details Updated',status:true});
                             })
                             .catch(err=>console.log(err));

             })

}




