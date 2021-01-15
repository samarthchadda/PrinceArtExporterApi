const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class Student
{
    constructor(id,fname,lname,phone,email,pwd,img,token)
    {
        this.studentId = id;
        this.firstName = fname;
        this.lastName = lname;        
        this.phone = phone;
        this.email = email;        
        this.password = pwd;
        this.studentImg = img;
        this.deviceToken = token;
        this.registrationDate = new Date();
      
    }


    save()
    {
        const db = getDb();
        return db.collection('students').insertOne(this);
                              
    }

    static findStudentByEmail(email)
    {
        const db = getDb();
                            
        return db.collection('students').findOne({ email:email })
                                            .then(client=>{                                                
                                                
                                                return client;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static findStudentByPhone(phone)
    {
        const db = getDb();
                            
        return db.collection('students').findOne({ phone:phone })
                                            .then(client=>{                                                
                                                
                                                return client;  
                                            })
                                            .catch(err=>console.log(err));

    }


    static findStudentByDates(sDate,eDate)
    {
        const db = getDb();
                            
        return db.collection('students').find({ registrationDate:{$gte:sDate,$lte:eDate} }).toArray()
                                            .then(appointDetail=>{
                                            //    console.log(appointDetail)                                                 
                                                return appointDetail;  
                                            })
                                            .catch(err=>console.log(err));
    }

    static findStudentByStudentId(id)
    {
        const db = getDb();
                            
        return db.collection('students').findOne({ studentId:id })
                                            .then(client=>{                                                
                                                
                                                return client;  
                                            })
                                            .catch(err=>console.log(err));

    }


    static fetchAllstudents()
    {
        const db = getDb();
        return db.collection('students').find().toArray()
                            .then(ownerData=>{
                               
                                return ownerData;
                            })
                            .catch(err=>console.log(err));
    }

}


module.exports = Student;

