const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class Parent
{
    constructor(firstNm,lastNm,email,phone,pwd,token,image)
    {
        this.firstName = firstNm;
        this.lastName = lastNm;        
        this.email = email;
        this.phone = phone;
        this.password = pwd;
        this.deviceToken = token;
        this.parentImg = image;
        
    }


    save()
    {
        const db = getDb();
        return db.collection('parents').insertOne(this);
                              
    }

    static findUserByEmail(email)
    {
        const db = getDb();
                            
        return db.collection('parents').findOne({ email:email })
                                            .then(parent=>{
                                                
                                                
                                                return parent;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static findUserByPhone(phone)
    {
        const db = getDb();
                            
        return db.collection('parents').findOne({ phone:phone })
                                            .then(parent=>{
                                                
                                                
                                                return parent;  
                                            })
                                            .catch(err=>console.log(err));

    }

}


module.exports = Parent;

