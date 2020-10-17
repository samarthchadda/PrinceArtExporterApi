const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class Admin
{
    constructor(email,pwd)
    {
        this.email = email;
        this.password = pwd;
       
    }


    save()
    {
        const db = getDb();
        return db.collection('admins').insertOne(this);
                              
    }

    
    static findAdminByEmail(email)
    {
        const db = getDb();
                            
        return db.collection('admins').findOne({ email:email })
                                            .then(admin=>{
                                                
                                                
                                                return admin;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static findAdminByToken(token)
    {
        const db = getDb();
                            
        return db.collection('admins').findOne({ resetToken:token })
                                            .then(admin=>{
                                                
                                                
                                                return admin;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static fetchAllAdmins()
    {
        const db = getDb();
        return db.collection('admins').find().toArray()
                            .then(Data=>{
                               
                                return Data;
                            })
                            .catch(err=>console.log(err));
    }

}


module.exports = Admin;

