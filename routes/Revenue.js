const express = require('express');
const router = express.Router();
const revenueController = require('../controllers/Revenue');


router.post('/post-course-payment',revenueController.postCoursePayment);

router.post('/post-appoint-payment',revenueController.postAppointPayment);

router.get('/get-course-payment',revenueController.getAllCourseRevenue);

router.get('/get-appoint-payment',revenueController.getAllAppointRevenue);



module.exports = router;


