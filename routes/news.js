const express = require('express');
const router = express.Router();
const News = require('../models/news');
const getDb = require('../util/database').getDB; 

const multer = require('multer');

// let path;
// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, __dirname+'/uploadNews/');
//     },
//     filename: function(req, file, cb) {
//         // cb(null,  file.originalname);
//         path=file.originalname;
//     }
// });

// const fileFilter = (req,file,cb)=>{
//     if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
//         cb(null,true);
//     }else{
//      cb(null,false);
//     }
   
// }

const upload = multer();



// SDK initialization

var ImageKit = require("imagekit");
var fs = require('fs');





// https://prajhaapp.herokuapp.com/api/all-news

router.get('/all-news',(req,res,next)=>{
  
    News.fetchAllNews()
                .then(newsData=>{
                   
                    res.json({message:"All News returned",AllNews:newsData})

                })
                .catch(err=>console.log(err));

});


router.get('/all-news/:id',(req,res,next)=>{
  
    const id = req.params.id;
    News.fetchNewsById(JSON.parse(id))
                .then(newsData=>{
                   if(!newsData){
                       return res.json({status:false,message:"No news with this ID"})
                   }
                    res.json({status:true,message:" News returned",news:newsData})

                })
                .catch(err=>console.log(err));

});


// https://prajhaapp.herokuapp.com/api/post-news

router.post('/post-news' ,upload.single('newsImage'),(req,res,next)=>{

    let code;
    const content = req.body.content;

    var imagekit = new ImageKit({
        publicKey : "public_WlmDyQDHleOQopDhwUECOh0zPKU=",
        privateKey : "private_0YX4jtTBzNLifx3C2Egcgb1xNZs=",
        urlEndpoint : "https://ik.imagekit.io/4afsv20kjs"
    });
    
    var base64Img = req.file.buffer;


    // adding auto-generated id
    let newVal;
    const db = getDb();     
    db.collection('newsCounter').find().toArray().then(data=>{
        
        newVal = data[data.length-1].count;
       
        newVal = newVal + 1;
        console.log(newVal);
       
        code = newVal;
        
        db.collection('newsCounter').insertOne({count:newVal})
                .then(result=>{

                    imagekit.upload({
                        file : base64Img, //required
                        fileName : "newsImg.jpg"   //required
                       
                    }, function(error, result) {
                        if(error) {console.log(error);}
                        else {
                            console.log(result.url);
                
                             const db = getDb();
                
                            const news = new News(code,content,result.url);
                            //saving in database
                        
                            news.save()
                            .then(resultData=>{
                                
                                res.json({Status:true,message:"News Posted",data:resultData["ops"][0]});
                                
                            })
                            .catch(err=>{
                                res.json({Status:false,message:"News Not Posted"});
                                
                            });                
                        }
                    });                
                                   
                })
                .then(resultData=>{
                   
                })
                .catch(err=>{
                    res.json({status:false,error:err})
                })             
     })

     // adding auto-generated id 

});



router.post('/edit-news',upload.single('newsImage'),(req,res,next)=>{
    
    const newsId = req.body.newsId;
 
    const content = req.body.content;

    var imagekit = new ImageKit({
        publicKey : "public_WlmDyQDHleOQopDhwUECOh0zPKU=",
        privateKey : "private_0YX4jtTBzNLifx3C2Egcgb1xNZs=",
        urlEndpoint : "https://ik.imagekit.io/4afsv20kjs"
    });
    
    var base64Img = req.file.buffer;
 

    const db = getDb();
    News.fetchNewsById(+newsId)
    .then(newsDoc=>{
        
        if(!newsDoc)
        {
             res.json({ message:'News Does not exist',status:false});
        }
        else{



            imagekit.upload({
                file : base64Img, //required
                fileName : "newsImg.jpg"   //required
               
            }, function(error, result) {
                if(error) {console.log(error);}
                else {
                    console.log(result.url);
                    
            
          newsDoc.NewsContent = content;    
          newsDoc.Image = result.url;            
           
           
           const db = getDb();
           db.collection('news').updateOne({NewsId:+newsId},{$set:newsDoc})
                       .then(resultData=>{
                           
                           res.json({message:'Details Updated',status:true});
                       })
                      .catch(err=>console.log(err));
  
                }
            });      

           }
        })      
})




router.post('/delete-news',(req,res,next)=>{

    const id = req.body.id;

    News.fetchNewsById(+id)
    .then(news=>{
        if(!news)
        {
            return res.json({ message:'News Does not exist',status:false});
        }

        News.deleteNews(+id)
        .then(result=>{
            res.json({status:true,message:"News Deleted Successfully"});
        })
        .catch(err=>{
            res.json({status:false,error:err});
        })   
      
    })   
})




module.exports = router;

