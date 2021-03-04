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
                        
                        const quotation = new Quotation(quotNum,buyerName,country,currency,size,price,containerSize,items,userEmail);
                       
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
                res.json({status:false,message:"Enter Logged In User Details"})
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
                        return res.json({status:false,message:"User does not exist"});
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
                res.json({status:false,message:"Enter Logged In User Details"})
            }          
        }
    });
  
}


exports.getSingleQuotationDetail = (req,res,next)=>{
    const quotationNo = +req.body.quotationNo;

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
                    return res.json({status:false,message:"Quotation does not exist"});   
                }
                res.json({status:true,quotation:quotData});
        
            }).catch(err=>{
                res.json({status:false,err:err});
            })               
                   
        }
    });
     
}