const express = require('express');
const router = express.Router();
const tutorController = require('../controllers/tutor');
const Tutor = require('../models/tutor');
const getDb = require('../util/database').getDB; 
const multer = require('multer');
const upload = multer();

var ImageKit = require("imagekit");
var fs = require('fs');

var upload1 = require('../services/file-upload');
const singleupload = upload1.single('resume');

router.post('/tutor-login',tutorController.tutorLogin);

router.post('/tutor-signup',tutorController.tutorRegister);

router.get('/all-owners',tutorController.getOwners);

router.post('/check-owner',tutorController.ownerCheckPhone);

router.post('/check-owner-email',tutorController.ownerCheckEmail);

router.get('/get-owner/:ownerId',tutorController.ownerById);

router.post('/reset-owner-pwd',tutorController.ownerResetPwd);

router.post('/send-token',tutorController.sendToken);

// router.post('/edit-admin-owner',tutorController.editAdminOwner);

router.post('/add-tutor-desc',tutorController.editTutorDesc);

router.get('/del-owner/:ownerId',tutorController.delOwner);

router.post('/owner-verify',tutorController.ownerVerify);



router.post('/add-tutor-about',(req,res,next)=>{
    
   
    
    singleupload(req,res,function(err){
        if(err)
        {
            return res.json({ message:err,status:false});
        }
        else
        {
            const tutorId = +req.body.tutorId;
            console.log(tutorId)
            const firstName = req.body.firstName;
            console.log(firstName)
            const lastName = req.body.lastName;
            const email = req.body.email;
            const country = req.body.country;
            const languages = req.body.languages;
            const subject = req.body.subject;
            const hourlyRate = +req.body.hourlyRate;    
            // return res.json({ imgUrl:req.file.location,status:true});

            Tutor.findTutorById(+tutorId)
             .then(ownerDoc=>{
                 if(!ownerDoc)
                 {
                     return res.json({ message:'Tutor does not exist',status:false});
                 }                
                          
                ownerDoc.firstName = firstName;                
                ownerDoc.lastName = lastName;            
                ownerDoc.country = country;
                ownerDoc.email = email;                
                ownerDoc.languages = languages;            
                ownerDoc.subject = subject;
                ownerDoc.hourlyRate = hourlyRate;            
                ownerDoc.resume = req.file.location;

                 const db = getDb();
                 db.collection('tutors').updateOne({tutorId:tutorId},{$set:ownerDoc})
                             .then(resultData=>{
                                 
                                 res.json({message:'All Details Updated',status:true,tutor:ownerDoc});
                             })
                             .catch(err=>console.log(err));
             })
        }

    })
});





router.post('/edit-owner-photo',upload.single('ownerPhoto'),(req,res,next)=>{
    
    const ownerId = +req.body.ownerId;

    var imagekit = new ImageKit({
        publicKey : "public_WlmDyQDHleOQopDhwUECOh0zPKU=",
        privateKey : "private_0YX4jtTBzNLifx3C2Egcgb1xNZs=",
        urlEndpoint : "https://ik.imagekit.io/4afsv20kjs"
    });
    
    var base64Img = req.file.buffer;
 

    const db = getDb();
    Owner.findOwnerById(+ownerId)
    .then(empDoc=>{
        
        if(!empDoc)
        {
             res.json({ message:'Owner does not exist',status:false});
        }
        else{

        imagekit.upload({
            file : base64Img, //required
            fileName : "ownerImg.jpg"   //required
            
        }, function(error, result) {
            if(error) {console.log(error);}
            else {
                console.log(result.url);                    
            
          empDoc.ownerImg = result.url;             
           
           const db = getDb();
           db.collection('owners').updateOne({ownerId:ownerId},{$set:empDoc})
                       .then(resultData=>{
                           
                           res.json({message:'Details Updated',status:true,imageUrl:result.url});
                       })
                      .catch(err=>console.log(err));
  
                }
            });      

           }
        })      
})



module.exports = router;

