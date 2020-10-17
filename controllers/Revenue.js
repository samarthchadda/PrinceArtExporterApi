
const Revenue = require('../models/Revenue');

const getDb = require('../util/database').getDB; 


exports.postCoursePayment = (req,res,next)=>{
  
    //parsing data from incoming request
    const parent_name = req.body.parent_name;
    const parent_phone = req.body.parent_phone;    
    const course_name = req.body.course_name;
    const amount = req.body.amount;    
    const payment_bundle = req.body.payment_bundle;   
   

    const revenue = new Revenue(parent_name,parent_phone,course_name,amount,payment_bundle);

    return revenue.save()
    .then(resultData=>{
        
        res.json({status:true,message:"Revenue Details Stored",Revenue:resultData["ops"][0]});
        
    })
    .catch(err=>console.log(err));       
       

}



exports.getAllCourseRevenue=(req,res,next)=>{
  
    Revenue.fetchAllCourseRevenue()
                .then(revenues=>{
                   
                    res.json({message:"All Data returned",revenues:revenues})

                })
                .catch(err=>console.log(err));

}




exports.postAppointPayment = (req,res,next)=>{
  
    //parsing data from incoming request
    const parent_name = req.body.parent_name;
    const parent_phone = req.body.parent_phone;    
    const fac_name = req.body.fac_name;
    const fac_phone = req.body.fac_phone;   
    const amount = req.body.amount;    
    const payment_bundle = req.body.payment_bundle;   
   
    Revenue.appointRevenue(parent_name,parent_phone,fac_name,fac_phone,amount,payment_bundle)
    .then(revenueData=>{
        
         res.status(200).json({status:true,message:"Revenue Details Stored",Data:revenueData["ops"][0]});

     })
     .catch(err=>console.log(err));
       

}





exports.getAllAppointRevenue=(req,res,next)=>{
  
    Revenue.fetchAllAppointRevenue()
                .then(revenues=>{
                   
                    res.json({message:"All Data returned",revenues:revenues})

                })
                .catch(err=>console.log(err));

}