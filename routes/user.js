const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const jwt = require('jsonwebtoken');
var myTokenFile = require('../services/verifyTokenFile');
var verifyToken = myTokenFile.verifyToken;

router.post('/user-login',userController.signInUser);

router.post('/user-register',userController.signUpUser);

router.post('/edit-user-details',verifyToken,userController.editUserDetails);

router.post('/forgot-user-password',verifyToken,userController.forgotUserPassword);

module.exports = router;

