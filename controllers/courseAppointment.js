const CourseAppointment = require('../models/courseAppointment');
const getDb = require('../util/database').getDB; 
const Tutor = require('../models/tutor');
const Course = require('../models/course');
const Student = require('../models/student');
const Appointment = require('../models/appointment');


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
    
    CourseAppointment.fetchAllAppointments()
                .then(appointments=>{
                   
                    res.json({message:"All Data returned",allAppointments:appointments})

                })
                .catch(err=>console.log(err));
}




exports.getSingleAppointment=(req,res,next)=>{
    
    const id = +req.params.id;
   
    CourseAppointment.findAppointByID(JSON.parse(id))
                .then(appoint=>{
                    if(!appoint)
                    {
                        return res.json({status:false, message:'Appointment does not exist',appointment:null});
                    }

                    Tutor.findTutorById(+appoint.tutorId)
                    .then(tutorData=>{

                        Course.findCourseByCourseId(+appoint.courseId)
                        .then(courseData=>{

                            Student.findStudentByStudentId(+appoint.studentId)
                            .then(studentData=>{
                                  // let newData = {...appoint,tutor:tutorData}
                          res.json({status:true, message:'Appointment exists',appointment:appoint,tutor:tutorData,course:courseData,student:studentData});

                            })
                           
                        })

                       
                    })
                    .catch(err=>console.log(err))

                   
                })

}

exports.editSessionAppointment=(req,res,next)=>{
    
    const appointmentId = +req.body.appointmentId;
    const status = +req.body.status;
       
    CourseAppointment.findAppointByID(JSON.parse(appointmentId))
                .then(appoint=>{
                    if(!appoint)
                    {
                        return res.json({status:false, message:'Appointment does not exist',appointment:null});
                    }

                    appoint.status = status;
                    const db = getDb();
                    db.collection('courseAppointments').updateOne({appointmentId:appointmentId},{$set:appoint})
                                .then(resultData=>{
                                    
                                    res.json({message:'Details Updated',status:true,appointment:appoint});
                                })
                                .catch(err=>console.log(err));

                    // res.json({status:true, message:'Appointment exists',appointment:appoint});
                })

}

exports.getTutorAppointments=(req,res,next)=>{
    
    const id = +req.params.id;
   
    CourseAppointment.findAppointsByTutorId(JSON.parse(id))
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
   
    CourseAppointment.findAppointsByStudentId(JSON.parse(id))
                .then(appoint=>{
                    if(appoint.length==0)
                    {
                        return res.json({status:false, message:'Appointment does not exist',appointments:[]});
                    }

                    res.json({status:true, message:'Appointment exists',appointments:appoint});
                })

}



exports.getAppointsGraph= async (req,res,next)=>{
    const tutorId = +req.params.tutorId;
    var monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

    var today = new Date();
    var d;
    var months = [];
    var d = new Date();
    var month;
    var year = d.getFullYear();
  
        var keyData = 1;
      
    for(var i = 5; i > -1; i -= 1) {
      d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    //   console.log(d.getFullYear())
   
      months.push({month:monthNames[d.getMonth()],year:d.getFullYear(),key:+keyData});
      keyData = keyData+1;
    //   console.log(keyData)
         month = monthNames[d.getMonth()];
        //  console.log(months)

    }
    // console.log(months)
    let dates = [];
    months.forEach(m=>{
        
        if(m.month=="january")
        {
            mo = 0;
        }
        if(m.month=="february")
        {
            mo = 1;
        }
        if(m.month=="march")
        {
            mo = 2;
        }
        if(m.month=="april")
        {
            mo = 3;
        }
        if(m.month=="may")
        {
            mo = 4;
        }
        if(m.month=="june")
        {
            mo = 5;
        }
        if(m.month=="july")
        {
            mo = 6;
        }
        if(m.month=="august")
        {
            mo = 7;
        }
        if(m.month=="september")
        {
            mo = 8;
        }
        if(m.month=="october")
        {
            mo = 9;
        }
        if(m.month=="november")
        {
            mo = 10;
        }
        if(m.month=="december")
        {
            mo = 11;
        }
        
        
        const firstDay = new Date(m.year, mo, 1);
        // alert(firstDay.getDate());
        const lastDay = new Date(m.year, mo + 1, 0);
        // alert(lastDay.getDate());
        // console.log(firstDay,lastDay)
        mo = mo+1;
        mo = mo<10?"0"+mo:mo; 
        // console.log(year)  
        dates.push({
                        srtDate: firstDay.getDate()<10?m.year.toString()+"-"+mo.toString()+"-0"+firstDay.getDate().toString():m.year.toString()+"-"+mo.toString()+"-"+firstDay.getDate().toString(),
                        endDate: lastDay.getDate()<10?m.year.toString()+"-"+mo.toString()+"-0"+lastDay.getDate().toString():m.year.toString()+"-"+mo.toString()+"-"+lastDay.getDate().toString(),
                        month:mo,
                        key:m.key
                    });
  
    })
    // console.log(dates)
    var allData = [];
    var allCost  = 0;
    var totalAppointments = 0;
    dates.forEach(d=>{
        // console.log(d)
        let startDate = d.srtDate;
        startDate = new Date(startDate).getTime();
        // console.log(startDate);
    
        let endDate = d.endDate;
        endDate = new Date(endDate).getTime();
        // console.log(startDate,endDate)
        CourseAppointment.findAppointsByDates(tutorId,startDate,endDate)
        .then(cAppData=>{

            Appointment.findAppointsByDates(tutorId,startDate,endDate)
            .then(appData=>{
                  // console.log(saloons.length)
                allData.push({month:d.month.toString(),appointments:(cAppData.length+appData.length),key:d.key,startDate:d.srtDate,endDate:d.endDate})
                // allCost = allCost + cAppData.totalCost;
                cAppData.forEach(c=>{
                    allCost = allCost+c.totalCost;
                })
                appData.forEach(c=>{
                    allCost = allCost+c.totalCost;
                })
              
                // console.log(allData)
                if(dates.length == allData.length)
                {   
                    allData.sort((a, b) => {
                        return a.key - b.key;
                    });
                    allData.forEach(a=>{
                        totalAppointments = totalAppointments + a.appointments;
                    })
                    res.json({message:"All Data returned",allAppoints:allData,totalAppointments:totalAppointments,totalAmount:allCost,averageMonthlyApp:(totalAppointments/30),averageMonthlyIncome:(totalAppointments/30)})
                    // totalAppointments = 0;
                    // totalAmount = 0;
                }
            })
          

        })
        .catch(err=>console.log(err));
    })
   
}
