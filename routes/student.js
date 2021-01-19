const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student');

const Student = require('../models/student');

const multer = require('multer');
const getDb = require('../util/database').getDB; 
const upload = multer();

var fs = require('fs');
var upload1 = require('../services/file-upload');
const singleupload = upload1.single('studentImg');


router.post('/student-login',studentController.studentLogin);

router.post('/student-register',studentController.studentRegister)

router.get('/all-students',studentController.getStudents);

router.get('/all-clients-month',studentController.getClientsByMonth);

router.get('/all-students/:id',studentController.getSingleStudent);

router.post('/edit-student-details',studentController.editStudentDetails);

router.get('/del-client/:clientId',studentController.delClient);

router.post('/edit-client-email',studentController.editClientEmail);

router.post('/edit-client-name',studentController.editClientName);

router.post('/edit-client-phone',studentController.editClientPhone);

router.post('/edit-client-token',studentController.editClientToken);

router.post('/forgot-password-student',studentController.studentResetPwd);

router.post('/check-client-email',studentController.clientCheckEmail);

router.post('/check-client-phone',studentController.clientCheckPhone);

router.post('/client-fav-saloon',studentController.clientFavSaloon);

router.get('/all-fav-saloons/:clientId',studentController.getFavSaloons);



router.post('/add-student-image',(req,res,next)=>{
    
       
    singleupload(req,res,function(err){
        if(err)
        {
            return res.json({ message:err,status:false});
        }
        else
        {
            const studentId = +req.body.studentId;
            // console.log(tutorId)

            Student.findStudentByStudentId(+studentId)
             .then(ownerDoc=>{
                 if(!ownerDoc)
                 {
                     return res.json({ message:'Student does not exist',status:false});
                 }                
                      
                ownerDoc.studentImg = req.file.location;

                 const db = getDb();
                 db.collection('students').updateOne({studentId:studentId},{$set:ownerDoc})
                             .then(resultData=>{
                                 
                                 res.json({message:'Student Image Updated',status:true,student:ownerDoc});
                             })
                             .catch(err=>console.log(err));
             })
        }

    }) 

})





module.exports = router;

