const Appointment = require('../models/appointment');
const getDb = require('../util/database').getDB; 


exports.postAppointment = (req,res,next)=>{
  

    let appointId;
    const saloonId = +req.body.saloonId ;
    const empId = +req.body.empId;   
    const serviceId = req.body.serviceId;
    const serviceName = req.body.serviceName;
    const clientName = req.body.clientName;
    const clientPhone = req.body.clientPhone;
    const empName = req.body.empName;
    const bookingTime = req.body.bookingTime;
    let bookingDate = req.body.bookingDate;
    bookingDate = new Date(bookingDate).getTime();
    console.log(bookingDate);
    const bookingDay = req.body.bookingDay;
    const totalCost = +req.body.totalCost;
    const note = req.body.note;

        let newVal;
        const db = getDb();     
        db.collection('appCounter').find().toArray().then(data=>{
            
            newVal = data[data.length-1].count;
           
            newVal = newVal + 1;
           
            appointId = newVal;
            
            db.collection('appCounter').insertOne({count:newVal})
                    .then(result=>{

                        
                        const appointment = new Appointment(appointId,saloonId,empId,serviceId,serviceName,clientName,clientPhone,empName,bookingTime,bookingDate,bookingDay,totalCost,note);
                       
                        //saving in database                    
                        appointment.save()
                        .then(resultData=>{
                            
                            return res.json({status:true,message:"Appointment Created ",data:resultData["ops"][0]});
                            
                        })
                        .catch(err=>console.log(err));
                    })
                    .then(resultData=>{
                       
                    })
                    .catch(err=>{
                        res.json({status:false,message:"Appointment Creation Failed ",error:err})
                    })                 
            
        })   
    
}


exports.getAllAppointments=(req,res,next)=>{
    
    Appointment.fetchAllAppointments()
                .then(appointments=>{
                   
                    res.json({message:"All Data returned",allAppointments:appointments})

                })
                .catch(err=>console.log(err));

}


exports.getSingleAppointment=(req,res,next)=>{
    
    const id = +req.params.id;
   
    Appointment.findAppointByID(JSON.parse(id))
                .then(appoint=>{
                    if(!appoint)
                    {
                        return res.json({status:false, message:'Appointment does not exist',data:null});
                    }

                    res.json({status:true, message:'Appointment exists',data:appoint});
                })

}


exports.getAppointByEmpIdDate=(req,res,next)=>{
    
    const empId = +req.body.empId;
    
    let bookingDate = req.body.bookingDate;
    bookingDate = new Date(bookingDate).getTime();
    console.log(bookingDate);
  
   
    Appointment.findAppointByEmpIdAndDate(empId,bookingDate)
                .then(appoint=>{
                    if(appoint.length==0)
                    {
                        return res.json({ message:'Appointment not exist',data:appoint});
                    }

                    let timeSlot = [];
                    appoint.forEach(element => {
                        timeSlot.push(element.bookingTime);
                    });

                    console.log(timeSlot);

                    res.json({ message:'Appointment Exists',data:timeSlot});
                })

}



exports.getAppointBySaloonAndBdate=(req,res,next)=>{
    
    const saloonId = +req.body.saloonId;
    
    let bookingDate = req.body.bookingDate;
    bookingDate = new Date(bookingDate).getTime();
    console.log(bookingDate);
  
   
    Appointment.findAppointBySaloonIdAndDate(saloonId,bookingDate)
                .then(appoint=>{
                    if(appoint.length==0)
                    {
                        return res.json({ message:'Appointment not exist',data:appoint});
                    }               

                    res.json({ message:'Appointment Exists',data:appoint});

                })

}



exports.getDayRevenuePerSaloon=(req,res,next)=>{
    
    const saloonId = +req.body.saloonId;
    
    let bookingDate = req.body.bookingDate;
    bookingDate = new Date(bookingDate).getTime();
    console.log(bookingDate);
     
    Appointment.findAppointBySaloonIdAndDate(saloonId,bookingDate)
                .then(appoints=>{
                    var revenueObj = {totalApp:0,totalAmt:0,totalServices:0};     
                    if(appoints.length==0)
                    {
                        return res.json({ message:'Appointment not exist',revenue:revenueObj});
                    }                                          

                    appoints.forEach(app=>{
                        revenueObj.totalApp = revenueObj.totalApp + 1;
                        revenueObj.totalAmt = revenueObj.totalAmt + app.totalCost;
                        revenueObj.totalServices = revenueObj.totalServices + app.serviceId.length;
                    })

                    res.json({ message:'Appointment Exists',revenue:revenueObj});

                })
}



exports.getWeekRevenuePerSaloon=(req,res,next)=>{
    
    const saloonId = +req.body.saloonId;
    
    let startDate = req.body.startDate;
    startDate = new Date(startDate).getTime();
    console.log(startDate);

    let endDate = req.body.endDate;
    endDate = new Date(endDate).getTime();
    console.log(endDate);   
    
    Appointment.saloonWeekRevenue(saloonId,startDate,endDate)
                .then(appoints=>{
                    var revenueObj = {totalApp:0,totalAmt:0,totalServices:0};   

                    if(appoints.length==0)
                    {
                        return res.json({ message:'Appointment not exist',revenue:revenueObj});
                    }               
                                

                    appoints.forEach(app=>{
                        revenueObj.totalApp = revenueObj.totalApp + 1;
                        revenueObj.totalAmt = revenueObj.totalAmt + app.totalCost;
                        revenueObj.totalServices = revenueObj.totalServices + app.serviceId.length;
                    })

                    res.json({ message:'Appointment Exists',revenue:revenueObj});

                })
}



exports.getMonthRevenuePerSaloon=(req,res,next)=>{
    
    const saloonId = +req.body.saloonId;
    
    let startDate = req.body.startDate;
    startDate = new Date(startDate).getTime();
    console.log(startDate);

    let endDate = req.body.endDate;
    endDate = new Date(endDate).getTime();
    console.log(endDate);   
    
    Appointment.saloonWeekRevenue(saloonId,startDate,endDate)
                .then(appoints=>{
                    var revenueObj = {totalApp:0,totalAmt:0,totalServices:0,avgRevenue:0,avgAppointments:0};   

                    if(appoints.length==0)
                    {
                        return res.json({ message:'Appointment not exist',revenue:revenueObj});
                    }                                               

                    appoints.forEach(app=>{
                        revenueObj.totalApp = revenueObj.totalApp + 1;
                        revenueObj.totalAmt = revenueObj.totalAmt + app.totalCost;
                        revenueObj.totalServices = revenueObj.totalServices + app.serviceId.length;
                    })

                    revenueObj.avgRevenue = revenueObj.totalAmt / revenueObj.totalApp;
                    revenueObj.avgAppointments = revenueObj.totalServices / revenueObj.totalApp;
                    
                    res.json({ message:'Appointment Exists',revenue:revenueObj});
                })
}



exports.getDayRevenuePerEmp=(req,res,next)=>{
    
    const empId = +req.body.empId;
    
    let bookingDate = req.body.bookingDate;
    bookingDate = new Date(bookingDate).getTime();
    console.log(bookingDate);
     
    Appointment.findAppointByEmpIdAndDate(empId,bookingDate)
                .then(appoints=>{
                    var revenueObj = {totalApp:0,totalAmt:0,totalServices:0};  

                    if(appoints.length==0)
                    {
                        return res.json({ message:'Appointment not exist',revenue:revenueObj});
                    }               
                                   

                    appoints.forEach(app=>{
                        revenueObj.totalApp = revenueObj.totalApp + 1;
                        revenueObj.totalAmt = revenueObj.totalAmt + app.totalCost;
                        revenueObj.totalServices = revenueObj.totalServices + app.serviceId.length;
                    })

                    res.json({ message:'Appointment Exists',revenue:revenueObj});

                })
}



exports.getWeekRevenuePerEmp=(req,res,next)=>{
    
    const empId = +req.body.empId;
    
    let startDate = req.body.startDate;
    startDate = new Date(startDate).getTime();
    console.log(startDate);

    let endDate = req.body.endDate;
    endDate = new Date(endDate).getTime();
    console.log(endDate);   
    
    Appointment.empWeekRevenue(empId,startDate,endDate)
                .then(appoints=>{
                    var revenueObj = {totalApp:0,totalAmt:0,totalServices:0};    

                    if(appoints.length==0)
                    {
                        return res.json({ message:'Appointment not exist',revenue:revenueObj});
                    }                                               

                    appoints.forEach(app=>{
                        revenueObj.totalApp = revenueObj.totalApp + 1;
                        revenueObj.totalAmt = revenueObj.totalAmt + app.totalCost;
                        revenueObj.totalServices = revenueObj.totalServices + app.serviceId.length;
                    })

                    res.json({ message:'Appointment Exists',revenue:revenueObj});

                })
}

exports.getMonthRevenuePerEmp=(req,res,next)=>{
    
    const empId = +req.body.empId;
    
    let startDate = req.body.startDate;
    startDate = new Date(startDate).getTime();
    console.log(startDate);

    let endDate = req.body.endDate;
    endDate = new Date(endDate).getTime();
    console.log(endDate);   
    
    Appointment.empWeekRevenue(empId,startDate,endDate)
                .then(appoints=>{
                    var revenueObj = {totalApp:0,totalAmt:0,totalServices:0,avgRevenue:0,avgAppointments:0};                 

                    if(appoints.length==0)
                    {
                        return res.json({ message:'Appointment not exist',revenue:revenueObj});
                    }               
                    
                    appoints.forEach(app=>{
                        revenueObj.totalApp = revenueObj.totalApp + 1;
                        revenueObj.totalAmt = revenueObj.totalAmt + app.totalCost;
                        revenueObj.totalServices = revenueObj.totalServices + app.serviceId.length;
                    })

                    revenueObj.avgRevenue = revenueObj.totalAmt / revenueObj.totalApp;
                    revenueObj.avgAppointments = revenueObj.totalServices / revenueObj.totalApp;

                    res.json({ message:'Appointment Exists',revenue:revenueObj});

                })
}



exports.editAppointment=(req,res,next)=>{
    //parsing data from incoming request
    const appointId = +req.body.appointId;
    const bookingTime = req.body.bookingTime;
    const bookingDay = req.body.bookingDay;
        
    let bookingDate = req.body.bookingDate;
    bookingDate = new Date(bookingDate).getTime();
    console.log(bookingDate);  
   
    Appointment.findAppointByID(JSON.parse(appointId))
             .then(appDoc=>{
                 if(!appDoc)
                 {
                     return res.json({ message:'Appointment does not exist',status:false});
                 }
                
                 appDoc.bookingTime = bookingTime;
                 appDoc.bookingDay = bookingDay;
                 appDoc.bookingDate = bookingDate;
                 
                 const db = getDb();
                 db.collection('appointments').updateOne({appointmentId:appointId},{$set:appDoc})
                             .then(resultData=>{
                                 
                                 res.json({message:'Details Updated',status:true});
                             })
                             .catch(err=>console.log(err));
             })
}


exports.delAppointment=(req,res,next)=>{

    const appointId = +req.params.appointId;

    Appointment.findAppointByID(JSON.parse(appointId))
                    .then(appoint=>{
                        if(!appoint)
                        {
                            return res.json({ message:'Appointment does not exist',status:false});
                        }

                        const db = getDb();
                        db.collection('appointments').deleteOne({appointmentId:appointId})
                                    .then(resultData=>{
                                        
                                        res.json({message:'Appointment Deleted',status:true});
                                    })
                                    .catch(err=>console.log(err));
                    })
}



exports.getMonthGraphPerSaloon=(req,res,next)=>{
    
    const saloonId = +req.body.saloonId;
    const dates = req.body.dates;
    // console.log(dates);
   
    var revenues = [];
    dates.forEach(d=>{
        // console.log(dates.length)
        let startDate = d.srtDate;
        startDate = new Date(startDate).getTime();
        // console.log(d.srtDate);
    
        let endDate = d.endDate;
        endDate = new Date(endDate).getTime();
        // console.log(d.endDate);  

        Appointment.saloonWeekRevenue(saloonId,startDate,endDate)
        .then(appoints=>{         
            var revenueObj = {totalApp:0,totalAmt:0,totalServices:0,avgRevenue:0,avgAppointments:0,srtDate:d.srtDate,endDate:d.endDate};
            console.log(appoints.length);
            if(appoints.length==0)
            {               
                revenues.push(revenueObj);
                // return res.json({ message:'Appointment not exist',revenue:revenues});
            } 
            else{              
            appoints.forEach(app=>{
                revenueObj.totalApp = revenueObj.totalApp + 1;
                revenueObj.totalAmt = revenueObj.totalAmt + app.totalCost;
                revenueObj.totalServices = revenueObj.totalServices + app.serviceId.length;
            })
    
            revenueObj.avgRevenue = revenueObj.totalAmt / revenueObj.totalApp;
            revenueObj.avgAppointments = revenueObj.totalServices / revenueObj.totalApp;
    
            revenues.push(revenueObj);
            // console.log("Revenue :",revenues.length);           
        }
           
        if(dates.length == revenues.length)
        {            
            res.json({ message:'All data returned',revenues:revenues});
            revenues = [];
        }
        
        })        
    }) 
   
}


exports.getMonthGraphPerEmp=(req,res,next)=>{
    
    const empId = +req.body.empId;
    const dates = req.body.dates;
    // console.log(dates);
   
    var revenues = [];
    dates.forEach(d=>{
        // console.log(dates.length)
        let startDate = d.srtDate;
        startDate = new Date(startDate).getTime();
        // console.log(d.srtDate);
    
        let endDate = d.endDate;
        endDate = new Date(endDate).getTime();
        // console.log(d.endDate);  

        Appointment.empWeekRevenue(empId,startDate,endDate)
        .then(appoints=>{         
            var revenueObj = {totalApp:0,totalAmt:0,totalServices:0,avgRevenue:0,avgAppointments:0,srtDate:d.srtDate,endDate:d.endDate};
            console.log(appoints.length);
            if(appoints.length==0)
            {               
                revenues.push(revenueObj);               
            } 
            else{              
            appoints.forEach(app=>{
                revenueObj.totalApp = revenueObj.totalApp + 1;
                revenueObj.totalAmt = revenueObj.totalAmt + app.totalCost;
                revenueObj.totalServices = revenueObj.totalServices + app.serviceId.length;
            })
    
            revenueObj.avgRevenue = revenueObj.totalAmt / revenueObj.totalApp;
            revenueObj.avgAppointments = revenueObj.totalServices / revenueObj.totalApp;
    
            revenues.push(revenueObj);           
        }
           
        if(dates.length == revenues.length)
        {            
            res.json({ message:'All data returned',revenues:revenues});
            revenues = [];
        }

        })        
    })    
}



exports.getDayGraphPerSaloon=(req,res,next)=>{
    
    const saloonId = +req.body.saloonId;
    const dates = req.body.dates;
    // console.log(dates);
   
    var revenues = [];
    dates.forEach(date=>{
        // console.log(dates.length)
    let bookingDate = date;
    bookingDate = new Date(bookingDate).getTime();
    // console.log(bookingDate);
     
    Appointment.findAppointBySaloonIdAndDate(saloonId,bookingDate)
        .then(appoints=>{         
            var revenueObj = {totalApp:0,totalAmt:0,totalServices:0,bookingDate:date};
            console.log(appoints.length);
            if(appoints.length==0)
            {               
                revenues.push(revenueObj);               
            } 
            else{              
            appoints.forEach(app=>{
                revenueObj.totalApp = revenueObj.totalApp + 1;
                revenueObj.totalAmt = revenueObj.totalAmt + app.totalCost;
                revenueObj.totalServices = revenueObj.totalServices + app.serviceId.length;
            })
    
            revenues.push(revenueObj);           
        }
           
        if(dates.length == revenues.length)
        {            
            res.json({ message:'All data returned',revenues:revenues});
            revenues = [];
        }

        })        
    }) 
   
}



exports.getDayGraphPerEmp=(req,res,next)=>{
    
    const empId = +req.body.empId;
    const dates = req.body.dates;
    // console.log(dates);
   
    var revenues = [];
    dates.forEach(date=>{
        // console.log(dates.length)
    let bookingDate = date;
    bookingDate = new Date(bookingDate).getTime();
    // console.log(bookingDate);
     
    Appointment.findAppointByEmpIdAndDate(empId,bookingDate)
        .then(appoints=>{         
            var revenueObj = {totalApp:0,totalAmt:0,totalServices:0,bookingDate:date};
            console.log(appoints.length);
            if(appoints.length==0)
            {               
                revenues.push(revenueObj);               
            } 
            else{              
            appoints.forEach(app=>{
                revenueObj.totalApp = revenueObj.totalApp + 1;
                revenueObj.totalAmt = revenueObj.totalAmt + app.totalCost;
                revenueObj.totalServices = revenueObj.totalServices + app.serviceId.length;
            })
    
            revenues.push(revenueObj);           
        }
           
        if(dates.length == revenues.length)
        {            
            res.json({ message:'All data returned',revenues:revenues});
            revenues = [];
        }

        })        
    }) 
   
}



exports.getWeekGraphPerEmp=(req,res,next)=>{
    let month = 11;
    let year = 2020;
    // const weeks = [];
    // const firstDay = new Date(year, month, 1);
    // console.log(firstDay.getDate());
    // const lastDay = new Date(year, month + 1, 0);
    // console.log(lastDay.getDate());
    // const daysInMonth = lastDay.getDate();
    // let dayOfWeek = firstDay.getDay();
    // // console.log(dayOfWeek);
    // let start;
    // let end;

    // for (let i = 1; i < daysInMonth + 1; i++) {

    //     if (dayOfWeek === 0 || i === 1) {
    //         start = i;
    //     }

    //     if (dayOfWeek === 6 || i === daysInMonth) {

    //         end = i;

    //         if (start !== end) {
    //             let acMonth = month+1;
    //             acMonth = acMonth<10?"0"+acMonth:acMonth; 
    //             weeks.push({
    //                 start: start<10?year.toString()+"-"+acMonth.toString()+"-0"+start.toString():year.toString()+"-"+acMonth.toString()+"-"+start.toString(),
    //                 end: end<10?year.toString()+"-"+acMonth.toString()+"-0"+end.toString():year.toString()+"-"+acMonth.toString()+"-"+end.toString()
    //             });
    //         }
    //     }

    //     dayOfWeek = new Date(year, month, i).getDay();
    //     console.log(dayOfWeek);
    // }     
    const daysName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weeks=[];      
    const  lastDate = new Date(year, month + 1, 0); 

    let start=0;
    let end; 

    for (let i = 1; i < lastDate.getDate()+1; i++) {         
    if (daysName[Number(new Date(year, month, i).getDay())] =="Sunday" || i == lastDate.getDate()) {
            end= i;
            let acMonth = month+1;
            acMonth = acMonth<10?"0"+acMonth:acMonth; 
            start = start+1;
            weeks.push({
                start: start<10?year.toString()+"-"+acMonth.toString()+"-0"+start.toString():year.toString()+"-"+acMonth.toString()+"-"+start.toString(),
                end: end<10?year.toString()+"-"+acMonth.toString()+"-0"+end.toString():year.toString()+"-"+acMonth.toString()+"-"+end.toString()
            });
            // weeks.push({
            //     start:start+1,
            //     end:end
            // }); 
            start = i;           
        }
    }  
       console.log(weeks);
       console.log(new Date('2020-2-01').getTime());
}


// let year = "2020";
// //let months = ["february","april","may","june","july","august"];
// let months = [1,9,10,2];

// let dates = [];
// months.forEach(month=>{

//     const firstDay = new Date(year, month, 1);
//     alert(firstDay.getDate());
//     const lastDay = new Date(year, month + 1, 0);
//     alert(lastDay.getDate());
//     month = month+1;
//     month = month<10?"0"+month:month;
//      dates.push({
//                     srtDate: firstDay.getDate()<10?year.toString()+"-"+month.toString()+"-0"+firstDay.getDate().toString():year.toString()+"-"+month.toString()+"-"+firstDay.getDate().toString(),
//                     endDate: lastDay.getDate()<10?year.toString()+"-"+month.toString()+"-0"+lastDay.getDate().toString():year.toString()+"-"+month.toString()+"-"+lastDay.getDate().toString()
//                 });
                

// //alert(d1.getDate());
// })
// // this will return the last date of the month
// alert(JSON.stringify(dates))
