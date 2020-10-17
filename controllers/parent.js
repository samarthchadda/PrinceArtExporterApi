
const Parent = require('../models/parent');

const getDb = require('../util/database').getDB; 



//POST
exports.parentRegister = (req,res,next)=>{
  
    //parsing data from incoming request
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;    
    const email = req.body.email;
    const phone = req.body.phone
    const password = req.body.password;
    const token = req.body.token;

    Parent.findUserByPhone(phone)
                .then(userDoc=>{
                    if(userDoc){
                        
                        return res.json({status:false, message:'User Already Exists'});
                    }
                   
                    const parent = new Parent(firstName,lastName,email,phone,password,token,null);
                    //saving in database
                   
                    return parent.save()
                    .then(resultData=>{
                        
                        res.json({status:true,message:"User Registered",parent:resultData["ops"][0]});
                        
                    })
                    .catch(err=>console.log(err));

                })
                .then(resultInfo=>{
                   
                  
                })
                .catch(err=>console.log(err));      

}


//LOGIN
exports.parentLogin=(req,res,next)=>{
    const phone = req.body.phone;
    const password = req.body.password;
    Parent.findUserByPhone(phone)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'User Does not exist',status:false});
                    }

                    if(user.password == password)
                    {                        
                        res.json({ message:'Login Successful',status:true, user:user});
                    }else{
                       
                        res.json({ message:'Login UnSuccessful....Password is incorrect',status:false});
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