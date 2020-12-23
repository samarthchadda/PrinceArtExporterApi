const Admin = require('../models/admin');

const getDb = require('../util/database').getDB; 


//POST
exports.adminRegister = (req,res,next)=>{
    
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;    
    const phone = +req.body.phone;
    const password = req.body.password;

    Admin.findAdminByEmail(email)
                .then(userDoc=>{
                    if(userDoc){                        
                        return res.json({status:false, message:'Admin Already Exists(Enter unique email and phone)',admin:userDoc});
                    }
                                       
                    Admin.findAdminByPhone(phone)
                    .then(userDoc=>{
                        if(userDoc){                        
                            return res.json({status:false, message:'Admin Already Exists(Enter unique email and phone)',admin:userDoc});
                        }

                    const db = getDb();     
                                                            
                        const admin = new Admin(firstName,lastName,email,password,phone);
                        //saving in database
                    
                        return admin.save()
                        .then(resultData=>{
                            
                            res.json({status:true,message:"Admin Registered",owner:resultData["ops"][0]});
                            
                        })
                        .catch(err=>console.log(err));                                                    
                                                                                  
                    })
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
                        return res.json({ message:'Admin does not exist',status:false});
                    }

                    if(user.password == password)
                    {                        
                        res.json({ message:'Login Successful',status:true, admin:user});
                    }else{
                       
                        res.json({ message:'Password is incorrect',status:false});
                    }
                })
}



