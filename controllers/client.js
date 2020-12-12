
const Client = require('../models/client');

const getDb = require('../util/database').getDB; 


//POST
// exports.clientRegister = (req,res,next)=>{
  
//     let clientID;
//     //parsing data from incoming request
//     const clientName = req.body.clientName;
//     const phone = +req.body.phone;
//     const email = req.body.email;    
//     const password = req.body.password;
//     const image = null;

//     Client.findClientByEmail(email)
//                 .then(userDoc=>{
//                     if(userDoc){                        
//                         return res.json({status:false, message:'Client Already Exists'});
//                     }
                   
//                     const db = getDb();     
//                     db.collection('clientCounter').find().toArray().then(data=>{
        
//                         newVal = data[data.length-1].count;
                       
//                         newVal = newVal + 1;
//                         console.log(newVal);
                       
//                         clientID = newVal;
                        
//                         db.collection('clientCounter').insertOne({count:newVal})
//                                 .then(result=>{
                                              
//                             const client = new Client(clientID,clientName,phone,email,password,image);
//                             //saving in database
                        
//                             return client.save()
//                             .then(resultData=>{
                                
//                                 res.json({status:true,message:"Client Registered",client:resultData["ops"][0]});
                                
//                             })
//                             .catch(err=>console.log(err));                                                    
                                  
//                                 })
//                                 .then(resultData=>{
                                   
//                                 })
//                                 .catch(err=>{
//                                     res.json({status:false,error:err})
//                                 })             
//                      })   

//                 })
//                 .then(resultInfo=>{                   
                  
//                 })
//                 .catch(err=>console.log(err));      
// }




exports.getClients=(req,res,next)=>{
  
    Client.fetchAllClients()
                .then(owners=>{
                   
                    res.json({message:"All Data returned",allClients:owners})

                })
                .catch(err=>console.log(err));
}

exports.getSingleClient=(req,res,next)=>{
    
    const id = +req.params.id;
   
    Client.findClientByClientId(JSON.parse(id))
                .then(appoint=>{
                    if(!appoint)
                    {
                        return res.json({status:false, message:'Client does not exist',data:null});
                    }

                    res.json({status:true, message:'Client exists',client:appoint});
                })

}


//LOGIN
exports.clientLogin=(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    
    Client.findClientByEmail(email)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'Client does not exist',status:false});
                    }

                    if(user.password == password)
                    {                        
                        res.json({ message:'Login Successful',status:true, client:user});
                    }else{
                       
                        res.json({ message:'Login Unsuccessful....Password is incorrect',status:false});
                    }
                })
}



exports.clientCheckEmail=(req,res,next)=>{
    const email = req.body.email;

    Client.findClientByEmail(email)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'User does not exist',status:false});
                    }                                       
                    res.json({ message:'User Exists',status:true, user:user});
                   
                })
}


exports.clientCheckPhone=(req,res,next)=>{
    const phone = +req.body.phone;

    Client.findClientByPhone(phone)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'User does not exist',status:false});
                    }                                       
                    res.json({ message:'User Exists',status:true, user:user});
                   
                })
}



exports.editClientEmail=(req,res,next)=>{
    //parsing data from incoming request
    const clientId = +req.body.clientId;
    const email = req.body.email;
   
    Client.findClientByClientId(JSON.parse(+clientId))
             .then(clientDoc=>{
                 if(!clientDoc)
                 {
                     return res.json({ message:'Client does not exist',status:false});
                 }              

                //  Client.findClientByEmail(email)
                //  .then(client=>{
                //      if(client)
                //      {
                //          return res.json({ message:'Email already exists',status:false});
                //      }
                     
                     clientDoc.email = email;
                 
                     const db = getDb();
                     db.collection('clients').updateOne({clientId:clientId},{$set:clientDoc})
                                 .then(resultData=>{
                                     
                                     res.json({message:'Details Updated',status:true,client:clientDoc});
                                 })
                                 .catch(err=>console.log(err));
                    // })                
             })
}



exports.editClientPhone=(req,res,next)=>{
    //parsing data from incoming request
    const clientId = +req.body.clientId;
    const phone = +req.body.phone;
   
    Client.findClientByClientId(JSON.parse(+clientId))
             .then(clientDoc=>{
                 if(!clientDoc)
                 {
                     return res.json({ message:'Client does not exist',status:false});
                 }              

                //  Client.findClientByEmail(email)
                //  .then(client=>{
                //      if(client)
                //      {
                //          return res.json({ message:'Email already exists',status:false});
                //      }
                     
                     clientDoc.phone = phone;
                 
                     const db = getDb();
                     db.collection('clients').updateOne({clientId:clientId},{$set:clientDoc})
                                 .then(resultData=>{
                                     
                                     res.json({message:'Details Updated',status:true,client:clientDoc});
                                 })
                                 .catch(err=>console.log(err));
                    // })                
             })
}

exports.editClientName=(req,res,next)=>{
    //parsing data from incoming request
    const clientId = +req.body.clientId;
    const clientName = req.body.clientName;
   
    Client.findClientByClientId(JSON.parse(+clientId))
             .then(clientDoc=>{
                 if(!clientDoc)
                 {
                     return res.json({ message:'Client does not exist',status:false});
                 }              

                //  Client.findClientByEmail(email)
                //  .then(client=>{
                //      if(client)
                //      {
                //          return res.json({ message:'Email already exists',status:false});
                //      }
                     
                     clientDoc.clientName = clientName;
                 
                     const db = getDb();
                     db.collection('clients').updateOne({clientId:clientId},{$set:clientDoc})
                                 .then(resultData=>{
                                     
                                     res.json({message:'Details Updated',status:true,client:clientDoc});
                                 })
                                 .catch(err=>console.log(err));
                    // })                
             })
}



exports.clientResetPwd=(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;

    Client.findClientByEmail(email)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'User does not exist',status:false});
                    }

                    user.password = password;
                   
                    const db = getDb();
                    db.collection('clients').updateOne({email:email},{$set:user})
                                .then(resultData=>{
                                    
                                    res.json({ message:'Password successfully changed',status:true,user:user});
                                })
                                .catch(err=>console.log(err));
                })
}
