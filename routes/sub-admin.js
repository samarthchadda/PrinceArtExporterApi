const express = require('express');
const router = express.Router();
const subAdminController = require('../controllers/sub-admin');



router.get('/all-sub-admins',subAdminController.allSubAdminData);


router.get('/all-sub-admins/:adminId',subAdminController.singleSubAdimData);


router.post('/post-sub-admin',subAdminController.subAdminRegister);


router.post('/delete-sub-admin',subAdminController.postDelSubAdmin);


router.post('/login-sub-admin',subAdminController.subAdminLogin);


// https://prajhaapp.herokuapp.com/api/edit-subAdmin
router.post('/edit-subAdmin',subAdminController.editSubAdminData);


const getDb = require('../util/database').getDB; 
router.get('/subadmin-counter',(req,res,next)=>{

    let newVal;
    const db = getDb();     
    db.collection('subAdminCounter').find().toArray().then(data=>{
        
        newVal = data[data.length-1].count;
       
        newVal = newVal + 1;
        console.log(newVal);
        res.json({status:true,counter:newVal});
       
        db.collection('subAdminCounter').insertOne({count:newVal})
        .then(result=>{

                
        })

    })

})



module.exports = router;

