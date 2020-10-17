const Course = require('../models/courses');
const getDb = require('../util/database').getDB; 


exports.postCourseData = (req,res,next)=>{
  
    //parsing data from incoming request
    let courseId;
    const name = req.body.name ;
    const description = req.body.description;
    const fees = req.body.fees;
    
    const content = req.body.content;  
    const coursePhoto = req.body.coursePhoto;     


      let newVal;
    const db = getDb();     
    db.collection('courseCounter').find().toArray().then(data=>{
        
        newVal = data[data.length-1].count;
       
        newVal = newVal + 1;
        console.log(newVal);
       
        courseId = newVal;
        
        db.collection('courseCounter').insertOne({count:newVal})
                .then(result=>{

                    const course = new Course(courseId,name,description,fees,content,coursePhoto);
                    //saving in database
                   
                    return course.save()
                    .then(resultData=>{
                        
                        res.json({status:true,message:"Course Enrolled",data:resultData["ops"][0]});
                        
                    })
                    .catch(err=>console.log(err));

                    
                  
                })
                .then(resultData=>{
                   
                })
                .catch(err=>{
                    res.json({status:false,error:err})
                })             
     })   
   
}


exports.getAllCourses=(req,res,next)=>{
    
    Course.fetchAllCourses()
                .then(courses=>{
                   
                    res.json({message:"All Data returned",AllCourses:courses})

                })
                .catch(err=>console.log(err));

}




exports.getSingleCourse=(req,res,next)=>{
  
    const courseId = req.params.courseId;
   
    Course.findCourseByCode(JSON.parse(courseId))
    .then(courseDoc=>{
       
        if(courseDoc){
           
             res.json({status:true, data:courseDoc});
        }
        else{
            res.json({status:false,Message:"No such course exist"});
        }          

    })    
}




exports.enrollTraining=(req,res,next)=>{

    console.log(req.file);

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phone = req.body.phone;
    const email = req.body.email;
    const dob = req.body.dob;
   
    const trainingCode = req.body.trainingCode;

    const db = getDb();

    Training.findEnrollmentByPhone(phone,trainingCode)
    .then(user=>{
        if(user)
        {
            return res.json({ Status:false,Message:'Already Enrolled'});
        }

        db.collection('trainings').findOne({ Code:trainingCode })
        .then(trainingDetail=>{
             
             Training.trainingEnroll(firstName,lastName,phone,email,dob,trainingCode)
             .then(enrollData=>{
                
                 res.status(200).json({Status:true,Data:enrollData["ops"][0]});

             })
             .catch(err=>console.log(err));

        })
        .catch(err=>console.log(err));
    })

}


exports.getAllEnrollment=(req,res,next)=>{
  
    Course.fetchAllEnrollments()
                .then(enrollments=>{                   
                    res.json({message:"All Data returned",Enrollments:enrollments})

                })
                .catch(err=>console.log(err));

}


exports.getSingleEnrollment=(req,res,next)=>{
  
    const phone = req.body.phone;
   
    Course.findEnrollByPhone(phone)
                .then(enrollments=>{
                   
                   
                    res.json({enrollments:enrollments});
                })          

    
}




exports.editCourse=(req,res,next)=>{
    //parsing data from incoming request
    const courseId = req.body.courseId;
    const name = req.body.name ;
    const description = req.body.description;
    const fees = req.body.fees;    
    const content = req.body.content;       
   
 Course.findCourseByCode(courseId)
             .then(courseDoc=>{
                 if(!courseDoc)
                 {
                     return res.json({ message:'Course Does not exist',status:false});
                 }

                
                 courseDoc.CourseName = name;
                 courseDoc.Description = description;
                 courseDoc.Fees = fees;
                 courseDoc.Content = content;
                 
                 const db = getDb();
                 db.collection('courses').updateOne({CourseID:courseId},{$set:courseDoc})
                             .then(resultData=>{
                                 
                                 res.json({message:'Details Updated',status:true});
                             })
                             .catch(err=>console.log(err));


             })

}
