
const Faculty = require('../models/faculty');

const getDb = require('../util/database').getDB; 



exports.getFaculties=(req,res,next)=>{
  
    Faculty.fetchAllFaculties()
                .then(faculties=>{
                   
                    res.json({message:"All Data returned",AllFaculties:faculties})

                })
                .catch(err=>console.log(err));

}


exports.getSingleFaculty=(req,res,next)=>{

    const phone = req.params.id;
    // console.log(phone);

    Faculty.findUserByPhone(JSON.parse(phone))
                    .then(user=>{
                        if(!user)
                        {
                            return res.json({ message:'Faculty Does not exist',data:null});
                        }

                        res.json({ message:'Faculty Exists',faculty:user});
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

exports.facultyForgotPwd=(req,res,next)=>{
    const phone = req.body.phone;
    const newPwd = req.body.newPwd;
    Faculty.findUserByPhone(phone)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'User Does not exist',Status:false});
                    }

                    user.Password = newPwd;
                    // console.log(user);
                   
                    const db = getDb();
                    db.collection('faculties').updateOne({Phone:phone},{$set:user})
                                .then(resultData=>{
                                    
                                    res.json({ message:'Password Changed',Status:true});
                                })
                                .catch(err=>console.log(err));

                })

}



exports.addFacToken=(req,res,next)=>{
    const phone = req.body.phone;
    const token = req.body.token;
    Faculty.findUserByPhone(phone)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'User Does not exist',Status:false});
                    }

                    user.Token = token;
                    // console.log(user);
                   
                    const db = getDb();
                    db.collection('faculties').updateOne({Phone:phone},{$set:user})
                                .then(resultData=>{
                                    
                                    res.json({ message:'Token Changed',Status:true});
                                })
                                .catch(err=>console.log(err));

                })

}



exports.adminEditFaculty=(req,res,next)=>{
  
    //parsing data from incoming request
    const name = req.body.name;
    const phone = req.body.phone;    
    const password = req.body.password;
    const category = req.body.category;
    const fee = req.body.fee;  

    Faculty.findUserByPhone(phone)
                .then(faculty=>{
                    if(!faculty)
                    {
                        return res.json({ message:'Faculty Does not exist',Status:false});
                    }

                    faculty.Name = name;
                    faculty.Password = password;
                    faculty.Category = category;
                    faculty.Fees = fee;                   

                   
                    const db = getDb();
                    db.collection('faculties').updateOne({Phone:phone},{$set:faculty})
                                .then(resultData=>{
                                    
                                    res.json({ message:'Data Changed',Status:true});
                                })
                                .catch(err=>console.log(err));


                })

}


exports.postAppointFaculty = (req,res,next)=>{
  
    //parsing data from incoming request
    const name = req.body.name;
    const phone = req.body.phone;    
    const password = req.body.password;
    const category = req.body.category;
    const fee = req.body.fee;  
    const token = null;
    const timeSlot = req.body.timeSlot;
    const perShare = req.body.perShare;

    // console.log(req.file.path);

    Faculty.findAppointFacultyByPhone(phone)
                .then(userDoc=>{
                    if(userDoc){
                        
                        return res.json({status:false, message:'User Already Exists'});
                    }
                   
                
                    Faculty.appointFaculties(name,phone,password,category,null,fee,token,timeSlot,perShare)
                       .then(facData=>{
                           
                            res.status(200).json({status:true,Data:facData["ops"][0]});
       
                        })
                        .catch(err=>console.log(err));


                })
                .then(resultInfo=>{                   
                  
                })
                .catch(err=>console.log(err));      

}



exports.loginAppointFaculty=(req,res,next)=>{
    const phone = req.body.phone;
    const pwd = req.body.pwd;
    Faculty.findAppointFacultyByPhone(phone)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'User Does not exist',status:false});
                    }

                    if(user.Password === pwd)
                    {                        
                        res.json({ message:'Login Successful',status:true,user:user});
                    }else{
                       
                        res.json({ message:'Login UnSuccessful....Password is incorrect',status:false});
                    }
                })

}


exports.getAppointFaculties=(req,res,next)=>{
  
    Faculty.fetchAllAppointFaculties()
                .then(faculties=>{
                   let facTime=[];
                   
                    faculties.forEach(fac=>{
                        // console.log(fac.TimeSlot);
                        fac.TimeSlot.forEach(f=>{
                                // console.log(f.startTime);
                            facTime.push({fac_phone:fac.Phone,TimeSlot:f.startTime+" - "+f.endTime});

                        })
                    })
                    console.log(facTime);

                    res.json({message:"All Data returned",AllFaculties:faculties,timeSlot:facTime})

                })
                .catch(err=>console.log(err));

}

exports.getSingleAppointFaculty=(req,res,next)=>{

    const phone = req.params.id;
    // console.log(phone);

    Faculty.findAppointFacultyByPhone(JSON.parse(phone))
                    .then(user=>{
                        if(!user)
                        {
                            return res.json({ message:'Faculty Does not exist',data:null});
                        }

                        res.json({ message:'Faculty Exists',faculty:user});
                    })

}


exports.adminEditAppointFaculty=(req,res,next)=>{
  
     //parsing data from incoming request
     const name = req.body.name;
     const phone = req.body.phone;    
     const password = req.body.password;
     const category = req.body.category;
     const fee = req.body.fee;      
     const timeSlot = req.body.timeSlot;
     const perShare = req.body.perShare;


    Faculty.findAppointFacultyByPhone(phone)
                .then(faculty=>{
                    if(!faculty)
                    {
                        return res.json({ message:'Faculty Does not exist',Status:false});
                    }

                    faculty.Name = name;
                    faculty.Password = password;
                    faculty.Category = category;
                    faculty.Fees = fee;         
                    faculty.TimeSlot = timeSlot;         
                    faculty.PercentageShare = perShare;         
                              

                   
                    const db = getDb();
                    db.collection('appointmentFaculties').updateOne({Phone:phone},{$set:faculty})
                                .then(resultData=>{
                                    
                                    res.json({ message:'Data Changed',status:true});
                                })
                                .catch(err=>console.log(err));


                })

}


exports.addAppFacToken=(req,res,next)=>{
    const phone = req.body.phone;
    const token = req.body.token;
    Faculty.findAppointFacultyByPhone(phone)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'User Does not exist',Status:false});
                    }

                    user.Token = token;
                    // console.log(user);
                   
                    const db = getDb();
                    db.collection('appointmentFaculties').updateOne({Phone:phone},{$set:user})
                                .then(resultData=>{
                                    
                                    res.json({ message:'Token Changed',Status:true});
                                })
                                .catch(err=>console.log(err));

                })

}




exports.editAppointFacultyTS=(req,res,next)=>{
    const phone = req.body.phone;
    const timeslot = req.body.timeslot;
   
    Faculty.findAppointFacultyByPhone(phone)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'User Does not exist',status:false});
                    }

                    user.TimeSlot = timeslot;
                    // console.log(user);
                   
                    const db = getDb();
                    db.collection('appointmentFaculties').updateOne({Phone:phone},{$set:user})
                                .then(resultData=>{
                                    
                                    res.json({ message:'TimeSlot Changed',status:true});
                                })
                                .catch(err=>console.log(err));

                })

}






