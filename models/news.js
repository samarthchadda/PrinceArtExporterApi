const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class News
{
   
    constructor(id,content,newsImg)
    {
        this.NewsId = id;
        this.NewsContent = content;
        this.Image =  newsImg;
        this.PostedDate = new Date();
        
    }

    
    save()
    {
        const db = getDb();
        return db.collection('news').insertOne(this);
                              
    }

    static fetchAllNews()
    {
        const db = getDb();
        return db.collection('news').find().toArray()
                            .then(newsData=>{
                               
                                return newsData;
                            })
                            .catch(err=>console.log(err));
    }


    static fetchNewsById(id)
    {
        const db = getDb();
        return db.collection('news').findOne({NewsId:id})
                            .then(newsData=>{
                               
                                return newsData;
                            })
                            .catch(err=>console.log(err));
    }

     static deleteNews(id)
    {
        const db = getDb();
        return db.collection('news').deleteOne({NewsId:id})
                .then(result=>{
                    console.log(result);
                })
                .catch(err=>console.log(err));
    }


}


module.exports = News;

