const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class Availability
{
    constructor(id,status,timeslot,startDate,endDate)
    {
        this.empId = id;
        this.availStatus = status;
        this.timeslot = timeslot;
        this.startDate = startDate;
        this.endDate = endDate;                       
    }


    save()
    {
        const db = getDb();
        return db.collection('availabilities').insertOne(this);
                              
    }

    
    static findAvailByEmpId(id)
    {
        const db = getDb();
                            
        return db.collection('availabilities').find({ empId:id }).toArray()
                                            .then(avail=>{
                                                                                                                                               
                                                return avail;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static findAvailByEmpIdAndDate(id,sDate,eDate)
    {
        const db = getDb();
                            
        return db.collection('availabilities').findOne({ empId:id ,startDate:sDate,endDate:eDate})
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

