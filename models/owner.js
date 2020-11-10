const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class Owner
{
    constructor(id,name,email,pwd,img)
    {
        this.ownerId = id;
        this.ownerName = name;
        this.email = email;        
        this.password = pwd;
        this.ownerImg = img;
        //image -- initially null at create ,   now API for edit image
      
    }


    save()
    {
        const db = getDb();
        return db.collection('owners').insertOne(this);
                              
    }

    static findOwnerByEmail(email)
    {
        const db = getDb();
                            
        return db.collection('owners').findOne({ email:email })
                                            .then(owner=>{
                                                
                                                
                                                return owner;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static findOwnerById(id)
    {
        const db = getDb();
                            
        return db.collection('owners').findOne({ ownerId:id })
                                            .then(owner=>{                                                
                                                
                                                return owner;  
                                            })
                                            .catch(err=>console.log(err));

    }


}


module.exports = Owner;

