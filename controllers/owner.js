
const Owner = require('../models/owner');

const getDb = require('../util/database').getDB; 



//POST
exports.ownerRegister = (req,res,next)=>{
  
    let onwerID;
    //parsing data from incoming request
    const ownerName = req.body.ownerName;
    const email = req.body.email;    
    const password = req.body.password;
    const ownerImg = null;
    const regDate = new Date().getTime();

    Owner.findOwnerByEmail(email)
                .then(userDoc=>{
                    if(userDoc){                        
                        return res.json({status:false, message:'Onwer Already Exists',owner:userDoc});
                    }
                   
                    const db = getDb();     
                    db.collection('ownerCounter').find().toArray().then(data=>{
        
                        newVal = data[data.length-1].count;
                       
                        newVal = newVal + 1;
                        console.log(newVal);
                       
                        onwerID = newVal;
                        
                        db.collection('ownerCounter').insertOne({count:newVal})
                                .then(result=>{
                                              
                            const owner = new Owner(onwerID,ownerName,email,password,ownerImg,regDate);
                            //saving in database
                        
                            return owner.save()
                            .then(resultData=>{
                                
                                res.json({status:true,message:"Owner Registered",owner:resultData["ops"][0]});
                                
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



//LOGIN
exports.ownerLogin=(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    
    Owner.findOwnerByEmail(email)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'Owner does not exist',status:false});
                    }

                    if(user.password == password)
                    {                        
                        res.json({ message:'Login Successful',status:true, owner:user});
                    }else{
                       
                        res.json({ message:'Login Unsuccessful....Password is incorrect',status:false});
                    }
                })

}

exports.parentForgotPwd=(req,res,next)=>{
    const phone = req.body.phone;
    const newPassword = req.body.newPassword;
    Parent.findUserByPhone(phone)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'User Does not exist',status:false});
                    }

                    user.password = newPassword;
                    // console.log(user);
                   
                    const db = getDb();
                    db.collection('parents').updateOne({phone:phone},{$set:user})
                                .then(resultData=>{
                                    
                                    res.json({ message:'Password Changed',status:true});
                                })
                                .catch(err=>console.log(err));


                })

}

exports.userData=(req,res,next)=>{
    const phone = req.body.phone;
    console.log(typeof phone);
   
    Parent.findUserByPhone(phone)
                .then(parent=>{
                    // console.log(parent);
                    if(!parent)
                    {
                        return res.json({ message:'User Does not exist',data:null});
                    }

                    res.json({ message:'User Exists',Data:parent});


                })

}



exports.editDeviceToken=(req,res,next)=>{
    const parent_phone = req.body.parent_phone;
    const device_token = req.body.device_token;

    Parent.findUserByPhone(parent_phone)
                .then(parent=>{
                    // console.log(parent);
                    if(!parent)
                    {
                        return res.json({ message:'User Does not exist',data:null});
                    }

                    parent.deviceToken = device_token;
                    // console.log(user);
                   
                    const db = getDb();
                    db.collection('parents').updateOne({phone:parent_phone},{$set:parent})
                                .then(resultData=>{
                                    
                                    res.json({ message:'Data Changed',status:true});
                                })
                                .catch(err=>console.log(err));



                })

  

}