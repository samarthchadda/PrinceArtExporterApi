const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class Appointment
{
   
   
    constructor(id,saloonId,empId,serviceId,clientName,clientPhone,empName,time,date,day,cost,note)
    {          
        this.appointmentId = id;
        this.saloonId = saloonId;
        this.empId = empId;
        this.serviceId = serviceId;
        this.clientName = clientName;
        this.clientPhone = clientPhone;
        this.empName = empName;
        this.bookingTime = time;
        this.bookingDate = date;
        this.bookingDay = day;
        this.totalCost = cost;         
        this.note = note;     
        this.appointDate = new Date();             
        
    }

     
    save()
    {
      
        const db = getDb();      
        return db.collection('appointments').insertOne(this);
                              
    }

    static fetchAllAppointments()
    {
        const db = getDb();
        return db.collection('appointments').find().toArray()
                            .then(appointData=>{
                               
                                return appointData;
                            })
                            .catch(err=>console.log(err));
    }

    static findAppointByID(appointId)
    {
        const db = getDb();
                            
        return db.collection('appointments').findOne({ appointmentId:appointId })
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));

    }


  
    static findAppointByEmpIdAndDate(eid,bDate)
    {
        const db = getDb();
                            
        return db.collection('appointments').find({ empId:eid,bookingDate:bDate }).toArray()
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));
    }

    static findAppointBySaloonIdAndDate(sid, bDate)
    {
        const db = getDb();
                            
        return db.collection('appointments').find({ saloonId:sid,bookingDate:bDate }).toArray()
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));
    }


}


module.exports = Appointment;

