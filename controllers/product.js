const Product = require('../models/product');

const getDb = require('../util/database').getDB; 
var crypto = require('crypto'); 

const jwt = require('jsonwebtoken');

//POST
exports.createProduct = (req,res,next)=>{

    const CBM = req.body.CBM;  
    const CostPerKg = req.body.CostPerKg;
    const FoldingHeight = req.body.FoldingHeight;

    const FoldingLength = req.body.FoldingLength;  
    const FoldingWidth = req.body.FoldingWidth;
    const FullHeight = req.body.FullHeight;

    const FullLength = req.body.FullLength;  
    const FullWidth = req.body.FullWidth;
    const IronRemark = req.body.IronRemark;

    const IronWeight = req.body.IronWeight;  
    const LocationName = req.body.LocationName;
    const ProductCategory = req.body.ProductCategory;

    const ProductCode = req.body.ProductCode;  
    const ProductDesc = req.body.ProductDesc;
    const ProductFinish = req.body.ProductFinish;

    const ProductName = req.body.ProductName;  
    const ProuctSampleDate = req.body.ProuctSampleDate;
    const Remark = req.body.Remark;

    const SupplierRef = req.body.SupplierRef;  
    const TotalCost = req.body.TotalCost;
    const TotalWeight = req.body.TotalWeight;
    const WoodRemark = req.body.WoodRemark;
     
    Product.findProductByProductCode(ProductCode)
            .then(userDoc=>{
                if(userDoc){                        
                    return res.json({status:false, message:'Product Already Exists'});
                }
        
                const db = getDb();     
                                                        
                const product = new Product(CBM,CostPerKg,FoldingHeight,FoldingLength,FoldingWidth,FullHeight,FullLength,
                    FullWidth,IronRemark,IronWeight,LocationName,ProductCategory,ProductCode,ProductDesc,
                    ProductFinish,ProductName,ProuctSampleDate,Remark,SupplierRef,TotalCost,TotalWeight,
                    WoodRemark);

                //saving in database
            
                return product.save()
                .then(resultData=>{
                    
                    res.json({status:true,message:"Product Added",product:resultData["ops"][0]});
                    
                })
                .catch(err=>console.log(err));                                                                                                                          
            })
            .then(resultInfo=>{                   
                
            })
            .catch(err=>console.log(err));      
}


exports.getAllProducts = (req,res,next)=>{

    jwt.verify(req.token,'secretkey',(err,authData)=>{
        if(err)
        {
            res.sendStatus(403);
        }
        else{         
                
            Product.fetchAllProducts()
            .then(quotData=>{
              
                res.json({status:true,products:quotData});
        
            }).catch(err=>{
                res.json({status:false,err:err});
            })                   
                   
        }
    });
   
}

exports.getSingleProducts = (req,res,next)=>{

    const prodCode = req.params.prodCode;

    jwt.verify(req.token,'secretkey',(err,authData)=>{
        if(err)
        {
            res.sendStatus(403);
        }
        else{         
                
            Product.findProductByProductCode(prodCode)
            .then(quotData=>{
                if(!quotData)
                {
                    return res.sendStatus(404).json({status:false,message:"Product Does not exists"});
                }
            
                res.json({status:true,product:quotData});

            }).catch(err=>{
                res.json({status:false,err:err});
            })               
                        
                }
            });

  

}