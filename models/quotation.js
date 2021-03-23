const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class Quotation
{ 
   constructor(qno,buyerName,country,currency,size,price,containerSize,items,email,visitCode)
    {          
        this.quotationNo = qno;
        this.buyerName = buyerName;
        this.country = country;
        this.currency = currency;
        this.size = size;
        this.price = price;
        this.containerSize = containerSize;
        this.items = items;
        this.userEmail = email;
        this.visitCode = visitCode;
        this.quotationDate = new Date();                     
    }

     
    save()
    {
      
        const db = getDb();      
        return db.collection('quotations').insertOne(this);
                              
    }

    static fetchAllQuotations()
    {
        const db = getDb();
        return db.collection('quotations').find().toArray()
                            .then(quotationData=>{
                               
                                return quotationData;
                            })
                            .catch(err=>console.log(err));
    }

    static findQuotationsByEmail(email)
    {
        const db = getDb();
                            
        return db.collection('quotations').find({ userEmail:email }).toArray()
                                            .then(quotationDetail=>{
                                                                                                
                                                return quotationDetail;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static findQuotationByQuotNo(qno)
    {
        const db = getDb();
                            
        return db.collection('quotations').findOne({ quotationNo:qno })
                                            .then(quotationData=>{                                                
                                                
                                                return quotationData;  
                                            })
                                            .catch(err=>console.log(err));

    }
}

module.exports = Quotation;

