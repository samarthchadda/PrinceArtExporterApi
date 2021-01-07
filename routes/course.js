const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course');

const multer = require('multer');
const getDb = require('../util/database').getDB; 
const upload = multer();

var ImageKit = require("imagekit");
var fs = require('fs');


router.post('/course-register',courseController.courseRegister);

router.post('/all-courses',courseController.getAllCourses);

router.post('/all-courses/:courseId',courseController.getSingleCourse);

router.post('/tutor-courses/:tutorId',courseController.getTutorCourses);


module.exports = router;

