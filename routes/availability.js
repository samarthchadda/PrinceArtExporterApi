const express = require('express');
const router = express.Router();
const availController = require('../controllers/availability');



router.get('/all-tutor-availabilities',availController.getAllTutorAvailData);

router.get('/all-tutor-availabilities/:tutorId',availController.getSingleTutorAvailData);

router.post('/tutor-date-availability',availController.getSingleTutorAvailDataByDate);

router.post('/post-tutor-availability',availController.availTutorRegister);


router.get('/all-saloon-availabilities',availController.getAllSaloonAvailData);

router.get('/all-emp-availabilities/:empId',availController.getSingleEmpAvailData);


router.post('/emp-onedate-avail',availController.getSingleEmpAvailDataBySingleDate);

router.post('/saloon-date-availability',availController.getSingleSaloonAvailDataByDate);




router.post('/post-saloon-availability',availController.availSaloonRegister);

router.post('/edit-emp-availability',availController.availEmpEdit);

router.post('/edit-saloon-availability',availController.availSaloonEdit);


router.post('/edit-emp-avail-status',availController.editEmpAvailStatus);

router.post('/edit-saloon-avail-status',availController.editSaloonAvailStatus);


router.post('/edit-emp-avail-timeslot',availController.editEmpAvailTimeslot);

router.post('/edit-saloon-avail-timeslot',availController.editSaloonAvailTimeslot);




module.exports = router;

