const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class SubAdmin
{
    constructor(id,pwd,permissions)
    {
        this.AdminId = id;
        this.AdminPassword = pwd;
        this.Permissions = permissions;
        this.CreatedDate = new Date();        
        
    }


    save()
    {
        const db = getDb();
        return db.collection('subAdmins').insertOne(this);
                              
    }

    
    static findUserById(adminId)
    {
        const db = getDb();
                            
        return db.collection('subAdmins').findOne({ AdminId:adminId })
                                            .then(admin=>{
                                                
                                                
                                                return admin;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static fetchAllSubAdmins()
    {
        const db = getDb();
        return db.collection('subAdmins').find().toArray()
                            .then(subData=>{
                               
                                return subData;
                            })
                            .catch(err=>console.log(err));
    }


    static deleteSubadmin(id)
    {
        const db = getDb();
        return db.collection('subAdmins').deleteOne({AdminId:id})
                .then(result=>{
                    console.log(result);
                })
                .catch(err=>console.log(err));
    }


}


module.exports = SubAdmin;

