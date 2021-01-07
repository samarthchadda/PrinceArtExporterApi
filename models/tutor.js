const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class Tutor
{
    constructor(id,fname,lname,email,phone,pwd,country,langName,langLevel,subject,resume,rate,title,content,video,isVerified,date,token)
    {
        this.tutorId  = id;
        this.firstName = fname;
        this.lastName = lname;
        this.email = email;        
        this.phone = phone;
        this.password = pwd;
        this.country = country;
        this.tutorImages = [];
        // this.languages = [];
        this.langName = langName;
        this.langLevel = langLevel
        this.subject = subject;
        this.resume = resume;
        this.hourlyRate = rate;
        this.descTitle = title;
        this.descContent = content;      
        this.video = video;  
        this.isVerified = isVerified;
        this.registrationDate = date;
        this.deviceToken = token;
        
    }


    save()
    {
        const db = getDb();
        return db.collection('tutors').insertOne(this);
                              
    }

    static findTutorByEmail(email)
    {
        const db = getDb();
                            
        return db.collection('tutors').findOne({ email:email })
                                            .then(tutor=>{                                                
                                                
                                                return tutor;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static findTutorByPhone(phone)
    {
        const db = getDb();
                            
        return db.collection('tutors').findOne({phone:phone })
                                            .then(tutor=>{                                               
                                                
                                                return tutor;  
                                            })
                                            .catch(err=>console.log(err));
    }

    static findTutorById(id)
    {
        const db = getDb();
                            
        return db.collection('tutors').findOne({ tutorId:id })
                                            .then(tutor=>{                                                
                                                
                                                return tutor;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static fetchAllTutors()
    {
        const db = getDb();
        return db.collection('tutors').find().toArray()
                            .then(tutorData=>{
                               
                                return tutorData;
                            })
                            .catch(err=>console.log(err));
    }


}


module.exports = Tutor;

