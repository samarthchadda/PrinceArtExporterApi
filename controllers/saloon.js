
const Saloon = require('../models/saloon');

const getDb = require('../util/database').getDB; 

var NodeGeocoder = require('node-geocoder');
 
var geocoder = NodeGeocoder({
    provider: 'opencage',
  apiKey: '3e5c1837f6424d34a41eac19b3816699',
   formatter: null // 
});



exports.getSaloons=(req,res,next)=>{
  
    Saloon.fetchAllSaloons()
                .then(saloons=>{
                   
                    res.json({message:"All Data returned",allSaloons:saloons})

                })
                .catch(err=>console.log(err));
}


exports.getSaloonsAddress=(req,res,next)=>{
  

    Saloon.fetchAllSaloons()
                .then(saloons=>{         
                            //         street no. and name, city,state pincode,country          
                           //example -- 277 Bedford Ave, Brooklyn, NY 11211, USA
                    geocoder.geocode('Inox Pink square,raja park, jaipur')
                    .then((result)=> {
                        console.log(result[0]);
                    })
                    .catch((err)=> {
                        console.log(err);
                    });

                    res.json({message:"All Data returned",allSaloons:saloons})

                })
                .catch(err=>console.log(err));
}



exports.getLimitSaloons=(req,res,next)=>{
  
    const limit = +req.params.limit;
    console.log(limit);
    const start = +req.params.start;
    console.log(start);
    

    Saloon.fetchLimitSaloons(JSON.parse(+limit),JSON.parse(+start))
                .then(saloons=>{
                   
                    res.json({message:limit+" Saloons returned",allSaloons:saloons})

                })
                .catch(err=>console.log(err));

}



//POST
exports.saloonRegister = (req,res,next)=>{
  
    let saloonID;
    //parsing data from incoming request
    const ownerId = +req.body.ownerId;
    const saloonName = req.body.saloonName;
    const phone = +req.body.phone;    
    const address = req.body.address;
    const photos = null;
    const isVerified = false;
    console.log(isVerified, typeof(isVerified));

    Saloon.findSaloonByPhone(phone)
                .then(saloonDoc=>{
                    if(saloonDoc){                        
                        return res.json({status:false, message:'Saloon Already Exists'});
                    }
                   
                    const db = getDb();     
                    db.collection('saloonCounter').find().toArray().then(data=>{
        
                        newVal = data[data.length-1].count;
                       
                        newVal = newVal + 1;
                        console.log(newVal);
                       
                        saloonID = newVal;
                        
                        db.collection('saloonCounter').insertOne({count:newVal})
                                .then(result=>{
                                              
                            const saloon = new Saloon(saloonID,ownerId,saloonName,phone,address,photos,isVerified);
                            //saving in database
                        
                            return saloon.save()
                            .then(resultData=>{
                                
                                res.json({status:true,message:"Saloon Registered",saloon:resultData["ops"][0]});
                                
                            })
                            .catch(err=>console.log(err));                                                    
                                  
                                })
                                .then(resultData=>{
                                   
                                })
                                .catch(err=>{
                                    res.json({status:false,error:err})
                                })             
                     })   

                })
                .then(resultInfo=>{                   
                  
                })
                .catch(err=>console.log(err));      

}


exports.saloonsByOwner=(req,res,next)=>{

    const ownerId = req.params.id;
    // console.log(phone);

    Saloon.fetchSaloonsByOwnerID(JSON.parse(ownerId))
                    .then(saloons=>{
                        if(saloons.length==0)
                        {
                            return res.json({ message:'Saloon does not exist',data:null});
                        }

                        res.json({message:"All Saloons returned",data:saloons});
                    })

}


exports.getSingleSaloon=(req,res,next)=>{

    const saloonId = req.params.id;
    // console.log(phone);

    Saloon.findSaloonBySaloonID(JSON.parse(saloonId))
                    .then(saloon=>{
                        if(!saloon)
                        {
                            return res.json({ message:'Saloon does not exist',data:null});
                        }

                        res.json({message:"Saloon exists",data:saloon});
                    })

}



//LOGIN
exports.facultyLogin=(req,res,next)=>{
    const phone = req.body.phone;
    const pwd = req.body.pwd;
    Faculty.findUserByPhone(phone)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'User Does not exist',Status:false});
                    }

                    if(user.Password === pwd)
                    {                        
                        res.json({ message:'Login Successful',status:true,user:user});
                    }else{
                       
                        res.json({ message:'Login UnSuccessful....Password is incorrect',status:false});
                    }
                })

}


exports.phoneVerify=(req,res,next)=>{
    //parsing data from incoming request
    const saloonId = +req.body.saloonId;
    const isVerified = req.body.isVerified;
   
    Saloon.findSaloonBySaloonID(saloonId)
            .then(saloon=>{
                if(!saloon)
                {
                    return res.json({ message:'Saloon does not exist',status:false});
                }
                        
                 saloon.isVerified = isVerified;
                 
                 const db = getDb();
                 db.collection('saloons').updateOne({saloonId:saloonId},{$set:saloon})
                             .then(resultData=>{
                                 
                                 res.json({message:'Details Updated',status:true});
                             })
                             .catch(err=>console.log(err));

             })

}


exports.editSaloon=(req,res,next)=>{
    //parsing data from incoming request
    const saloonId = +req.body.saloonId;
    const saloonName = req.body.saloonName;
    const address = req.body.address;
   
    Saloon.findSaloonBySaloonID(JSON.parse(saloonId))
             .then(saloonDoc=>{
                 if(!saloonDoc)
                 {
                     return res.json({ message:'Saloon does not exist',status:false});
                 }
                
                 saloonDoc.saloonName = saloonName;
                 saloonDoc.address = address;
                 
                 const db = getDb();
                 db.collection('saloons').updateOne({saloonId:saloonId},{$set:saloonDoc})
                             .then(resultData=>{
                                 
                                 res.json({message:'Details Updated',status:true});
                             })
                             .catch(err=>console.log(err));
             })
}




exports.delSaloonPhoto=(req,res,next)=>{

    //parsing data from incoming request
    const saloonId = +req.body.saloonId;
    const imageUrl = req.body.imageUrl;

    Saloon.findSaloonBySaloonID(JSON.parse(saloonId))
             .then(saloonDoc=>{
                 if(!saloonDoc)
                 {
                     return res.json({ message:'Saloon does not exist',status:false});
                 }
                
                 let index = saloonDoc.saloonPhotos.indexOf(imageUrl);
                 console.log(index);
                 saloonDoc.saloonPhotos.splice(index,1);
                 
                 const db = getDb();
                 db.collection('saloons').updateOne({saloonId:saloonId},{$set:saloonDoc})
                             .then(resultData=>{
                                 
                                 res.json({message:'Saloon photo deleted',status:true});
                             })
                             .catch(err=>console.log(err));
             })
}

