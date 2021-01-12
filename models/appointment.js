const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class Appointment
{
   
   
    constructor(id,tutorId,tname,duration,timeSlot,date,day,cost,sid,sname,status)
    {          
        this.appointmentId = id;
        this.tutorId = tutorId;
        this.tutorName = tname;
        this.duration = duration;
        this.timeSlot = timeSlot;
        this.bookingDate = date;
        this.bookingDay = day;
        this.totalCost = cost;     
        this.studentId = sid;
        this.studentName = sname;
        this.status = status;    
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
        return db.collection('appointments').find().sort({bookingDate:-1,timeSlot:-1}).toArray()
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

    static findAppointsByTutorId(tid)
    {
        const db = getDb();
                            
        return db.collection('appointments').find({ tutorId:tid}).toArray()
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static findAppointsByStudentId(sid)
    {
        const db = getDb();
                            
        return db.collection('appointments').find({ studentId:sid}).toArray()
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));

    }
  
  
    static findAppointByTutorIdAndDate(tid,bDate)
    {
        const db = getDb();
                            
        return db.collection('appointments').find({ tutorId:tid,bookingDate:bDate }).sort({timeSlot:1}).toArray()
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));
    }

    static findAppointByTutorIdAndDateTime(tid,bDate,srtTime,endTime)
    {
        const db = getDb();
                            
        return db.collection('appointments').find({ tutorId:tid,bookingDate:bDate,'timeSlot.startTime':srtTime,'timeSlot.endTime':endTime}).toArray()
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));
    }




    static findAppointByClientPhoneAndCDate(phone, cDate)
    {
        const db = getDb();
                                                                                                  //ascending order of booking date and booking time
        return db.collection('appointments').find({ clientPhone:phone,bookingDate:{$gte:cDate}  }).sort({bookingDate:1,bookingTime:1}).toArray()
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));
    }

    static findAppointByClientPhoneAndPDate(phone, cDate)
    {
        const db = getDb();
                                                                                              //descending order of booking date and booking time
        return db.collection('appointments').find({ clientPhone:phone,bookingDate:{$lt:cDate} }).sort({bookingDate:-1,bookingTime:-1}).toArray()
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));
    }

   
    static saloonWeekRevenue(sid, sDate,eDate)
    {
        const db = getDb();
                            
        return db.collection('appointments').find({ saloonId:sid,bookingDate:{$gte:sDate,$lte:eDate} }).toArray()
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));
    }

    static findAppointsByDates(sDate,eDate)
    {
        const db = getDb();
                            
        return db.collection('appointments').find({ bookingDate:{$gte:sDate,$lte:eDate} }).toArray()
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));
    }


    static empWeekRevenue(eid, sDate,eDate)
    {
        const db = getDb();
                                                                                            //array of objects
        return db.collection('appointments').find({ empId:eid,bookingDate:{$gte:sDate,$lte:eDate} }).toArray()
                                            .then(appointDetail=>{
                                                                                                
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));
    }


    static saloonGraphRevenue(sid, dates)
    {
        const db = getDb();
        var allRevenues = [];
        dates.forEach(d=>{
            // console.log(dates.length)
            let startDate = d.srtDate;
            startDate = new Date(startDate).getTime();
            // console.log(d.srtDate);
        
            let endDate = d.endDate;
            endDate = new Date(endDate).getTime();
            // console.log(d.endDate);  
           db.collection('appointments').find({ saloonId:sid,bookingDate:{$gte:startDate,$lte:endDate} }).toArray()
                                            .then(appointDetail=>{
                                                allRevenues.push(appointDetail.length);
                                                // console.log(allRevenues);         
                                                // return allRevenues;  
                                               
                                            })
                                            .catch(err=>console.log(err));
                            
                     
                                            
              })
              setTimeout(()=>{
                console.log(allRevenues);
                // return "1";
            },1000);
           
            return allRevenues;
}



}


module.exports = Appointment;

