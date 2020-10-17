const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class Faculty
{
    constructor(nm,phone,pwd,category,img,fee,token)
    {
        this.Name = nm; 
        this.Phone = phone;
        this.Password = pwd;
        this.Category = category;
        this.FacultyImg = img;
        this.Fees = fee;
        this.Token = token;
        this.RegistrationDate = new Date();
        
    }

   


    save()
    {
        const db = getDb();
        return db.collection('faculties').insertOne(this);
                              
    }
    

    static findUserByPhone(phone)
    {
        const db = getDb();
                            
        return db.collection('faculties').findOne({ Phone:phone })
                                            .then(faculty=>{
                                                
                                                
                                                return faculty;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static fetchAllFaculties()
    {
        const db = getDb();
        return db.collection('faculties').find().toArray()
                            .then(facultyData=>{
                               
                                return facultyData;
                            })
                            .catch(err=>console.log(err));
    }


  
     
    static appointFaculties(nm,phone,pwd,category,img,fees,token,timeSlot,perShare)
    {
        const db = getDb();     
        
                            
        return db.collection('appointmentFaculties').insertOne({Name:nm,
                                                          Phone:phone,
                                                           Password:pwd,
                                                           Category:category,
                                                           FacultyImg:img,
                                                           Fees:fees,
                                                           Token:token,
                                                           TimeSlot:timeSlot,
                                                           PercentageShare:perShare,
                                                           RegistrationDate : new Date()
                                                        });

    }

    static fetchAllAppointFaculties()
    {
        const db = getDb();
        return db.collection('appointmentFaculties').find().toArray()
                            .then(facultyData=>{
                               
                                return facultyData;
                            })
                            .catch(err=>console.log(err));
    }

    static findAppointFacultyByPhone(phone)
    {
        const db = getDb();
                            
        return db.collection('appointmentFaculties').findOne({ Phone:phone })
                                            .then(facDetail=>{
                                                                                              
                                                return facDetail;  
                                            })
                                            .catch(err=>console.log(err));

    }


}


module.exports = Faculty;

