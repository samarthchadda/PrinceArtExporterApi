const express = require('express');
const router = express.Router();
const courseAppointController = require('../controllers/courseAppointment');


router.get('/all-course-bookings',courseAppointController.getAllAppointments);

router.get('/all-course-bookings/:id',courseAppointController.getSingleAppointment);

router.get('/tutor-course-bookings/:id',courseAppointController.getTutorAppointments);

router.get('/student-course-bookings/:id',courseAppointController.getStudentAppointments);

router.post('/post-course-booking',courseAppointController.postAppointment);

router.post('/edit-courseBooking-status',courseAppointController.editSessionAppointment);

router.get('/appoint-analytics/:tutorId',courseAppointController.getAppointsGraph);


module.exports = router;

