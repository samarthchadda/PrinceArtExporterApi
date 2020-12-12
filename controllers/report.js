const Report = require('../models/report');
const getDb = require('../util/database').getDB; 


exports.postReportData = (req,res,next)=>{
   
    let email = req.body.email; 
    let phone = +req.body.phone;
    let description = req.body.description;    
    let screenShot = req.body.screenShot;    

    const db = getDb();     
    
    const report = new Report(email,phone,description,screenShot);
    //saving in database
    
    report.save()
    .then(resultData=>{
        
        res.json({status:true,message:"Report submitted",service:resultData["ops"][0]});
        
    })
    .catch(err=>console.log(err));                          
                   
}
