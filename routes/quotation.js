const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const path = require('path')

const multer = require('multer');
const getDb = require('../util/database').getDB; 

var fs = require('fs');

const Quotation = require('../models/quotation');
const Product = require('../models/product');

const quotationController = require('../controllers/quotation');

var myTokenFile = require('../services/verifyTokenFile');
var verifyToken = myTokenFile.verifyToken;

//multer configuration
var store = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./newFileUploads');
    },
    filename:function(req,file,cb){
        var dt = new Date();
        var newOrignalName = dt+file.originalname.replace(/ /g, "");
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

router.get('/del-quotation/:quotationNo',verifyToken,quotationController.delSingleQuotation);

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
    let canvas1;
    let canvas2;

    const quotationNo = +req.body.quotationNo;
    const productCode = req.body.productCode;
    
    let images = req.files.images;
    if(typeof req.files.canvas1 == 'undefined')
    {
        return res.json({status:false, messages:"Enter Photo for 'canvas1' field"});
    }else{
         canvas1 = req.files.canvas1[0];
    }
   

    if(typeof req.files.canvas2 == 'undefined')
    {
        return res.json({status:false, messages:"Enter Photo for 'canvas2' field"});
    }else{
        canvas2 = req.files.canvas2[0];
    }

    let newImages = [];

    canvas1 = "https://prince-art-exporter.herokuapp.com/api/download/"+canvas1.filename;
    canvas2 = "https://prince-art-exporter.herokuapp.com/api/download/"+canvas2.filename;
    
    if(typeof images == 'undefined')
    {
        return res.json({status:false, messages:"Enter Photos for 'images' field"});
    }
    else{
        images.forEach(img=>{
            img = img.filename;
            img = "https://prince-art-exporter.herokuapp.com/api/download/"+img;
            newImages.push(img);
        })
    }

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
                                    return res.sendStatus(404).json({ message:'Quotation Does not exist',status:false});
                                }
                                console.log(newImages);
                            const db = getDb();
                            quotation.items.push({itemNo:itemNo,images:newImages,canvas1:canvas1,canvas2:canvas2,productCode:productCode});
                            db.collection('quotations').updateOne({quotationNo:quotationNo},{$set:quotation})
                                .then(resultData=>{
                                    
                                res.json({ message:'Item Added Successfully',status:true, newItem:{itemNo:itemNo,images:newImages,canvas1:canvas1,canvas2:canvas2,productCode:productCode},quotation:quotation,authData:authData});
                            
                                })
                                .catch(err=>console.log(err));   
                            })
                            .catch(err=>console.log(err));    
                    })
                    .then(resultData=>{
                       
                    })
                    .catch(err=>{
                        res.sendStatus(500).json({status:false,message:"Quotation Creation Failed ",error:err})
                    })                             
        })          
        
        }
    });
            
});

router.post('/edit-quotation-item',verifyToken,upload.fields([{
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
     
   
    let canvas1;
    let canvas2;

    const itemNo = +req.body.itemNo;
    const quotationNo = +req.body.quotationNo;
    let images = req.files.images;
    // if(typeof req.files.canvas1 == 'undefined')
    // {
    //     return res.json({status:false, messages:"Enter Photo for 'canvas1' field"});
    // }else{
    //      canvas1 = req.files.canvas1[0];
    // }
   

    // if(typeof req.files.canvas2 == 'undefined')
    // {
    //     return res.json({status:false, messages:"Enter Photo for 'canvas2' field"});
    // }else{
    //     canvas2 = req.files.canvas2[0];
    // }

    let newImages = [];

    // canvas1 = "https://prince-art-exporter.herokuapp.com/api/download/"+canvas1.filename;
    // canvas2 = "https://prince-art-exporter.herokuapp.com/api/download/"+canvas2.filename;
    
    // if(typeof images == 'undefined')
    // {
    //     return res.json({status:false, messages:"Enter Photos for 'images' field"});
    // }
    // else{
    //     images.forEach(img=>{
    //         img = img.filename;
    //         img = "https://prince-art-exporter.herokuapp.com/api/download/"+img;
    //         newImages.push(img);
    //     })
    // }

    const db = getDb();     
     
        Quotation.findQuotationByQuotNo(quotationNo)
            .then(quotation=>{
                if(!quotation)
                {
                    return res.sendStatus(404).json({ message:'Quotation Does not exist',status:false});
                }

                const index = quotation.items.findIndex(i=>i.itemNo == itemNo);
                console.log(index);
                if(index == -1)
                {
                    return res.sendStatus(404).json({status:false,message:"Item does not Exists"});        
                }
                
                const db = getDb();

                if(typeof req.files.canvas2 != 'undefined')
                {
                    canvas2 = req.files.canvas2[0];                  
                    canvas2 = "https://prince-art-exporter.herokuapp.com/api/download/"+canvas2.filename;
                }
                else{
                    canvas2 = quotation.items[index].canvas2;
                }
                if(typeof req.files.canvas1 != 'undefined')
                {
                    canvas1 = req.files.canvas1[0];
                    canvas1 = "https://prince-art-exporter.herokuapp.com/api/download/"+canvas1.filename;
                }
                else{
                    canvas1 = quotation.items[index].canvas1;
                }

                if(typeof images != 'undefined')
                {
                    images.forEach(img=>{
                        img = img.filename;
                        img = "https://prince-art-exporter.herokuapp.com/api/download/"+img;
                        newImages.push(img);
                    })
                }
                else{
                    newImages = quotation.items[index].images;
                }

                // quotation.items.push({itemNo:itemNo,images:newImages,canvas1:canvas1,canvas2:canvas2});
                quotation.items[index] = {itemNo:itemNo,images:newImages,canvas1:canvas1,canvas2:canvas2};

                db.collection('quotations').updateOne({quotationNo:quotationNo},{$set:quotation})
                    .then(resultData=>{
                        
                    res.json({ message:'Item Updated Successfully',status:true, updatedItem:{itemNo:itemNo,images:newImages,canvas1:canvas1,canvas2:canvas2},quotation:quotation,authData:authData});
                
                    })
                    .catch(err=>console.log(err));   
                })
                .catch(err=>console.log(err));                                      
   
        }
    });
            
});




router.post('/add-product-image',verifyToken,upload.fields([{
    name: 'image', maxCount: 1
  }]),(req,res,next)=>{

    const ProductCode = req.body.ProductCode;
    let image = req.files.image;
    console.log(image);
    const db = getDb();     
     
        Product.findProductByProductCode(ProductCode)
            .then(product=>{
                if(!product)
                {
                    return res.sendStatus(404).json({ message:'Product Does not exist',status:false});
                }
                               
                const db = getDb();

                if(image!=null)
                {
                    image = image[0];
                    product.imageUrl = "https://prince-art-exporter.herokuapp.com/api/download/"+image.filename

                    db.collection('products').updateOne({ProductCode:ProductCode},{$set:product})
                        .then(resultData=>{
                            
                        res.json({ message:'Image Added Successfully',status:true, updatedProduct:product});
                    
                        })
                        .catch(err=>console.log(err));   
                }
         
                })
                .catch(err=>console.log(err));                                      
   
});



module.exports = router;

