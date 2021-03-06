const Quotation = require('../models/quotation');
const User = require('../models/user');

const getDb = require('../util/database').getDB; 

const jwt = require('jsonwebtoken');


exports.createQuotation = (req,res,next)=>{  

    let quotNum;
    const buyerName = req.body.buyerName;
    const country = req.body.country;
    const currency = req.body.currency;
    const size = req.body.size;
    const price = req.body.price;
    const containerSize = req.body.containerSize;    
    const userEmail = req.body.userEmail;  
    const items = [];  
    const visitCode = req.body.visitCode;

    jwt.verify(req.token,'secretkey',(err,authData)=>{
        if(err)
        {
            res.sendStatus(403);
        }
        else{
            if(authData.user.email == userEmail)
            {
                let newVal;
        const db = getDb();     
        db.collection('quotCounter').find().toArray().then(data=>{
            
            newVal = data[data.length-1].count;
           
            newVal = newVal + 1;
           
            quotNum = newVal;
            
            db.collection('quotCounter').insertOne({count:newVal})
                    .then(result=>{
                        
                        const quotation = new Quotation(quotNum,buyerName,country,currency,size,price,containerSize,items,userEmail,visitCode);
                       
                        //saving in database                    
                        return quotation.save()
                        .then(resultData=>{
                            
                            return res.json({status:true,message:"Quotation Created ",quotation:resultData["ops"][0],authData:authData});
                            
                        })
                        .catch(err=>console.log(err));
                    })
                    .then(resultData=>{
                       
                    })
                    .catch(err=>{
                        res.json({status:false,message:"Quotation Creation Failed ",error:err})
                    })                             
        })
    .then(resultInfo=>{                   
      
    })
    .catch(err=>console.log(err));       

            }
            else{
                res.sendStatus(401).json({status:false,message:"Enter Logged In User Details"})
            }          
        }
    });

}


exports.getUserQuotations = (req,res,next)=>{
    const email = req.body.email;

    jwt.verify(req.token,'secretkey',(err,authData)=>{
        if(err)
        {
            res.sendStatus(403);
        }
        else{
            if(authData.user.email == email)
            {
                User.findUserByEmail(email)
                .then(user=>{
                    if(!user)
                    {
                        return res.sendStatus(404).json({status:false,message:"User does not exist"});
                    }
                    Quotation.findQuotationsByEmail(email)
                    .then(quotData=>{
                        
                        res.json({status:true,quotations:quotData});
                
                    }).catch(err=>{
                        res.json({status:false,err:err});
                    })
                })
                .catch(err=>{
                    res.json({status:false,err:err});
                })
               
            }
            else{
                res.sendStatus(401).json({status:false,message:"Enter Logged In User Details"})
            }          
        }
    });
  
}


exports.getSingleQuotationDetail = (req,res,next)=>{
    const quotationNo = +req.params.quotationNo;

    jwt.verify(req.token,'secretkey',(err,authData)=>{
        if(err)
        {
            res.sendStatus(403);
        }
        else{         
                
            Quotation.findQuotationByQuotNo(quotationNo)
            .then(quotData=>{
                if(!quotData)
                {
                    return res.sendStatus(404).json({status:false,message:"Quotation does not exist"});   
                }
                res.json({status:true,quotation:quotData,authData:authData});
        
            }).catch(err=>{
                res.json({status:false,err:err});
            })               
                   
        }
    });
     
}


exports.editSingleQuotation = (req,res,next)=>{

    const quotationNo = +req.body.quotationNo;
    const buyerName = req.body.buyerName;
    const country = req.body.country;
    const currency = req.body.currency;
    const size = req.body.size;
    const price = req.body.price;
    const containerSize = req.body.containerSize;   

    jwt.verify(req.token,'secretkey',(err,authData)=>{
        if(err)
        {
            res.sendStatus(403);
        }
        else{         
                
            Quotation.findQuotationByQuotNo(quotationNo)
            .then(quotData=>{
                if(!quotData)
                {
                    return res.sendStatus(404).json({status:false,message:"Quotation does not exist"});   
                }
                quotData.buyerName = buyerName;
                quotData.country = country;
                quotData.currency = currency;
                quotData.size = size;
                quotData.price = price;                
                quotData.containerSize = containerSize;
                 
                     const db = getDb();
                     db.collection('quotations').updateOne({quotationNo:quotationNo},{$set:quotData})
                                 .then(resultData=>{
                                     
                                     res.json({message:'Details Updated',status:true,quotation:quotData,authData:authData});
                                 })
                                 .catch(err=>console.log(err));
        
            }).catch(err=>{
                res.json({status:false,err:err});
            })               
                   
        }
    });
     
}



exports.getQuotationItems = (req,res,next)=>{
    const quotationNo = +req.params.quotationNo;

    jwt.verify(req.token,'secretkey',(err,authData)=>{
        if(err)
        {
            res.sendStatus(403);
        }
        else{         
                
            Quotation.findQuotationByQuotNo(quotationNo)
            .then(quotData=>{
                if(!quotData)
                {
                    return res.sendStatus(404).json({status:false,message:"Quotation does not exist"});   
                }
                res.json({status:true,items:quotData.items,authData:authData});
        
            }).catch(err=>{
                res.json({status:false,err:err});
            })               
                   
        }
    });
     
}

exports.delSingleQuotationItem = (req,res,next)=>{
    const itemNo = req.params.itemNo;
    const quotationNo = +req.params.quotationNo;
    jwt.verify(req.token,'secretkey',(err,authData)=>{
        if(err)
        {
            res.sendStatus(403);
        }
        else{         
                
            Quotation.findQuotationByQuotNo(quotationNo)
            .then(quotations=>{
                if(!quotations)
                {
                    return res.sendStatus(404).json({status:false,message:"Quotation does not exists"});            
                }
                const index = quotations.items.findIndex(i=>i.itemNo == itemNo);
                console.log(index);
                if(index == -1)
                {
                    return res.sendStatus(404).json({status:false,message:"Item does not Exists"});        
                }
        
                quotations.items.splice(index,1);
                const db = getDb();
                db.collection('quotations').updateOne({quotationNo:quotationNo},{$set:quotations})
                    .then(resultData=>{
                        
                        res.json({message:'Item Deleted Successfully',status:true,updatedQuot:quotations,authData:authData});
                    })
                    .catch(err=>console.log(err));
        
            })  
        }
    });

}


exports.delSingleQuotation = (req,res,next)=>{

    const quotationNo = +req.params.quotationNo;

    jwt.verify(req.token,'secretkey',(err,authData)=>{
        if(err)
        {
            res.sendStatus(403);
        }
        else{         
                
            Quotation.findQuotationByQuotNo(quotationNo)
            .then(quotations=>{
                if(!quotations)
                {
                    return res.sendStatus(404).json({status:false,message:"Quotation does not exists"});            
                }
               
                const db = getDb();
                db.collection('quotations').deleteOne({quotationNo:quotationNo})
                    .then(resultData=>{
                        
                        res.json({message:'Quotation Deleted Successfully',status:true,authData:authData});
                    })
                    .catch(err=>console.log(err));
        
            })  
        }
    });

}