const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class Appointment
{
   
   
    constructor(id,fac_phone,par_phone,appDate,appTimeSlot,meetingId,fac_name,fac_cat,status,device_ID)
    {     
     
        this.appointmentID = id;
        this.faculty_phone = fac_phone;
        this.parent_phone =  par_phone;
        this.appointmentDate = appDate;
        this.timeSlot = appTimeSlot;
        this.MeetingId = meetingId;
        this.FacultyName=fac_name;
        this.FacultyCategory = fac_cat;
        this.Status = status;
        this.DeviceID = device_ID;
        this.PostedDate = new Date();      
       
        
    }

     
    save()
    {
      
        const db = getDb();                  
        // console.log(this);
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

    static findAppointByID(appointID)
    {
        const db = getDb();
                            
        return db.collection('appointments').findOne({ appointmentID:appointID })
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static findAppointByParent(phone)
    {
        const db = getDb();
                            
        return db.collection('appointments').find({ parent_phone:phone,appointmentDate:{$gte:Date.now()} }).toArray()
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static findAppointByFaculty(phone)
    {
        const db = getDb();
                            
        return db.collection('appointments').find({ faculty_phone:phone,appointmentDate:{$gte:Date.now()} }).toArray()
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static findAppointByFacultyDate(phone,dt)
    {
        const db = getDb();
                            
        return db.collection('appointments').find({ faculty_phone:phone,appointmentDate:dt }).toArray()
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static findAppointByParentDate(phone,dt)
    {
        const db = getDb();
                            
        return db.collection('appointments').find({ parent_phone:phone,appointmentDate:dt }).toArray()
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));

    }


}


module.exports = Appointment;

