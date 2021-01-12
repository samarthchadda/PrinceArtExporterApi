const Course = require('../models/course');

const getDb = require('../util/database').getDB; 


// //POST
// exports.courseRegister = (req,res,next)=>{
  
//     let courseID;
//     //parsing data from incoming request    
//     const courseName = req.body.courseName;
//     const courseLevel = req.body.courseLevel;
//     const duration = req.body.duration;
//     const startDate = req.body.startDate;  
//     startDate = new Date(startDate).getTime();
//     console.log(startDate);  
//     const tutorIds = req.body.tutorIds;  //array of IDs
//     const score = +req.body.score;
//     const review = req.body.review;
//     const isActive = req.body.isActive;  
//     const regDate = new Date().getTime();

//     // Course.findcourseByPhone(phone)
//     //             .then(userDoc=>{
//     //                 if(userDoc){                        
//     //                     return res.json({status:false, message:'course Already Exists(Enter unique phone)',course:userDoc});
//     //                 }
                   
//                     const db = getDb();     
//                     db.collection('courseCounter').find().toArray().then(data=>{
        
//                         newVal = data[data.length-1].count;
                       
//                         newVal = newVal + 1;
//                         console.log(newVal);
                       
//                         courseID = newVal;
                        
//                         db.collection('courseCounter').insertOne({count:newVal})
//                                 .then(result=>{
                                              
//                             const course = new Course(courseID,courseName,courseLevel,duration,startDate,tutorIds,score,review,isActive);
//                             //saving in database
                        
//                             return course.save()
//                             .then(resultData=>{
                                
//                                 res.json({status:true,message:"Course Registered",course:resultData["ops"][0]});
                                
//                             })
//                             .catch(err=>console.log(err));                                                    
                                  
//                                 })
//                                 .then(resultData=>{
                                   
//                                 })
//                                 .catch(err=>{
//                                     res.json({status:false,error:err})
//                                 })             
//                      })   
                     
                
//                 // })
//                 .then(resultInfo=>{                   
                  
//                 })
//                 .catch(err=>console.log(err));      
// }

exports.postCourseTutor = (req,res,next)=>{

    const courseId = +req.body.courseId;
    const tutorId = +req.body.tutorId;    
   
    Course.findCourseByCourseId(courseId)
                .then(course=>{
                    if(!course)
                    {
                        return res.json({status:false, message:'Course does not exist'});
                    }

                    var tutorIndex = course.tutorIds.findIndex(t=>t==tutorId);
                    if(tutorIndex>=0)
                    {
                        return res.json({status:false, message:'Tutor Already exist'});
                    } 
                    else
                    {
                        course.tutorIds.push(tutorId)
                        const db = getDb();
                        db.collection('courses').updateOne({courseId:courseId},{$set:course})
                                    .then(resultData=>{                                    
                                        
                                      res.json({status:true, message:'Course Updated',course:course});
                                    })
                                    .catch(err=>console.log(err));

                    }

              

                })

}

exports.getAllCourses=(req,res,next)=>{
  
    Course.fetchAllCourses()
                .then(avails=>{                   
                    res.json({message:"All courses returned",courses:avails})

                })
                .catch(err=>console.log(err));
}


exports.getSingleCourse=(req,res,next)=>{
    
    const courseId = +req.params.courseId;
   
    Course.findCourseByCourseId(courseId)
                .then(course=>{
                    if(!course)
                    {
                        return res.json({status:false, message:'Course does not exist'});
                    }

                    res.json({status:true, message:'Course exists',course:course});
                })

}

exports.getTutorCourses=(req,res,next)=>{
    
    const tutorId = +req.params.tutorId;
   
    Course.fetchAllCoursesByTutorId(tutorId)
                .then(courses=>{
                    if(courses.length==0)
                    {
                        return res.json({status:false, message:'Course does not exist',courses:[]});
                    }

                    res.json({status:true, message:'Course exists',courses:courses});
                })

}