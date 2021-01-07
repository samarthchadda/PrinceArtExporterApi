const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course');

const multer = require('multer');
const getDb = require('../util/database').getDB; 
const upload = multer();

var ImageKit = require("imagekit");
var fs = require('fs');


router.post('/tutor-signup',courseController.courseRegister);


module.exports = router;

