
const Admin = require('../models/admin');

const getDb = require('../util/database').getDB; 

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:'SG.GGgOGXp9SgCLWQlvEq1u2A.oGDXf7IEdKLCIOxiWECoNOludYpAuITmwWXAdmCQEWM'
    }
}))

const crypto = require('crypto');


exports.allAdminData=(req,res,next)=>{
  
    Admin.fetchAllAdmins()
                .then(admins=>{                   
                    res.json({message:"All Data returned",admins:admins})

                })
                .catch(err=>console.log(err));
}





//POST
exports.adminRegister = (req,res,next)=>{
  
    //parsing data from incoming request
    const email = req.body.email;
    const password = req.body.password;    
  
    Admin.findAdminByEmail(email)
            .then(adminData=>{
                if(adminData){
                    
                    return res.json({status:false, message:'Already Registered'});
                }
                
                    //saving in database
                    const admin = new Admin(email,password);

                        return admin.save()
                        .then(resultData=>{
                            
                            res.json({status:true,message:"Admin Registered",admin:resultData["ops"][0]});
                            
                        })
                        .catch(err=>console.log(err));                      
            })
        .then(resultInfo=>{                   
            
        })
        .catch(err=>console.log(err));      

}





//LOGIN
exports.adminLogin=(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    Admin.findAdminByEmail(email)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'Admin Does not exist',status:false});
                    }

                    if(user.password == password)
                    {                        
                        res.json({ message:'Login Successful',status:true, admin:user});
                    }else{
                       
                        res.json({ message:'Login UnSuccessful....Password is incorrect',status:false});
                    }
                })
}



exports.adminForgotPwd=(req,res,next)=>{
    const email = req.body.email;
    const token = req.body.token;
    const newPassword = req.body.newPassword;
    Admin.findAdminByToken(token)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'Token Does not exist',status:false});
                    }

                    user.password = newPassword;
                    // console.log(user);
                   
                    const db = getDb();
                    db.collection('admins').updateOne({email:email},{$set:user})
                                .then(resultData=>{
                                    
                                    res.json({ message:'Password Changed',status:true});
                                })
                                .catch(err=>console.log(err));
                })
}

//api key,    SG.GGgOGXp9SgCLWQlvEq1u2A.oGDXf7IEdKLCIOxiWECoNOludYpAuITmwWXAdmCQEWM


exports.sendEmail = (req,res,next)=>{

    const email = req.body.email;

    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err);
        }

        const token = buffer.toString('hex');

        Admin.findAdminByEmail(email)
            .then(user=>{
                if(!user){
                    res.json({status:false,message:"User does not exist"});
                }

                //creating new properties
                user.resetToken = token;
                user.resetTokenExp = Date.now();

                const db = getDb();
                db.collection('admins').updateOne({email:email},{$set:user})
                            .then(resultData=>{

                                transporter.sendMail({
                                    to:email,
                                    from:'samarthchadda@gmail.com',
                                    subject:'Password Reset',
                                    html:`
                                    <p> You requested a password reset</p>
                                    <br>
                                    Token : ${token}`
                                })
                                
                                res.json({ message:'Token added',status:true});
                            })
                            .catch(err=>console.log(err));                


            })

    })



}

