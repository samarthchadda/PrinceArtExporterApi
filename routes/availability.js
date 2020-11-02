const express = require('express');
const router = express.Router();
const availController = require('../controllers/availability');



router.get('/all-emp-availabilities',availController.getAllEmpAvailData);

router.get('/all-saloon-availabilities',availController.getAllSaloonAvailData);


router.get('/all-emp-availabilities/:empId',availController.getSingleEmpAvailData);

router.get('/all-saloon-availabilities/:saloonId',availController.getSingleSaloonAvailData);


router.post('/date-availability',availController.getSingleAvailDataByDate);


router.post('/post-emp-availability',availController.availEmpRegister);

router.post('/post-saloon-availability',availController.availSaloonRegister);


router.post('/edit-emp-availability',availController.availEmpEdit);

router.post('/edit-saloon-availability',availController.availSaloonEdit);


router.post('/edit-emp-avail-status',availController.editEmpAvailStatus);

router.post('/edit-saloon-avail-status',availController.editSaloonAvailStatus);


router.post('/edit-avail-timeslot',availController.editAvailTimeslot);




module.exports = router;

