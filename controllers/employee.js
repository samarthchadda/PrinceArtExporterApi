
const Employee = require('../models/employee');

const Service = require('../models/services');


const getDb = require('../util/database').getDB; 


exports.getAllEmployees=(req,res,next)=>{
    
    Employee.fetchAllEmployees()
                .then(employees=>{
                   
                    res.json({message:"All Data returned",employees:employees})

                })
                .catch(err=>console.log(err));

}


exports.getSingleEmployee=(req,res,next)=>{
  
    const empId = req.params.empId;
   
    Employee.findEmployeeByEmpID(JSON.parse(empId))
    .then(empDoc=>{
       
        if(empDoc){
           
             res.json({status:true, data:empDoc});
        }
        else{
            res.json({status:false,message:"No such employee exist"});
        }          

    })    
}


exports.getSaloonEmployees=(req,res,next)=>{

    const saloonId = req.params.saloonId;
    let count = 0;

    Employee.findEmployeesBySaloonID(JSON.parse(saloonId))
                    .then(employees=>{
                        if(employees.length==0)
                        {
                            return res.json({ message:'Employee does not exist',data:employees});
                        }
                        let services = [];
                        employees.forEach(emp=>{
                            count = count+1;
                            emp.empServices.forEach(serId=>{
                                serId = +serId;
                                Service.findServiceByServiceID(+serId)
                                        .then(servData=>{    
                                          services.push(servData);   
                                        //   console.log(services);    
                                        if(services.length==emp.empServices.length)
                                        {   
                                           emp.empServices = services;
                                        //   console.log("EMP Service: ",emp.empServices)   
                                          res.json({message:"All Employees returned",data:employees});   
                                        }                                
                                       
                                          
                                        })
                                        .catch(err=>console.log(err))    
                            })
                            // console.log(emp.empServices)
                            // emp.empServices = services;
                            
                        // if(count==employees.length)
                        // {
                        //     console.log(count)
                        //     res.json({message:"All Employees returned",data:employees});   
                        // }  
                        
                     
                        })


                    })

}




exports.delEmployee=(req,res,next)=>{

    const empId = +req.params.empId;

    Employee.findEmployeeByEmpID(JSON.parse(empId))
                    .then(employee=>{
                        if(!employee)
                        {
                            return res.json({ message:'Employee does not exist',status:false});
                        }

                        const db = getDb();
                        db.collection('employees').deleteOne({empId:empId})
                                    .then(resultData=>{
                                        
                                        res.json({message:'Employee Deleted',status:true});
                                    })
                                    .catch(err=>console.log(err));
                    })
}




