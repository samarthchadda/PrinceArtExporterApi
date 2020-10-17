const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courses');
const Course = require('../models/courses');
const getDb = require('../util/database').getDB; 

const multer = require('multer');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploadCourses/');
    },
    filename: function(req, file, cb) {
        const now = new Date().toISOString(); const date = now.replace(/:/g, '-'); cb(null, date + file.originalname);
    }
});

const fileFilter = (req,file,cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true);
    }else{
     cb(null,false);
    }
   
}

const upload = multer({storage:storage, limits:{fileSize:1024*1024*5},fileFilter:fileFilter});


router.get('/allcourses',courseController.getAllCourses);

router.get('/allcourses/:courseId',courseController.getSingleCourse);


router.post('/post-course',courseController.postCourseData);

router.post('/edit-course',courseController.editCourse);



router.get('/courseenroll',courseController.getAllEnrollment);

router.post('/get-course-enrollment',courseController.getSingleEnrollment)


var ImageKit = require("imagekit");
var fs = require('fs');

const upload2 = multer();

router.post('/enroll-course' , upload2.single('courseEnrollImage'),(req,res,next)=>{

   
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phone = req.body.phone;
    const email = req.body.email;
    const dob = req.body.dob;   
    const courseName = req.body.courseName;
    const courseCode = req.body.courseCode;

    var imagekit = new ImageKit({
        publicKey : "public_WlmDyQDHleOQopDhwUECOh0zPKU=",
        privateKey : "private_0YX4jtTBzNLifx3C2Egcgb1xNZs=",
        urlEndpoint : "https://ik.imagekit.io/4afsv20kjs"
    });

      var base64Img = req.file.buffer;

  
    const db = getDb();


    // course enrollment
    Course.findEnrollmentByPhone(phone,courseCode)
    .then(user=>{
        if(user)
        {
            return res.json({ status:false,message:'Already Enrolled'});
        }

        db.collection('courses').findOne({ CourseID:JSON.parse(courseCode) })
        .then(courseDetail=>{
                                                            
             if(!courseDetail){
                return res.json({status:false, message:"Enter Valid Course CODE"});
             }  

             imagekit.upload({
                file : base64Img, //required
                fileName : "courseEnrollImg.jpg"   //required
               
            }, function(error, result) {
                if(error) {console.log(error);}
                else {
                    console.log(result.url);
        
                    Course.courseEnroll(firstName,lastName,phone,email,dob,courseCode,courseName,result.url)
                    .then(enrollData=>{
                       
                        res.status(200).json({status:true,data:enrollData["ops"][0]});
       
                    })
                    .catch(err=>console.log(err));
       
        
                }
            });
                     
        })
        .catch(err=>console.log(err));

    })

    //course enrollment    

});






const upload1 = require('../services/file-upload');
// const singleUpload = upload1.single('courseImg');

router.post('/upload-course-file',upload1.single('courseImg'),function(req, res) {

    console.log(req.file);
    // singleUpload(req, res, function(err) {
    //        //this callback function is executed after ,the image is uploaded or we get error from server
           
  
    //   if (err) {
    //     return res.status(422).send({errors: [{title: 'File Upload Error', detail: err.message}] });
    //   }
  
    //                          //URL of our uploaded image(on aws)
    //   return res.json({'imageUrl': req.file.location});
    // });

    return res.json({'imageUrl': req.file});
});




module.exports = router;

