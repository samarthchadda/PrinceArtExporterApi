const express = require('express');
const router = express.Router();
const appointController = require('../controllers/quotation');


router.get('/all-session-bookings',appointController.getAllAppointments);

router.get('/all-appointments-month',appointController.getAllAppointmentsMonth);


router.get('/all-session-bookings/:id',appointController.getSingleAppointment);

router.get('/tutor-session-bookings/:id',appointController.getTutorAppointments);

router.get('/student-session-bookings/:id',appointController.getStudentAppointments);

router.post('/post-session',appointController.postAppointment);

router.post('/edit-sessionBooking-status',appointController.editSessionAppointment);

router.post('/saloon-appointment',appointController.getAppointBySaloonAndBdate);

router.post('/check-appointment',appointController.getAppointByEmpIdDate);

router.get('/tutor-bookings-current/:id',appointController.getTutorCurrentAppointments);

router.post('/appoint-revenue-day',appointController.getDayRevenuePerSaloon);

router.post('/appoint-revenue-week',appointController.getWeekRevenuePerSaloon);

router.post('/appoint-revenue-month',appointController.getMonthRevenuePerSaloon);

router.post('/appoint-graph-day',appointController.getDayGraphPerSaloon);

router.post('/appoint-graph-month',appointController.getMonthGraphPerSaloon);


router.post('/emp-appoint-revenue-day',appointController.getDayRevenuePerEmp);

router.post('/emp-appoint-revenue-week',appointController.getWeekRevenuePerEmp);

router.post('/emp-appoint-revenue-month',appointController.getMonthRevenuePerEmp);

router.post('/emp-appoint-graph-day',appointController.getDayGraphPerEmp);

router.get('/emp-appoint-graph-week',appointController.getWeekGraphPerEmp);

router.post('/emp-appoint-graph-month',appointController.getMonthGraphPerEmp);


router.post('/edit-appointment',appointController.editAppointment);

router.get('/del-appointment/:appointId',appointController.delAppointment);

router.get('/current-appoint/:phone',appointController.currentAppoints);

router.get('/previous-appoint/:phone',appointController.previousAppoints);


module.exports = router;
