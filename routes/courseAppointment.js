const express = require('express');
const router = express.Router();
const courseAppointController = require('../controllers/courseAppointment');


router.get('/all-session-bookings',courseAppointController.getAllAppointments);

router.get('/all-session-bookings/:id',courseAppointController.getSingleAppointment);

router.get('/tutor-session-bookings/:id',courseAppointController.getTutorAppointments);

router.get('/student-session-bookings/:id',courseAppointController.getStudentAppointments);

router.post('/post-course-booking',courseAppointController.postAppointment);

router.post('/edit-sessionBooking-status',courseAppointController.editSessionAppointment);




module.exports = router;

