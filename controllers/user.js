const User = require('../models/user');

const getDb = require('../util/database').getDB; 
var crypto = require('crypto'); 

const jwt = require('jsonwebtoken');

//POST
exports.signUpUser = (req,res,next)=>{

    const email = req.body.email;  
    const password = req.body.password;
    const name = req.body.name;
    var hash = crypto.createHash('sha256');
    hash.update(password);
    var hex = hash.digest('hex');

    User.findUserByEmail(email)
            .then(userDoc=>{
                if(userDoc){                        
                    return res.json({status:false, message:'User Already Exists(Enter unique email)',user:userDoc});
                }
        
                const db = getDb();     
                                                        
                const user = new User(email,hex,name);
                //saving in database
            
                return user.save()
                .then(resultData=>{
                    
                    res.json({status:true,message:"User Registered",user:resultData["ops"][0]});
                    
                })
                .catch(err=>console.log(err));                                                                                                                          
            })
            .then(resultInfo=>{                   
                
            })
            .catch(err=>console.log(err));      
}



//LOGIN
exports.signInUser=(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    var hash = crypto.createHash('sha256');
    hash.update(password);
    var hex = hash.digest('hex');
    // console.log(hex);
    User.findUserByEmail(email)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'User does not exist',status:false});
                    }

                    if(user.password == hex)
                    {                        
                        jwt.sign({user:user},'secretkey',{expiresIn:'7200s'},(err,token)=>{
                            res.json({
                                status:true,                                 
                                message:"Successfully Logged In",
                                user:user,
                                token:token                               
                            })
                        });
                    }else{
                       
                        res.json({ message:'Password is incorrect',status:false});
                    }
                })
}


exports.editUserDetails = (req,res,next)=>{

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    var hash = crypto.createHash('sha256');
    hash.update(password);
    var hex = hash.digest('hex');

    jwt.verify(req.token,'secretkey',(err,authData)=>{
        if(err)
        {
            res.sendStatus(403);
        }
        else{
            if(authData.user.email == email)
            {
                User.findUserByEmail(email)
                .then(userDoc=>{
                    if(!userDoc)
                    {
                        return res.json({ message:'User does not exist',status:false});
                    }
                             
                    userDoc.password = hex;
                    userDoc.name = name;
                
                    const db = getDb();
                    db.collection('users').updateOne({email:email},{$set:userDoc})
                                .then(resultData=>{
                                    
                                    res.json({ message:'User Details Changed Successfully',status:true,userDetails:userDoc,authData:authData});    
                                })
                                .catch(err=>console.log(err));
                })   
            }
            else{
                res.json({status:false,message:"Enter Logged In User Details"})
            }          
        }
    });
   
}


exports.forgotUserPassword = (req,res,next)=>{

    const email = req.body.email;
    const password = req.body.password;

    var hash = crypto.createHash('sha256');
    hash.update(password);
    var hex = hash.digest('hex');

    // jwt.verify(req.token,'secretkey',(err,authData)=>{
    //     if(err)
    //     {
    //         res.sendStatus(403);
    //     }
    //     else{
    //         if(authData.user.email == email)
    //         {
                User.findUserByEmail(email)
                .then(userDoc=>{
                    if(!userDoc)
                    {
                        return res.json({ message:'User does not exist',status:false});
                    }
                             
                    userDoc.password = hex;
                
                    const db = getDb();
                    db.collection('users').updateOne({email:email},{$set:userDoc})
                                .then(resultData=>{
                                    
                                    res.json({ message:'Password Changed Successfully',status:true,userDetails:userDoc,authData:authData});    
                                })
                                .catch(err=>console.log(err));
                })   
    //         }
    //         else{
    //             res.json({status:false,message:"Enter Logged In User Details"})
    //         }          
    //     }
    // });
   
}



