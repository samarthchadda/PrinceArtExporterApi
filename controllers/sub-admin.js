
const SubAdmin = require('../models/sub-admin');

const getDb = require('../util/database').getDB; 


//POST
exports.subAdminRegister = (req,res,next)=>{
  
    //parsing data from incoming request
    const adminId = req.body.adminId;
    const password = req.body.password;    
    const permissions = req.body.permissions;
   
    
    SubAdmin.findUserById(adminId)
            .then(trainingDoc=>{
                if(trainingDoc){
                    
                    return res.json({Status:false, message:'Already Registered'});
                }
                
                    //saving in database
                    const subAdmin = new SubAdmin(adminId,password,permissions);

                        return subAdmin.save()
                        .then(resultData=>{
                            
                            res.json({Status:true,message:"Sub-Admin Registered",SubAdmin:resultData["ops"][0]});
                            
                        })
                        .catch(err=>console.log(err));                      
            })
        .then(resultInfo=>{                   
            
        })
        .catch(err=>console.log(err));      

}


exports.singleSubAdimData=(req,res,next)=>{
    const adminId = req.params.adminId;
   
    SubAdmin.findUserById(JSON.parse(adminId))
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'Sub-Admin Does not exist',data:null});
                    }

                    res.json({ message:'User Exists',SubAdmin:user});


                })

}

exports.allSubAdminData=(req,res,next)=>{
  
    SubAdmin.fetchAllSubAdmins()
                .then(subadmins=>{                   
                    res.json({message:"All Data returned",SubAdmins:subadmins})

                })
                .catch(err=>console.log(err));

}


exports.editSubAdminData=(req,res,next)=>{

      //parsing data from incoming request
      const adminId = req.body.adminId;
      const password = req.body.password;    
      const permissions = req.body.permissions;

 SubAdmin.findUserById(adminId)
             .then(adminData=>{
                 if(!adminData)
                 {
                     return res.json({ message:'SubAdmin Does not exist',Status:false});
                 }

                
                 adminData.AdminPassword = password
                 adminData.Permissions = permissions;               
               
                 const db = getDb();
                 db.collection('subAdmins').updateOne({AdminId:adminId},{$set:adminData})
                             .then(resultData=>{
                                 
                                 res.json({message:'Details Updated',Status:true});
                             })
                             .catch(err=>console.log(err));
             })
}




//LOGIN
exports.subAdminLogin=(req,res,next)=>{
    const id = req.body.id;
    const password = req.body.password;
    SubAdmin.findUserById(id)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'Sub-Admin Does not exist',status:false});
                    }

                    if(user.AdminPassword == password)
                    {                        
                        res.json({ message:'Login Successful',status:true, SubAdmin:user});
                    }else{
                       
                        res.json({ message:'Login UnSuccessful....Password is incorrect',status:false});
                    }
                })
}


exports.postDelSubAdmin = (req,res,next)=>{

    const id = req.body.id;


    SubAdmin.findUserById(id)
    .then(subAdmin=>{
        if(!subAdmin)
        {
            return res.json({ message:'Sub-Admin Does not exist',status:false});
        }

        SubAdmin.deleteSubadmin(id)
        .then(result=>{
            res.json({status:true,message:"Sub-Admin Deleted Successfully"});
        })
        .catch(err=>{
            res.json({status:false,error:err});
        })
     

      
    })


   
}


