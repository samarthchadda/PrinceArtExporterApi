const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client');

const Client = require('../models/client');

const multer = require('multer');
const getDb = require('../util/database').getDB; 
const upload = multer();

var ImageKit = require("imagekit");
var fs = require('fs');


router.post('/client-login',clientController.clientLogin);

router.post('/edit-client-email',clientController.editClientEmail);

router.post('/edit-client-name',clientController.editClientName);

router.post('/edit-client-phone',clientController.editClientPhone);

router.post('/edit-client-password',clientController.clientResetPwd);

router.post('/check-client-email',clientController.clientCheckEmail);

router.post('/check-client-phone',clientController.clientCheckPhone);


router.post('/client-register',upload.single('clientImg'),(req,res,next)=>{

    let clientID;
    const clientName = req.body.clientName;
    const phone = +req.body.phone;
    const email = req.body.email;    
    const password = req.body.password;

    var imagekit = new ImageKit({
        publicKey : "public_WlmDyQDHleOQopDhwUECOh0zPKU=",
        privateKey : "private_0YX4jtTBzNLifx3C2Egcgb1xNZs=",
        urlEndpoint : "https://ik.imagekit.io/4afsv20kjs"
    });
    
    var base64Img = req.file.buffer;

    // adding auto-generated id
    let newVal;
    const db = getDb();     
    db.collection('clientCounter').find().toArray().then(data=>{
        
        newVal = data[data.length-1].count;
       
        newVal = newVal + 1;
        console.log(newVal);
       
        clientID = newVal;
        
        db.collection('clientCounter').insertOne({count:newVal})
                .then(result=>{

               Client.findClientByEmail(email)
                .then(client=>{
                    if(client){                        
                        return res.json({status:false, message:'Client already exists(Enter unique email)'});
                    }

                    Client.findClientByPhone(phone)
                    .then(client=>{
                        if(client){                        
                            return res.json({status:false, message:'Client already exists(Enter unique phone)'});
                        }
                        
                        imagekit.upload({
                            file : base64Img, //required
                            fileName : "clientImg.jpg"   //required
                        
                        }, function(error, result) {
                            if(error) {console.log(error);}
                            else {
                                console.log(result.url);
                    
                                const db = getDb();
                    
                                const client = new Client(clientID,clientName,phone,email,password,result.url);

                                //saving in database                        
                                client.save()
                                .then(resultData=>{
                                    
                                    res.json({status:true,message:"Client Added",data:resultData["ops"][0]});
                                    
                                })
                                .catch(err=>{
                                    res.json({status:false,message:"Client not added"});
                                    
                                });                
                            }
                        })
                    })

                }).catch(err=>console.log(err));                
                                   
                })
                .then(resultData=>{
                   
                })
                .catch(err=>{
                    res.json({status:false,error:err})
                })             
     })
});


router.post('/edit-client-image',upload.single('clientImg'),(req,res,next)=>{
    
    const clientId = +req.body.clientId;

    var imagekit = new ImageKit({
        publicKey : "public_WlmDyQDHleOQopDhwUECOh0zPKU=",
        privateKey : "private_0YX4jtTBzNLifx3C2Egcgb1xNZs=",
        urlEndpoint : "https://ik.imagekit.io/4afsv20kjs"
    });
    
    var base64Img = req.file.buffer;
 
    const db = getDb();
    Client.findClientByClientId(JSON.parse(+clientId))
    .then(clientDoc=>{        
        if(!clientDoc)
        {
             res.json({ message:'Client does not exist',status:false});
        }
        else{

            imagekit.upload({
                file : base64Img, //required
                fileName : "clientImg.jpg"   //required
               
            }, function(error, result) {
                if(error) {console.log(error);}
                else {
                    console.log(result.url);
                    
          clientDoc.clientImg = result.url;            
                      
           const db = getDb();
           db.collection('clients').updateOne({clientId:clientId},{$set:clientDoc})
                       .then(resultData=>{
                           
                           res.json({message:'Details Updated',status:true,client:clientDoc});
                       })
                      .catch(err=>console.log(err));  
                }
            });      

           }
        })      
})





module.exports = router;

