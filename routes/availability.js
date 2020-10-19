const express = require('express');
const router = express.Router();
const availController = require('../controllers/availability');



router.get('/all-availabilities',availController.getAllAvailData);

router.get('/all-availabilities/:empId',availController.getSingleAvailData);

router.post('/date-availability',availController.getSingleAvailDataByDate);


router.post('/post-availability',availController.availRegister);

router.post('/edit-avail-status',availController.editAvailStatus);

router.post('/edit-avail-timeslot',availController.editAvailTimeslot);




module.exports = router;

