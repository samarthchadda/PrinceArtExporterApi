const Appointment = require('../models/appointment');
const getDb = require('../util/database').getDB; 


exports.postAppointment = (req,res,next)=>{
  

    let appointmentID;
    const faculty_phone = req.body.faculty_phone ;
    const parent_phone = req.body.parent_phone;
    let appointmentDate = req.body.appointmentDate;
    appointmentDate = new Date(appointmentDate).getTime();
    console.log(appointmentDate);
    const timeSlot = req.body.timeSlot;
    const fac_name = req.body.fac_name;
    const fac_cat = req.body.fac_cat;
    const status = 0;
    const device_ID = req.body.device_ID;

        let newVal;
        const db = getDb();     
        db.collection('appCounter').find().toArray().then(data=>{
            
            newVal = data[data.length-1].app;
           
            newVal = newVal + 1;
           
            appointmentID = newVal;
            
            db.collection('appCounter').insertOne({app:newVal})
                    .then(result=>{

                        
                        const appointment = new Appointment(appointmentID,faculty_phone,parent_phone,appointmentDate,timeSlot,null,fac_name,fac_cat,status,device_ID);
                        //saving in database
                    
                        appointment.save()
                        .then(resultData=>{
                            
                            // return resultData["ops"][0];
                            return res.json({status:true,message:"Appointment Created ",data:resultData["ops"][0]});
                            
                        })
                        .catch(err=>console.log(err));
                    })
                    .then(resultData=>{
                       
                    })
                    .catch(err=>{
                        res.json({status:false,message:"Appointment Creation Failed ",error:err})
                    })                 
            
        })   
    
}


exports.getAllAppointment=(req,res,next)=>{
    
    Appointment.fetchAllAppointments()
                .then(appointments=>{
                   
                    res.json({message:"All Data returned",allAppointments:appointments})

                })
                .catch(err=>console.log(err));

}


exports.getSingleAppointment=(req,res,next)=>{
    
    const id = req.params.id;
   
    Appointment.findAppointByID(JSON.parse(id))
                .then(appoint=>{
                    if(!appoint)
                    {
                        return res.json({ message:'Appointment Does not exist',data:null});
                    }

                    res.json({ message:'Appointment Exists',appointment:appoint});
                })

}

exports.getAppointByParent=(req,res,next)=>{
    
    const phone = req.body.phone;
   
    Appointment.findAppointByParent(phone)
                .then(appoint=>{
                    if(appoint.length==0)
                    {
                        return res.json({ message:'Appointment Does not exist',appointment:appoint});
                    }

                    res.json({ message:'Appointment Exists',appointment:appoint});
                })

}

exports.getAppointByFaculty=(req,res,next)=>{
    
    const phone = req.body.phone;
   
    Appointment.findAppointByFaculty(phone)
                .then(appoint=>{
                    if(appoint.length==0)
                    {
                        return res.json({ message:'Appointment Does not exist',appointment:appoint});
                    }

                    res.json({ message:'Appointment Exists',appointment:appoint});
                })

}

exports.editAppointment=(req,res,next)=>{
    const appointmentId = req.body.appointmentId;
    const meetingId = req.body.meetingId;
    Appointment.findAppointByID(appointmentId)
                .then(appointment=>{
                    if(!appointment)
                    {
                        return res.json({ message:'Appointment does not exist',status:false});
                    }

                    appointment.MeetingId = meetingId;
                    // console.log(user);
                   
                    const db = getDb();
                    db.collection('appointments').updateOne({appointmentID:appointmentId},{$set:appointment})
                                .then(resultData=>{
                                    
                                    res.json({ message:'Data Changed',status:true});
                                })
                                .catch(err=>console.log(err));


                })

}



exports.editStatus=(req,res,next)=>{
    const appointmentId = req.body.appointmentId;
    const status = req.body.status;
    Appointment.findAppointByID(appointmentId)
                .then(appointment=>{
                    if(!appointment)
                    {
                        return res.json({ message:'Appointment does not exist',status:false});
                    }

                    appointment.Status = status;
                    // console.log(user);
                   
                    const db = getDb();
                    db.collection('appointments').updateOne({appointmentID:appointmentId},{$set:appointment})
                                .then(resultData=>{
                                    
                                    res.json({ message:'Data Changed',status:true});
                                })
                                .catch(err=>console.log(err));


                })

}


exports.getAppointByFacDate=(req,res,next)=>{
    
    const fac_phone = req.body.fac_phone;
    
    let appointDate = req.body.appointDate;
    appointDate = new Date(appointDate).getTime();
    console.log(appointDate);
  
   
    Appointment.findAppointByFacultyDate(fac_phone,appointDate)
                .then(appoint=>{
                    if(appoint.length==0)
                    {
                        return res.json({ message:'Appointment not exist',appointment:appoint});
                    }

                    res.json({ message:'Appointment Exists',appointment:appoint});
                })

}


exports.getAppointByParDate=(req,res,next)=>{
    
    const parent_phone = req.body.parent_phone;
    
    let appointDate = req.body.appointDate;
    appointDate = new Date(appointDate).getTime();
    console.log(appointDate);
  
   
    Appointment.findAppointByParentDate(parent_phone,appointDate)
                .then(appoint=>{
                    if(appoint.length==0)
                    {
                        return res.json({ message:'Appointment not exist',appointment:appoint});
                    }

                    res.json({ message:'Appointment Exists',appointment:appoint});
                })

}
