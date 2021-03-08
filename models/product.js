const mongodb = require('mongodb');
const getDb = require('../util/database').getDB; 

const ObjectId = mongodb.ObjectId;

class Product
{
    constructor(CBM,CostPerKg,FoldingHeight,FoldingLength,FoldingWidth,FullHeight,FullLength,
            FullWidth,IronRemark,IronWeight,LocationName,ProductCategory,ProductCode,ProductDesc,ProductFinish,
            ProductName,ProuctSampleDate,Remark,SupplierRef,TotalCost,TotalWeight,WoodRemark)
    {
        this.CBM = CBM;        
        this.CostPerKg = CostPerKg;
        this.FoldingHeight = FoldingHeight;      
        this.FoldingLength = FoldingLength;        
        this.FoldingWidth = FoldingWidth;  
        this.FullHeight = FullHeight;        
        this.FullLength = FullLength;
        this.FullWidth = FullWidth;      
        this.IronRemark = IronRemark;        
        this.IronWeight = IronWeight;
        this.LocationName = LocationName;      
        this.ProductCategory = ProductCategory;      
        this.ProductCode = ProductCode;        
        this.ProductDesc = ProductDesc;
        this.ProductFinish = ProductFinish;           
        this.ProductName = ProductName;      
        this.ProuctSampleDate = ProuctSampleDate;      
        this.Remark = Remark;        
        this.SupplierRef = SupplierRef;
        this.TotalCost = TotalCost;  
        this.TotalWeight = TotalWeight;
        this.WoodRemark = WoodRemark; 
    }

    save()
    {
        const db = getDb();
        return db.collection('products').insertOne(this);
                              
    }

    static findProductByProductCode(code)
    {
        const db = getDb();
                            
        return db.collection('products').findOne({ ProductCode:code })
                                            .then(user=>{                                                
                                                
                                                return user;  
                                            })
                                            .catch(err=>console.log(err));

    }

    static fetchAllProducts()
    {
        const db = getDb();
        return db.collection('products').find().toArray()
                            .then(userData=>{
                               
                                return userData;
                            })
                            .catch(err=>console.log(err));
    }

}


module.exports = Product;

