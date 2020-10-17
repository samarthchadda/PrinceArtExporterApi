const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/owner');
const Owner = require('../models/owner');
const getDb = require('../util/database').getDB; 
const multer = require('multer');
const upload = multer();

var ImageKit = require("imagekit");
var fs = require('fs');


router.post('/owner-login',ownerController.ownerLogin);


router.post('/owner-register',ownerController.ownerRegister);

router.post('/parent-forgotPwd',ownerController.parentForgotPwd);


router.post('/parent-edit-token',ownerController.editDeviceToken);

router.post('/update-parent-image',upload.single('parentImage'),(req,res,next)=>{

    const phone = req.body.phone;
    
    var imagekit = new ImageKit({
        publicKey : "public_WlmDyQDHleOQopDhwUECOh0zPKU=",
        privateKey : "private_0YX4jtTBzNLifx3C2Egcgb1xNZs=",
        urlEndpoint : "https://ik.imagekit.io/4afsv20kjs"
    });
    
    var base64Img = req.file.buffer;

    Parent.findUserByPhone(phone)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'User Does not exist',status:false});
                    }

                    imagekit.upload({
                        file : base64Img, //required
                        fileName : "parentImg.jpg"   //required
                       
                    }, function(error, result) {
                        if(error) {console.log(error);}
                        else {
                            console.log(result.url);

                            user.parentImg = result.url;

                            const db = getDb();
                            db.collection('parents').updateOne({phone:phone},{$set:user})
                                .then(resultData=>{
                                    
                                    res.json({ message:'Image Added',status:true, parent:user});
                                })
                                .catch(err=>console.log(err));

                        }
                    });              
               
                })

});




module.exports = router;

