const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class Saloon
{
    constructor(sid,oid,name,phone,address,photos)
    {
        this.saloonId = sid;   
        this.ownerId = oid;            
        this.saloonName = name; 
        this.phone = phone;
        this.address = address;
        this.saloonPhotos = photos;    
        
    }

   
    save()
    {
        const db = getDb();
        return db.collection('saloons').insertOne(this);
                              
    }
    

    static findSaloonByPhone(phone)
    {
        const db = getDb();
                            
        return db.collection('saloons').findOne({ phone:phone })
                                            .then(saloon=>{
                                                                                                
                                                return saloon;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static findSaloonBySaloonID(id)
    {
        const db = getDb();
                            
        return db.collection('saloons').findOne({ saloonId:id })
                                            .then(saloon=>{
                                                                                                
                                                return saloon;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static fetchAllSaloons()
    {
        const db = getDb();
        return db.collection('saloons').find().toArray()
                            .then(saloonData=>{
                               
                                return saloonData;
                            })
                            .catch(err=>console.log(err));
    }


    
    static fetchSaloonsByOwnerID(id)
    {
        const db = getDb();
        return db.collection('saloons').find({ownerId:id}).toArray()
                            .then(saloonData=>{
                               
                                return saloonData;
                            })
                            .catch(err=>console.log(err));
    }


  


}


module.exports = Saloon;

