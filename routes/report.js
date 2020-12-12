const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report');

const multer = require('multer');
const getDb = require('../util/database').getDB; 
const upload = multer();

var ImageKit = require("imagekit");
var fs = require('fs');

router.post('/post-report',reportController.postReportData);


router.post('/post-report-photo',upload.single('reportPhoto'),(req,res,next)=>{
    
   
    var imagekit = new ImageKit({
        publicKey : "public_WlmDyQDHleOQopDhwUECOh0zPKU=",
        privateKey : "private_0YX4jtTBzNLifx3C2Egcgb1xNZs=",
        urlEndpoint : "https://ik.imagekit.io/4afsv20kjs"
    });
    
    var base64Img = req.file.buffer; 

        imagekit.upload({
            file : base64Img, //required
            fileName : "reportImg.jpg"   //required
            
        }, function(error, result) {
            if(error) {console.log(error);}
            else {
                console.log(result.url);
                
                res.json({message:'Image uploaded',status:true,imgUrl:result.url});          
  
                }
            });      

           
           
})



module.exports = router;
