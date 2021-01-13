const CourseAppointment = require('../models/courseAppointment');
const getDb = require('../util/database').getDB; 
const Tutor = require('../models/tutor');


exports.postAppointment = (req,res,next)=>{  

    let appointId;
    const tutorId = +req.body.tutorId ;
    const tutorName = req.body.tutorName;
    const duration = +req.body.duration;
    const timeSlot = req.body.timeSlot;
    // console.log("Start Time : ", bookingTime.srtTime,"End Time : ",bookingTime.endTime);
    // console.log(bookingTime.srtTime == bookingTime.endTime)
    let bookingDate = req.body.bookingDate;
    bookingDate = new Date(bookingDate).getTime();
    console.log(bookingDate);
    const bookingDay = req.body.bookingDay;
    const totalCost = +req.body.totalCost;
    const studentId = +req.body.studentId;
    const studentName = req.body.studentName;    
    let startDate = req.body.startDate;
    startDate = new Date(startDate).getTime();
    console.log(startDate);
    const noOfDays = +req.body.noOfDays;
    const courseId = +req.body.courseId;  
    const courseName = req.body.courseName;  
    
    // Appointment.findAppointByTutorIdAndDateTime(tutorId,bookingDate,timeSlot.startTime,timeSlot.endTime)
    // .then(appointDoc=>{
    //     if(appointDoc.length!=0){                        
    //         return res.json({status:false, message:'Appointment Already Exists for this tutor in this timeslot'});
    //     }

        let newVal;
        const db = getDb();     
        db.collection('courseAppCounter').find().toArray().then(data=>{
            
            newVal = data[data.length-1].count;
           
            newVal = newVal + 1;
           
            appointId = newVal;
            
            db.collection('courseAppCounter').insertOne({count:newVal})
                    .then(result=>{
                        
                        const courseAppointment = new CourseAppointment(appointId,tutorId,tutorName,duration,timeSlot,bookingDate,bookingDay,totalCost,studentId,studentName,0,startDate,noOfDays,courseId,courseName);
                       
                        //saving in database                    
                        return courseAppointment.save()
                        .then(resultData=>{
                            
                            return res.json({status:true,message:"Course Appointment Created ",data:resultData["ops"][0]});
                            
                        })
                        .catch(err=>console.log(err));
                    })
                    .then(resultData=>{
                       
                    })
                    .catch(err=>{
                        res.json({status:false,message:"Appointment Creation Failed ",error:err})
                    })                             
        })    
    // })
    .then(resultInfo=>{                   
      
    })
    .catch(err=>console.log(err));       
}


exports.getAllAppointments=(req,res,next)=>{
    
    Appointment.fetchAllAppointments()
                .then(appointments=>{
                   
                    res.json({message:"All Data returned",allAppointments:appointments})

                })
                .catch(err=>console.log(err));
}




exports.getSingleAppointment=(req,res,next)=>{
    
    const id = +req.params.id;
   
    Appointment.findAppointByID(JSON.parse(id))
                .then(appoint=>{
                    if(!appoint)
                    {
                        return res.json({status:false, message:'Appointment does not exist',appointment:null});
                    }

                    Tutor.findTutorById(+appoint.tutorId)
                    .then(tutorData=>{

                        // let newData = {...appoint,tutor:tutorData}
                        res.json({status:true, message:'Appointment exists',appointment:appoint,tutor:tutorData});
                    })
                    .catch(err=>console.log(err))

                   
                })

}

exports.editSessionAppointment=(req,res,next)=>{
    
    const appointmentId = +req.body.appointmentId;
    const status = +req.body.status;
       
    Appointment.findAppointByID(JSON.parse(appointmentId))
                .then(appoint=>{
                    if(!appoint)
                    {
                        return res.json({status:false, message:'Appointment does not exist',appointment:null});
                    }

                    appoint.status = status;
                    const db = getDb();
                    db.collection('appointments').updateOne({appointmentId:appointmentId},{$set:appoint})
                                .then(resultData=>{
                                    
                                    res.json({message:'Details Updated',status:true,appointment:appoint});
                                })
                                .catch(err=>console.log(err));

                    // res.json({status:true, message:'Appointment exists',appointment:appoint});
                })

}

exports.getTutorAppointments=(req,res,next)=>{
    
    const id = +req.params.id;
   
    Appointment.findAppointsByTutorId(JSON.parse(id))
                .then(appoint=>{
                    if(appoint.length==0)
                    {
                        return res.json({status:false, message:'Appointment does not exist',appointments:[]});
                    }

                    res.json({status:true, message:'Appointment exists',appointments:appoint});
                })

}


exports.getStudentAppointments=(req,res,next)=>{
    
    const id = +req.params.id;
   
    Appointment.findAppointsByStudentId(JSON.parse(id))
                .then(appoint=>{
                    if(appoint.length==0)
                    {
                        return res.json({status:false, message:'Appointment does not exist',appointments:[]});
                    }

                    res.json({status:true, message:'Appointment exists',appointments:appoint});
                })

}

