const express = require('express');
const router = express.Router();
const appointController = require('../controllers/appointment');


router.get('/all-appointments',appointController.getAllAppointments);

router.get('/all-appointments/:id',appointController.getSingleAppointment);

router.post('/post-appointment',appointController.postAppointment);

router.post('/saloon-appointment',appointController.getAppointBySaloonAndBdate);

router.post('/check-appointment',appointController.getAppointByEmpIdDate);


router.post('/appoint-revenue-day',appointController.getDayRevenuePerSaloon);

router.post('/appoint-revenue-week',appointController.getWeekRevenuePerSaloon);



module.exports = router;

