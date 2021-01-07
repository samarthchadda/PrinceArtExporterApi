const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class Availability
{
    constructor(id,timeslot)
    {
        this.tutorId = id;
        // this.availStatus = status;
        this.timeslot = timeslot;
        // this.startDate = startDate;
        // this.endDate = endDate;                       
    }


    save()
    {
        const db = getDb();
        return db.collection('availabilities').insertOne(this);
                              
    }

    
    // static findAvailByTutorId(id)
    // {
    //     const db = getDb();
                            
    //     return db.collection('availabilities').find({ tutorId:id }).toArray()
    //                                         .then(avail=>{
                                                                                                                                               
    //                                             return avail;  
    //                                         })
    //                                         .catch(err=>console.log(err));

    // }
    static findAvailByTutorId(id)
    {
        const db = getDb();
                            
        return db.collection('availabilities').findOne({ tutorId:id })
                                            .then(avail=>{
                                                                                                                                               
                                                return avail;  
                                            })
                                            .catch(err=>console.log(err));

    }
    

    static findAvailByTutorIdAndDate(id,sDate,eDate)
    {
        const db = getDb();
                            
        return db.collection('availabilities').findOne({ tutorId:id ,startDate:sDate,endDate:eDate})
                                            .then(avail=>{
                                                                                                
                                                return avail;  
                                            })
                                            .catch(err=>console.log(err));

    }

    
    static findAvailByTutorIdAndSingleDate(id,sDate)
    {
        const db = getDb();
                            
        return db.collection('availabilities').findOne({ tutorId:id ,startDate:{$lte:sDate},endDate:{$gte:sDate}})
                                            .then(avail=>{
                                                                                                
                                                return avail;  
                                            })
                                            .catch(err=>console.log(err));

    }

    
    // static findAvailBySaloonIdAndDate(id,sDate,eDate)
    // {
    //     const db = getDb();
                            
    //     return db.collection('availabilities').findOne({ saloonId:id ,startDate:sDate,endDate:eDate})
    //                                         .then(avail=>{
                                                                                                
    //                                             return avail;  
    //                                         })
    //                                         .catch(err=>console.log(err));

    // }

    static fetchAllAvails()
    {
        const db = getDb();
        
        return db.collection('availabilities').find().toArray()
                                                .then(avail=>{
                                                                                                                                                   
                                                     return avail;  
                                                 })
                                                 .catch(err=>console.log(err));   
    }
 

}


module.exports = Availability;

