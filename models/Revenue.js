const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class Revenue
{
    constructor(nm,phone,courNm,amt,payBundle)
    {
        this.ParentName = nm; 
        this.ParentPhone = phone;
        this.CourseName = courNm; 
        this.Amount = amt;        
        this.PaymentBundle = payBundle;
        this.PaymentDate = new Date();
        
    }
 

    save()
    {
        const db = getDb();
        return db.collection('courseRevenues').insertOne(this);
                              
    }
   

    static fetchAllCourseRevenue()
    {
        const db = getDb();
        return db.collection('courseRevenues').find().toArray()
                            .then(revenueData=>{
                               
                                return revenueData;
                            })
                            .catch(err=>console.log(err));
    }


  
     
    static appointRevenue(par_nm,par_phone,fac_nm,fac_phone,amt,payBundle)
    {
        const db = getDb();     
        
                            
        return db.collection('appointmentRevenues').insertOne({ 
                                                        ParentName : par_nm, 
                                                        ParentPhone : par_phone,
                                                        FacultyName : fac_nm, 
                                                        FacultyPhone : fac_phone,
                                                        Amount : amt,       
                                                        PaymentBundle : payBundle,
                                                        PaymentDate : new Date()
                                                        });

    }


    static fetchAllAppointRevenue()
    {
        const db = getDb();
        return db.collection('appointmentRevenues').find().toArray()
                            .then(revenueData=>{
                               
                                return revenueData;
                            })
                            .catch(err=>console.log(err));
    }

   

}


module.exports = Revenue;

