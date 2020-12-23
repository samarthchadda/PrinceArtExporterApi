const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');


router.post('/admin-login',adminController.adminLogin);

router.post('/admin-register',adminController.adminRegister);



module.exports = router;

