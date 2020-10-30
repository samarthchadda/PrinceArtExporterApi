const Service = require('../models/services');
const Saloon = require('../models/saloon');
const getDb = require('../util/database').getDB; 



exports.postServiceData = (req,res,next)=>{
      
    let serviceId;
    //parsing data from incoming request
    const saloonId = +req.body.saloonId;   
    const serviceNm = req.body.serviceNm 
    const description = req.body.description;
    const cost = +req.body.cost;    
    const time = req.body.time;    

    let newVal;
    const db = getDb();     
    db.collection('serviceCounter').find().toArray().then(data=>{
        
        newVal = data[data.length-1].count;
       
        newVal = newVal + 1;
        console.log(newVal);
       
        serviceId = newVal;
        
        db.collection('serviceCounter').insertOne({count:newVal})
                .then(result=>{

                    Saloon.findSaloonBySaloonID(saloonId)
                    .then(saloon=>{
                        if(!saloon){                        
                            return res.json({status:false, message:'Saloon does not exist'});
                        }

                        const service = new Service(serviceId,saloonId,serviceNm,cost,time,description);
                        //saving in database
                       
                        return service.save()
                        .then(resultData=>{
                            
                            res.json({status:true,message:"Service Added",service:resultData["ops"][0]});
                            
                        })
                        .catch(err=>console.log(err));     

                    }).catch(err=>console.log(err));

                                 
                  
                })
                .then(resultData=>{
                   
                })
                .catch(err=>{
                    res.json({status:false,error:err})
                })             
     })   
   
}


exports.getAllServices=(req,res,next)=>{
    
    Service.fetchAllServices()
                .then(services=>{
                   
                    res.json({message:"All Data returned",services:services})

                })
                .catch(err=>console.log(err));

}




exports.getSingleService=(req,res,next)=>{
  
    const serviceId = req.params.serviceId;
   
    Service.findServiceByServiceID(JSON.parse(serviceId))
    .then(serviceDoc=>{
       
        if(serviceDoc){
           
             res.json({status:true, data:serviceDoc});
        }
        else{
            res.json({status:false,message:"No such service exist"});
        }          

    })    
}



exports.getSaloonServices=(req,res,next)=>{

    const saloonId = req.params.saloonId;

    Service.findServicesBySaloonID(JSON.parse(saloonId))
                    .then(services=>{
                        if(services.length==0)
                        {
                            return res.json({ message:'Service does not exist',data:services});
                        }

                        res.json({message:"All Services returned",data:services});
                    })

}



exports.editService=(req,res,next)=>{
    //parsing data from incoming request
    const serviceId = +req.body.serviceId;
    const name = req.body.name;
    const description = req.body.description;
    const cost = req.body.cost;    
    const time = req.body.time;       
   
    Service.findServiceByServiceID(serviceId)
             .then(serviceDoc=>{
                 if(!serviceDoc)
                 {
                     return res.json({ message:'Service does not exist',status:false});
                 }
                
                 serviceDoc.serviceName = name;
                 serviceDoc.description = description;
                 serviceDoc.cost = cost;
                 serviceDoc.time = time;
                 
                 const db = getDb();
                 db.collection('services').updateOne({serviceId:serviceId},{$set:serviceDoc})
                             .then(resultData=>{
                                 
                                 res.json({message:'Details Updated',status:true});
                             })
                             .catch(err=>console.log(err));
             })
}


exports.delService=(req,res,next)=>{

    const serviceId = +req.params.serviceId;

    Service.findServiceByServiceID(JSON.parse(serviceId))
                    .then(service=>{
                        if(!service)
                        {
                            return res.json({ message:'Service does not exist',status:false});
                        }

                        const db = getDb();
                        db.collection('services').deleteOne({serviceId:serviceId})
                                    .then(resultData=>{
                                        
                                        res.json({message:'Service Deleted',status:true});
                                    })
                                    .catch(err=>console.log(err));
                    })
}


