const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');



router.get('/all-admins',adminController.allAdminData);

router.post('/admin-login',adminController.adminLogin);

router.post('/admin-register',adminController.adminRegister);


router.post('/admin-forgotPwd',adminController.adminForgotPwd);

router.post('/send-email',adminController.sendEmail);


module.exports = router;

