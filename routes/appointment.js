const express = require('express');
const router = express.Router();
const appointController = require('../controllers/appointment');


router.get('/all-appointments',appointController.getAllAppointments);

router.get('/all-appointments/:id',appointController.getSingleAppointment);

router.post('/post-appointment',appointController.postAppointment);

router.post('/saloon-appointment',appointController.getAppointBySaloonAndBdate);

router.post('/check-appointment',appointController.getAppointByEmpIdDate);


module.exports = router;

