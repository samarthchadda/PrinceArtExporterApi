const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class Availability
{
    constructor(id,status,timeslot)
    {
        this.empId = id;
        this.availStatus = status;
        this.timeslot = timeslot;
               
    }


    save()
    {
        const db = getDb();
        return db.collection('availabilities').insertOne(this);
                              
    }

    
    static findAvailByEmpId(id)
    {
        const db = getDb();
                            
        return db.collection('availabilities').findOne({ empId:id })
                                            .then(avail=>{
                                                                                                
                                                return avail;  
                                            })
                                            .catch(err=>console.log(err));

    }

 
    static fetchAllAvails()
    {
        const db = getDb();
        return db.collection('availabilities').find().toArray()
                            .then(avails=>{
                               
                                return avails;
                            })
                            .catch(err=>console.log(err));
    }

}


module.exports = Availability;

