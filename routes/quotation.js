const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const path = require('path')

const multer = require('multer');
const getDb = require('../util/database').getDB; 

var fs = require('fs');

const Quotation = require('../models/quotation');
const quotationController = require('../controllers/quotation');

var myTokenFile = require('../services/verifyTokenFile');
var verifyToken = myTokenFile.verifyToken;

//multer configuration
var store = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./newFileUploads');
    },
    filename:function(req,file,cb){
        var newOrignalName = file.originalname.replace(/ /g, "");
        cb(null,newOrignalName)
    }
})

const upload = multer({ storage: store });

router.get('/download/:filename', function(req,res,next){
    // console.log(req.body.filename)
    filepath = path.join(__dirname,'../newFileUploads') +'/'+ req.params.filename;
    // res.json({path:filepath});
    // res.sendFile(filepath)
    res.download(filepath, req.params.filename);    
});

router.post('/create-quotation',verifyToken,quotationController.createQuotation);

router.post('/user-quotations',verifyToken,quotationController.getUserQuotations);

router.get('/quotation-details/:quotationNo',verifyToken,quotationController.getSingleQuotationDetail);

router.post('/edit-quotation',verifyToken,quotationController.editSingleQuotation);

router.get('/del-quotation-item/:itemNo/:quotationNo',verifyToken,quotationController.delSingleQuotationItem);

router.get('/get-quotation-items/:quotationNo',verifyToken,quotationController.getQuotationItems);

router.post('/create-item',verifyToken,upload.fields([{
    name: 'images', maxCount: 10
  }, {
    name: 'canvas1', maxCount: 1
  },
  {
    name: 'canvas2', maxCount: 1
  }]),(req,res,next)=>{
    jwt.verify(req.token,'secretkey',(err,authData)=>{
        if(err)
        {
            res.sendStatus(403);
        }
        else{         
                
        
    let itemNo;
    
    const quotationNo = +req.body.quotationNo;
    let images = req.files.images;
    let canvas1 = req.files.canvas1[0];
    let canvas2 = req.files.canvas2[0];

    let newImages = [];

    canvas1 = "https://prince-art-exporter.herokuapp.com/api/download/"+canvas1.filename;
    canvas2 = "https://prince-art-exporter.herokuapp.com/api/download/"+canvas2.filename;
    
    images.forEach(img=>{
        img = img.filename;
        img = "https://prince-art-exporter.herokuapp.com/api/download/"+img;
        newImages.push(img);
    })

    const db = getDb();     
        db.collection('itemCounter').find().toArray().then(data=>{
            
            newVal = data[data.length-1].count;
           
            newVal = newVal + 1;
           
            itemNo = newVal;
            
            db.collection('itemCounter').insertOne({count:newVal})
                    .then(result=>{
                        
                        Quotation.findQuotationByQuotNo(quotationNo)
                            .then(quotation=>{
                                if(!quotation)
                                {
                                    return res.json({ message:'Quotation Does not exist',status:false});
                                }
                                console.log(newImages);
                            const db = getDb();
                            quotation.items.push({itemNo:itemNo,images:newImages,canvas1:canvas1,canvas2:canvas2});
                            db.collection('quotations').updateOne({quotationNo:quotationNo},{$set:quotation})
                                .then(resultData=>{
                                    
                                res.json({ message:'Item Added Successfully',status:true, newItem:{itemNo:itemNo,images:newImages,canvas1:canvas1,canvas2:canvas2},quotation:quotation,authData:authData});
                            
                                })
                                .catch(err=>console.log(err));   
                            })
                            .catch(err=>console.log(err));    
                    })
                    .then(resultData=>{
                       
                    })
                    .catch(err=>{
                        res.json({status:false,message:"Quotation Creation Failed ",error:err})
                    })                             
        })          
        
        }
    });
            
});


module.exports = router;

