const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;


class Course
{
   
    constructor(courseId,name,desc,fee,content,photo)
    {
        this.CourseID = courseId;
        this.CourseName = name;
        this.Description = desc
        this.Fees = fee;
        this.Content = content;
        this.coursePhoto = photo;
        this.PostedDate = new Date();
        
    }

    
    save()
    {
        const db = getDb();
        return db.collection('courses').insertOne(this);
                              
    }

    static fetchAllCourses()
    {
        const db = getDb();
        return db.collection('courses').find().toArray()
                            .then(courses=>{
                               
                                return courses;
                            })
                            .catch(err=>console.log(err));
    }

    static findCourseByCode(code)
    {
        const db = getDb();
                            
        return db.collection('courses').findOne({ CourseID:code })
                                            .then(courseDetail=>{
                                                                                                
                                                return courseDetail;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static courseEnroll(fstName,lstNm,phone,email,dob,courseId,courseNm,userImg)
    {
        const db = getDb();     
        
                            
        return db.collection('coursesEnroll').insertOne({FirstName:fstName,
                                                            LastName:lstNm,
                                                            Phone:phone,
                                                            Email:email,
                                                            DOB:dob,                                                            
                                                            CourseID:courseId,
                                                            CourseName:courseNm,
                                                            UserImage:userImg,
                                                            EnrollDate:new Date()
                                                        });

    }

    static fetchAllEnrollments()
    {
        const db = getDb();
        return db.collection('coursesEnroll').find().toArray()
                            .then(enrollments=>{
                               
                                return enrollments;
                            })
                            .catch(err=>console.log(err));
    }

    static findEnrollmentByPhone(phone,courseCode)
    {
        const db = getDb();
                            
        return db.collection('coursesEnroll').findOne({ Phone:phone, CourseID:courseCode})
                                            .then(enrollDetail=>{
                                                                                                
                                                return enrollDetail;  
                                            })
                                            .catch(err=>console.log(err));

    }

    
    static findEnrollByPhone(phone)
    {
        const db = getDb();
                            
        return db.collection('coursesEnroll').find({ Phone:phone}).toArray()
                                            .then(enrollDetail=>{
                                                                                                
                                                return enrollDetail;  
                                            })
                                            .catch(err=>console.log(err));

    }

}


module.exports = Course;

