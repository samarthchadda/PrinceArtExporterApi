
const Tutor = require('../models/tutor');

const getDb = require('../util/database').getDB; 

// var nodemailer = require('nodemailer');

// var transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true, // use SSL
//     auth: {
//         user: 'samarthchadda@zohomail.com',
//         pass: 'q6v2Li0L8CAn'
//     }
// });

// var mailOptions = {
//     from: '"Our Code World " <samarthchadda@gmail.com>', // sender address (who sends)
//     to: 'samarthchadda@gmail.com', // list of receivers (who receives)
//     subject: 'Hello', // Subject line
//     text: 'Hello world ', // plaintext body
//     html: '<b>Hello world </b><br> This is the first email sent with Nodemailer in Node.js' // html body
// };

// // send mail with defined transport object
// transporter.sendMail(mailOptions, function(error, info){
//     if(error){
//         return console.log(error);
//     }

//     console.log('Message sent: ' + info.response);
 // });


// client Id = 1000.S1B7TJAEGYE7WP33H9WHUR9Y5K8U3W
// client secret = 485c422708fe85a5a85dcf75cc5f25a6d43c2c113a


const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:'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'
        
    }
}))


exports.getOwners=(req,res,next)=>{
  
    Owner.fetchAllOwners()
                .then(owners=>{
                   
                    res.json({message:"All Data returned",allOwners:owners})

                })
                .catch(err=>console.log(err));
}

//POST
exports.tutorRegister = (req,res,next)=>{
  
    let tutorID;
    //parsing data from incoming request    
    const phone = +req.body.phone;
    const password = req.body.password;
    const regDate = new Date().getTime();
    const deviceToken = req.body.deviceToken;

    Tutor.findTutorByPhone(phone)
                .then(userDoc=>{
                    if(userDoc){                        
                        return res.json({status:false, message:'Tutor Already Exists(Enter unique phone)',tutor:userDoc});
                    }
                   
                    const db = getDb();     
                    db.collection('tutorCounter').find().toArray().then(data=>{
        
                        newVal = data[data.length-1].count;
                       
                        newVal = newVal + 1;
                        console.log(newVal);
                       
                        tutorID = newVal;
                        
                        db.collection('tutorCounter').insertOne({count:newVal})
                                .then(result=>{
                                              
                            const tutor = new Tutor(tutorID,null,null,null,phone,password,null,null,null,null,null,null,null,false,regDate,deviceToken);
                            //saving in database
                        
                            return tutor.save()
                            .then(resultData=>{
                                
                                res.json({status:true,message:"Tutor Registered",tutor:resultData["ops"][0]});
                                
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
exports.tutorLogin=(req,res,next)=>{
    const phone = +req.body.email;
    const password = req.body.password;
    
    Tutor.findTutorByPhone(phone)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'Enter valid Phone',status:false});
                    }

                    if(user.password == password)
                    {                        
                        res.json({ message:'Login Successful',status:true, tutor:user});
                    }else{
                       
                        res.json({ message:'Enter valid credentials',status:false});
                    }
                })

}



exports.ownerCheckPhone=(req,res,next)=>{
    const phone = +req.body.phone;

    Owner.findOwnerByPhone(phone)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'User does not exist',status:false});
                    }                                       
                    res.json({ message:'User Exists',status:true, user:user});
                   
                })
}


exports.ownerCheckEmail=(req,res,next)=>{
    const email = req.body.email;

    Owner.findOwnerByEmail(email)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'User does not exist',status:false});
                    }                                       
                    res.json({ message:'User Exists',status:true, user:user});
                   
                })
}

exports.ownerById=(req,res,next)=>{
    const ownerId = +req.params.ownerId;

    Owner.findOwnerById(ownerId)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'User does not exist',status:false});
                    }                                       
                    res.json({ message:'User Exists',status:true, user:user});
                   
                })
}


exports.ownerResetPwd=(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;

    Owner.findOwnerByEmail(email)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'User does not exist',status:false});
                    }

                    user.password = password;
                   
                    const db = getDb();
                    db.collection('owners').updateOne({email:email},{$set:user})
                                .then(resultData=>{
                                    
                                    res.json({ message:'Password successfully changed',status:true});
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



exports.sendToken = (req,res,next)=>{

    const email = req.body.email;

    var token = "";

    var length = 6,
        // charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        charset = "123456789",        
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    token = retVal;

    transporter.sendMail({
        to:email,
        from:'samarthchadda@gmail.com',
        subject:'Fibi App - OTP',
        html:`
        <p> You requested a password reset</p>
        <br>
        6 Digit OTP Token : ${token}`
    })
    
    res.json({ message:'Token sent',status:true,email:req.body.email,token:+token});       

}



exports.editOwner=(req,res,next)=>{
    //parsing data from incoming request
    const ownerId = +req.body.ownerId;
    const ownerName = req.body.ownerName;
    const email = req.body.email;
    const phone = +req.body.phone;    

    Owner.findOwnerById(+ownerId)
             .then(ownerDoc=>{
                 if(!ownerDoc)
                 {
                     return res.json({ message:'Owner does not exist',status:false});
                 }
                
                 if(email!=null)
                 {                   
                    ownerDoc.email = email;
                   
                 }
                 else if(ownerName!=null)
                 {
                    ownerDoc.ownerName = ownerName;
                 }
                 else if(phone!=null)
                 {
                    ownerDoc.phone = phone;
                 }

                 const db = getDb();
                 db.collection('owners').updateOne({ownerId:ownerId},{$set:ownerDoc})
                             .then(resultData=>{
                                 
                                 res.json({message:'All Details Updated',status:true,owner:ownerDoc});
                             })
                             .catch(err=>console.log(err));
             })
}



exports.editTutorDesc=(req,res,next)=>{
    //parsing data from incoming request
    const tutorId = +req.body.tutorId;
    const descTitle = req.body.descTitle;
    const descContent = req.body.descContent;      

    Tutor.findTutorById(+tutorId)
             .then(ownerDoc=>{
                 if(!ownerDoc)
                 {
                     return res.json({ message:'Tutor does not exist',status:false});
                 }
                
                ownerDoc.descTitle = descTitle;
                ownerDoc.descContent = descContent;                               

                 const db = getDb();
                 db.collection('tutors').updateOne({tutorId:tutorId},{$set:ownerDoc})
                             .then(resultData=>{
                                 
                                 res.json({message:'Details Updated',status:true,tutor:ownerDoc});
                             })
                             .catch(err=>console.log(err));
             })
}


exports.delOwner=(req,res,next)=>{

    const ownerId = +req.params.ownerId;

    Owner.findOwnerById(JSON.parse(ownerId))
                    .then(owner=>{
                        if(!owner)
                        {
                            return res.json({ message:'Owner does not exist',status:false});
                        }

                        const db = getDb();
                        db.collection('owners').deleteOne({ownerId:ownerId})
                                    .then(resultData=>{
                                        
                                        res.json({message:'Owner Deleted',status:true});
                                    })
                                    .catch(err=>console.log(err));
                    })
}





exports.ownerVerify=(req,res,next)=>{
    //parsing data from incoming request
    const ownerId = +req.body.ownerId;
    const isVerified = req.body.isVerified;
   
    Owner.findOwnerById(ownerId)
            .then(owner=>{
                if(!owner)
                {
                    return res.json({ message:'Owner does not exist',status:false});
                }
                        
                owner.isVerified = isVerified;
                 
                 const db = getDb();
                 db.collection('owners').updateOne({ownerId:ownerId},{$set:owner})
                             .then(resultData=>{
                                 
                                 res.json({message:'Details Updated',status:true});
                             })
                             .catch(err=>console.log(err));

             })

}