const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/owner');
const Owner = require('../models/owner');
const getDb = require('../util/database').getDB; 
const multer = require('multer');
const upload = multer();

var ImageKit = require("imagekit");
var fs = require('fs');


router.post('/owner-login',ownerController.ownerLogin);


router.post('/owner-register',ownerController.ownerRegister);


module.exports = router;

