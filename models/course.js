const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class Course
{
    constructor(id,name,img,desc,tutorIds,isActive,date)
    {
        this.courseId  = id;
        this.courseName = name;
        this.courseImage = img;
        this.courseDesc = desc;
        this.tutorIds = [];
        this.isActive = isActive;
        this.registrationDate = date;
        
    }


    save()
    {
        const db = getDb();
        return db.collection('courses').insertOne(this);
                              
    }


    static findCourseByCourseId(id)
    {
        const db = getDb();
                            
        return db.collection('courses').findOne({ courseId:id })
                                            .then(course=>{                                                
                                                
                                                return course;  
                                            })
                                            .catch(err=>console.log(err));
    }


    static fetchAllCourses()
    {
        const db = getDb();
        return db.collection('courses').find().toArray()
                            .then(courseData=>{
                               
                                return courseData;
                            })
                            .catch(err=>console.log(err));
    }

    static fetchAllCoursesByTutorId(id)
    {
        const db = getDb();
        return db.collection('courses').find({tutorId:id}).toArray()
                            .then(courseData=>{
                               
                                return courseData;
                            })
                            .catch(err=>console.log(err));
    }


}


module.exports = Course;

