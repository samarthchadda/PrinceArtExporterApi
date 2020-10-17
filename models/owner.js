const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class Owner
{
    constructor(id,name,email,pwd)
    {
        this.ownerId = id;
        this.ownerName = name;
        this.email = email;        
        this.password = pwd;
      
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


}


module.exports = Owner;

