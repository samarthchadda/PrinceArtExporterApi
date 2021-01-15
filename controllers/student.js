
const Student = require('../models/student');

const getDb = require('../util/database').getDB; 


// POST
exports.studentRegister = (req,res,next)=>{
  
    let studentID;
    //parsing data from incoming request
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phone = +req.body.phone;
    const email = req.body.email;    
    const password = req.body.password;
    const image = null;

    Student.findStudentByPhone(+phone)
                .then(userDoc=>{
                    if(userDoc){                        
                        return res.json({status:false, message:'Student Already Exists(Enter Unique Phone)'});
                    }
                    Student.findStudentByEmail(email)
                    .then(userDoc=>{
                        if(userDoc){                        
                            return res.json({status:false, message:'Student Already Exists(Enter Unique email)'});
                        }
                   
                    const db = getDb();     
                    db.collection('studentCounter').find().toArray().then(data=>{
        
                        newVal = data[data.length-1].count;
                       
                        newVal = newVal + 1;
                        console.log(newVal);
                       
                        studentID = newVal;
                        
                        db.collection('studentCounter').insertOne({count:newVal})
                                .then(result=>{
                                              
                            const student = new Student(studentID,firstName,lastName,phone,email,password,image,null);
                            //saving in database
                        
                            return student.save()
                            .then(resultData=>{
                                
                                res.json({status:true,message:"Student Registered",student:resultData["ops"][0]});
                                
                            })
                            .catch(err=>console.log(err));                                                    
                                  
                                })
                                .then(resultData=>{
                                   
                                })
                                .catch(err=>{
                                    res.json({status:false,error:err})
                                })             
                     })   
                    })

                })
                .then(resultInfo=>{                   
                  
                })
                .catch(err=>console.log(err));      
}




exports.getStudents=(req,res,next)=>{
  
    Student.fetchAllstudents()
                .then(students=>{
                   
                    res.json({message:"All Data returned",allStudents:students})

                })
                .catch(err=>console.log(err));
}

exports.getSingleStudent=(req,res,next)=>{
    
    const id = +req.params.id;
   
    Student.findStudentByStudentId(JSON.parse(id))
                .then(appoint=>{
                    if(!appoint)
                    {
                        return res.json({status:false, message:'Student does not exist',student:null});
                    }

                    res.json({status:true, message:'Student exists',student:appoint});
                })
}


//LOGIN
exports.studentLogin=(req,res,next)=>{
    const phone = +req.body.phone;
    const password = req.body.password;
    
    Student.findStudentByPhone(+phone)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'Student does not exist',status:false});
                    }

                    if(user.password == password)
                    {                        
                        res.json({ message:'Login Successful',status:true, student:user});
                    }else{
                       
                        res.json({ message:'Login Unsuccessful....Password is incorrect',status:false});
                    }
                })
}


exports.getClientsByMonth=(req,res,next)=>{
    var monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

    var today = new Date();
    // var today = new Date();
    var d;
    var months = [];
    var d = new Date();
    var month;
    var year = d.getFullYear();
    // console.log(year)

        //for last 6 months(including current month)
    // for(var i = 5; i > -1; i -= 1) {
        var keyData = 1;
        //for last 6 months(excluding current month)
    for(var i = 6; i > 0; i -= 1) {
      d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    //   console.log(d.getFullYear())
   
      months.push({month:monthNames[d.getMonth()],year:d.getFullYear(),key:keyData});
      keyData = keyData+1;
    //   console.log(keyData)
         month = monthNames[d.getMonth()];
         console.log(months)
//   console.log(month,d.getFullYear());
//   year = d.getFullYear();

    //   year = d.getFullYear();
    //   console.log(year)
    //   console.log(month);
    }
    // console.log(months)
    let dates = [];
    months.forEach(m=>{
        
        if(m.month=="january")
        {
            mo = 0;
        }
        if(m.month=="february")
        {
            mo = 1;
        }
        if(m.month=="march")
        {
            mo = 2;
        }
        if(m.month=="april")
        {
            mo = 3;
        }
        if(m.month=="may")
        {
            mo = 4;
        }
        if(m.month=="june")
        {
            mo = 5;
        }
        if(m.month=="july")
        {
            mo = 6;
        }
        if(m.month=="august")
        {
            mo = 7;
        }
        if(m.month=="september")
        {
            mo = 8;
        }
        if(m.month=="october")
        {
            mo = 9;
        }
        if(m.month=="november")
        {
            mo = 10;
        }
        if(m.month=="december")
        {
            mo = 11;
        }
        
        
        const firstDay = new Date(m.year, mo, 1);
        // alert(firstDay.getDate());
        const lastDay = new Date(m.year, mo + 1, 0);
        // alert(lastDay.getDate());
        // console.log(firstDay,lastDay)
        mo = mo+1;
        mo = mo<10?"0"+mo:mo; 
        // console.log(year)  
        dates.push({
                        srtDate: firstDay.getDate()<10?m.year.toString()+"-"+mo.toString()+"-0"+firstDay.getDate().toString():m.year.toString()+"-"+mo.toString()+"-"+firstDay.getDate().toString(),
                        endDate: lastDay.getDate()<10?m.year.toString()+"-"+mo.toString()+"-0"+lastDay.getDate().toString():m.year.toString()+"-"+mo.toString()+"-"+lastDay.getDate().toString(),
                        month:mo
                    });
  
    })
    // console.log(dates)
    var allData = [];
    dates.forEach(d=>{
        let startDate = d.srtDate;
        startDate = new Date(startDate).getTime();
        // console.log(startDate);
    
        let endDate = d.endDate;
        endDate = new Date(endDate).getTime();
        console.log(startDate,endDate)
        Client.findClientByDates(startDate,endDate)
        .then(saloons=>{
            // console.log(saloons.length)
            allData.push({month:d.month.toString(),clients:saloons.length})
            // console.log(allData)
            if(dates.length == allData.length)
            {   
                allData.sort((a, b) => {
                    return a.key - b.key;
                });
                res.json({message:"All Data returned",allClients:allData})
            }

        })
        .catch(err=>console.log(err));
    })
   
}



exports.clientCheckEmail=(req,res,next)=>{
    const email = req.body.email;

    Client.findClientByEmail(email)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'User does not exist',status:false});
                    }                                       
                    res.json({ message:'User Exists',status:true, user:user});
                   
                })
}


exports.clientCheckPhone=(req,res,next)=>{
    const phone = +req.body.phone;

    Client.findClientByPhone(phone)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'User does not exist',status:false});
                    }                                       
                    res.json({ message:'User Exists',status:true, user:user});
                   
                })
}


exports.clientFavSaloon=(req,res,next)=>{
    const clientId = +req.body.clientId;
    const saloonId = +req.body.saloonId;
   
    Client.findClientByClientId(clientId)
             .then(clientDoc=>{
                 if(!clientDoc)
                 {
                     return res.json({ message:'Client does not exist',status:false});
                 }
                
                 let index = clientDoc.favourites.indexOf(saloonId)
                 
                 if(index!=-1)
                 {
                    clientDoc.favourites.splice(index,1)
                    const db = getDb();
                    db.collection('clients').updateOne({clientId:clientId},{$set:clientDoc})
                                .then(resultData=>{
                                    
                                    res.json({message:'Removed from favourites',status:true,client:clientDoc});
                                })
                                .catch(err=>console.log(err));
                   
                 }
                 else{
                    clientDoc.favourites.push(saloonId);
                 
                    const db = getDb();
                    db.collection('clients').updateOne({clientId:clientId},{$set:clientDoc})
                                .then(resultData=>{
                                    
                                    res.json({message:'Add to favourites',status:true,client:clientDoc});
                                })
                                .catch(err=>console.log(err));
                 }

            
             })
}



exports.getFavSaloons=(req,res,next)=>{
    
    const clientId = +req.params.clientId;
   
    Client.findClientByClientId(JSON.parse(clientId))
                .then(appoint=>{
                    if(!appoint)
                    {
                        return res.json({status:false, message:'Client does not exist'});
                    }

                    let saloonDataArr = [];
                    if( appoint.favourites.length>0)
                    {
                    appoint.favourites.forEach(fav=>{
                        Saloon.findSaloonBySaloonID(+fav)
                        .then(saloonData=>{
                            saloonDataArr.push(saloonData)
                            // console.log(saloonDataArr)
                            if(saloonDataArr.length==appoint.favourites.length)
                            {
                                res.json({status:true, message:'Client exists',favourites:appoint.favourites,favSaloons:saloonDataArr});
                            }
                        })                      

                    })
                }else{
                    res.json({status:true, message:'Client exists',favourites:[],favSaloons:[]});
                }
                    

                })

}



exports.editClientDetails=(req,res,next)=>{
    //parsing data from incoming request
    const clientId = +req.body.clientId;
    const clientName = req.body.clientName;
    const email = req.body.email;
    const phone = req.body.phone;  
   
    Client.findClientByClientId(clientId)
             .then(clientDoc=>{
                 if(!clientDoc)
                 {
                     return res.json({ message:'Client does not exist',status:false});
                 }
                
                 clientDoc.clientName = clientName;
                 clientDoc.email = email;
                 clientDoc.phone = phone;
                 
                 const db = getDb();
                 db.collection('clients').updateOne({clientId:clientId},{$set:clientDoc})
                             .then(resultData=>{
                                 
                                 res.json({message:'Details Updated',status:true});
                             })
                             .catch(err=>console.log(err));
             })
}





exports.editClientEmail=(req,res,next)=>{
    //parsing data from incoming request
    const clientId = +req.body.clientId;
    const email = req.body.email;
   
    Client.findClientByClientId(JSON.parse(+clientId))
             .then(clientDoc=>{
                 if(!clientDoc)
                 {
                     return res.json({ message:'Client does not exist',status:false});
                 }              

                //  Client.findClientByEmail(email)
                //  .then(client=>{
                //      if(client)
                //      {
                //          return res.json({ message:'Email already exists',status:false});
                //      }
                     
                     clientDoc.email = email;
                 
                     const db = getDb();
                     db.collection('clients').updateOne({clientId:clientId},{$set:clientDoc})
                                 .then(resultData=>{
                                     
                                     res.json({message:'Details Updated',status:true,client:clientDoc});
                                 })
                                 .catch(err=>console.log(err));
                    // })                
             })
}



exports.editClientPhone=(req,res,next)=>{
    //parsing data from incoming request
    const clientId = +req.body.clientId;
    const phone = +req.body.phone;
   
    Client.findClientByClientId(JSON.parse(+clientId))
             .then(clientDoc=>{
                 if(!clientDoc)
                 {
                     return res.json({ message:'Client does not exist',status:false});
                 }              

                //  Client.findClientByEmail(email)
                //  .then(client=>{
                //      if(client)
                //      {
                //          return res.json({ message:'Email already exists',status:false});
                //      }
                     
                     clientDoc.phone = phone;
                 
                     const db = getDb();
                     db.collection('clients').updateOne({clientId:clientId},{$set:clientDoc})
                                 .then(resultData=>{
                                     
                                     res.json({message:'Details Updated',status:true,client:clientDoc});
                                 })
                                 .catch(err=>console.log(err));
                    // })                
             })
}


exports.editClientToken=(req,res,next)=>{
    //parsing data from incoming request
    const clientId = +req.body.clientId;
    const deviceToken = req.body.deviceToken;
   
    Client.findClientByClientId(JSON.parse(+clientId))
             .then(clientDoc=>{
                 if(!clientDoc)
                 {
                     return res.json({ message:'Client does not exist',status:false});
                 }              

                     clientDoc.deviceToken = deviceToken;
                 
                     const db = getDb();
                     db.collection('clients').updateOne({clientId:clientId},{$set:clientDoc})
                                 .then(resultData=>{
                                     
                                     res.json({message:'Details Updated',status:true,client:clientDoc});
                                 })
                                 .catch(err=>console.log(err));
                               
             })
}



exports.editClientName=(req,res,next)=>{
    //parsing data from incoming request
    const clientId = +req.body.clientId;
    const clientName = req.body.clientName;
   
    Client.findClientByClientId(JSON.parse(+clientId))
             .then(clientDoc=>{
                 if(!clientDoc)
                 {
                     return res.json({ message:'Client does not exist',status:false});
                 }              

                //  Client.findClientByEmail(email)
                //  .then(client=>{
                //      if(client)
                //      {
                //          return res.json({ message:'Email already exists',status:false});
                //      }
                     
                     clientDoc.clientName = clientName;
                 
                     const db = getDb();
                     db.collection('clients').updateOne({clientId:clientId},{$set:clientDoc})
                                 .then(resultData=>{
                                     
                                     res.json({message:'Details Updated',status:true,client:clientDoc});
                                 })
                                 .catch(err=>console.log(err));
                    // })                
             })
}



exports.studentResetPwd=(req,res,next)=>{
    const phone = +req.body.phone;
    const newPassword = req.body.newPassword;

    Student.findStudentByPhone(+phone)
                .then(user=>{
                    if(!user)
                    {
                        return res.json({ message:'Student does not exist',status:false});
                    }

                    user.password = newPassword;
                   
                    const db = getDb();
                    db.collection('students').updateOne({phone:phone},{$set:user})
                                .then(resultData=>{
                                    
                                    res.json({ message:'Password successfully changed',status:true,student:user});
                                })
                                .catch(err=>console.log(err));
                })
}



exports.delClient=(req,res,next)=>{

    const clientId = +req.params.clientId;

    Client.findClientByClientId(JSON.parse(clientId))
                    .then(client=>{
                        if(!client)
                        {
                            return res.json({ message:'Client does not exist',status:false});
                        }

                        const db = getDb();
                        db.collection('clients').deleteOne({clientId:clientId})
                                    .then(resultData=>{
                                        
                                        res.json({message:'Client Deleted',status:true});
                                    })
                                    .catch(err=>console.log(err));
                    })
}
