const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client');


router.post('/client-login',clientController.ownerLogin);


router.post('/client-register',clientController.ownerRegister);


module.exports = router;

