const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/faculty');
const Faculty = require('../models/faculty');

const multer = require('multer');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploadFaculty/');
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



router.get('/all-faculties',facultyController.getFaculties);

router.get('/all-faculties/:id',facultyController.getSingleFaculty);


router.post('/faculty-login',facultyController.facultyLogin);


router.post('/faculty-forgotPwd',facultyController.facultyForgotPwd);

router.post('/add-faculty-token',facultyController.addFacToken);

router.post('/add-appFaculty-token',facultyController.addAppFacToken);

router.post('/admin-edit-faculty',facultyController.adminEditFaculty);

router.post('/appoint-faculties',facultyController.postAppointFaculty);

router.get('/all-appoint-faculties',facultyController.getAppointFaculties);

router.get('/all-appoint-faculties/:id',facultyController.getSingleAppointFaculty);


router.post('/appoint-faculties-login',facultyController.loginAppointFaculty);

router.post('/admin-edit-appointFaculty',facultyController.adminEditAppointFaculty);

router.post('/edit-appointFaculty-timeSlot',facultyController.editAppointFacultyTS);




router.post('/faculty-signup', (req,res,next)=>{
  
    //parsing data from incoming request
    const name = req.body.name;
    const phone = req.body.phone;    
    const password = req.body.password;
    const category = req.body.category;
    const fee = req.body.fee;  

    // console.log(req.file.path);

    Faculty.findUserByPhone(phone)
                .then(userDoc=>{
                    if(userDoc){
                        
                        return res.json({Status:false, message:'User Already Exists'});
                    }
                   
                    const faculty = new Faculty(name,phone,password,category,null,fee,null);
                    //saving in database
                   
                    return faculty.save()
                    .then(resultData=>{                        
                        res.json({Status:true,message:"User Registered",faculty:resultData["ops"][0]});                        
                    })
                    .catch(err=>console.log(err));
                })
                .then(resultInfo=>{                   
                  
                })
                .catch(err=>console.log(err));      

});



const getDb = require('../util/database').getDB; 
const upload1 = multer();

var ImageKit = require("imagekit");
var fs = require('fs');



router.post('/update-liveFac-image',upload1.single('facultyImage'),(req,res,next)=>{

    const phone = +req.body.phone;
    
    var imagekit = new ImageKit({
        publicKey : "public_WlmDyQDHleOQopDhwUECOh0zPKU=",
        privateKey : "private_0YX4jtTBzNLifx3C2Egcgb1xNZs=",
        urlEndpoint : "https://ik.imagekit.io/4afsv20kjs"
    });
    
    var base64Img = req.file.buffer;

    Faculty.findUserByPhone(phone)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'User Does not exist',status:false});
                    }

                    imagekit.upload({
                        file : base64Img, //required
                        fileName : "facultyImg.jpg"   //required
                       
                    }, function(error, result) {
                        if(error) {console.log(error);}
                        else {
                            console.log(result.url);

                            user.FacultyImg = result.url;

                            const db = getDb();
                            db.collection('faculties').updateOne({Phone:phone},{$set:user})
                                .then(resultData=>{
                                    
                                    res.json({ message:'Image Added',status:true, faculty:user});
                                })
                                .catch(err=>console.log(err));
                        }
                    });  
                           
                })
});






router.post('/update-appFac-image',upload1.single('appFacultyImage'),(req,res,next)=>{

    const phone = +req.body.phone;
    
    var imagekit = new ImageKit({
        publicKey : "public_WlmDyQDHleOQopDhwUECOh0zPKU=",
        privateKey : "private_0YX4jtTBzNLifx3C2Egcgb1xNZs=",
        urlEndpoint : "https://ik.imagekit.io/4afsv20kjs"
    });
    
    var base64Img = req.file.buffer;

    Faculty.findAppointFacultyByPhone(phone)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'User Does not exist',status:false});
                    }

                    imagekit.upload({
                        file : base64Img, //required
                        fileName : "appFacultyImg.jpg"   //required
                       
                    }, function(error, result) {
                        if(error) {console.log(error);}
                        else {
                            console.log(result.url);

                            user.FacultyImg = result.url;

                            const db = getDb();
                            db.collection('appointmentFaculties').updateOne({Phone:phone},{$set:user})
                                .then(resultData=>{
                                    
                                    res.json({ message:'Image Added',status:true, faculty:user});
                                })
                                .catch(err=>console.log(err));
                        }
                    });  
                           
                })
});









module.exports = router;

