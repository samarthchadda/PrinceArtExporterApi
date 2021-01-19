const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course');
const Course = require('../models/course');

const multer = require('multer');
const getDb = require('../util/database').getDB; 
const upload = multer();

var ImageKit = require("imagekit");
var fs = require('fs');

var upload1 = require('../services/file-upload');
const singleupload = upload1.single('courseImg');

router.get('/all-courses',courseController.getAllCourses);

router.get('/all-courses/:courseId',courseController.getSingleCourse);

router.get('/tutor-courses/:tutorId',courseController.getTutorCourses);

router.post('/add-course-tutor',courseController.postCourseTutor);

router.post('/edit-course-status',courseController.editCourseStatus);

//POST
router.post('/course-register', (req,res,next)=>{

       
    singleupload(req,res,function(err){
        if(err)
        {
            return res.json({ message:err,status:false});
        }
        else
        {
            
    let courseID;
    //parsing data from incoming request    
    const courseName = req.body.courseName;
    const courseDesc = req.body.courseDesc;    
    // const tutorIds = req.body.tutorIds;  //array of IDs
  
    const regDate = new Date().getTime();

    // Course.findcourseByPhone(phone)
    //             .then(userDoc=>{
    //                 if(userDoc){                        
    //                     return res.json({status:false, message:'course Already Exists(Enter unique phone)',course:userDoc});
    //                 }
                   
                    const db = getDb();     
                    db.collection('courseCounter').find().toArray().then(data=>{
        
                        newVal = data[data.length-1].count;
                       
                        newVal = newVal + 1;
                        console.log(newVal);
                       
                        courseID = newVal;
                        
                        db.collection('courseCounter').insertOne({count:newVal})
                                .then(result=>{
                                              
                            const course = new Course(courseID,courseName,req.file.location,courseDesc,null,regDate);
                            //saving in database
                        
                            return course.save()
                            .then(resultData=>{
                                
                                res.json({status:true,message:"Course Registered",course:resultData["ops"][0]});
                                
                            })
                            .catch(err=>console.log(err));                                                    
                                  
                                })
                                .then(resultData=>{
                                   
                                })
                                .catch(err=>{
                                    res.json({status:false,error:err})
                                })             
                     })   
                     
                
                // })
                .then(resultInfo=>{                   
                  
                })
                .catch(err=>console.log(err));   

        }
    })
     

 });



module.exports = router;

