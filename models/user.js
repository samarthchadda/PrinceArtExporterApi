const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class User
{
    constructor(email,password,name)
    {
        this.email = email;        
        this.password = password;
        this.name = name;      
    }


    save()
    {
        const db = getDb();
        return db.collection('users').insertOne(this);
                              
    }

    static findUserByEmail(email)
    {
        const db = getDb();
                            
        return db.collection('users').findOne({ email:email })
                                            .then(user=>{                                                
                                                
                                                return user;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static fetchAllUsers()
    {
        const db = getDb();
        return db.collection('users').find().toArray()
                            .then(userData=>{
                               
                                return userData;
                            })
                            .catch(err=>console.log(err));
    }

}


module.exports = User;

