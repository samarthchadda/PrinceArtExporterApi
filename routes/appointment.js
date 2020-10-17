const express = require('express');
const router = express.Router();
const appointController = require('../controllers/appointment');
const multer = require('multer');
const upload = multer();


router.get('/all-appointments',appointController.getAllAppointment);

router.get('/all-appointments/:id',appointController.getSingleAppointment);

router.post('/parent-appointment',appointController.getAppointByParent);

router.post('/faculty-appointment',appointController.getAppointByFaculty);

router.post('/edit-appointment',appointController.editAppointment);

router.post('/edit-appoint-status',appointController.editStatus);


router.post('/post-appointment',upload.single('appointment'),appointController.postAppointment);

router.post('/facDate-appointment',appointController.getAppointByFacDate);

router.post('/parentDate-appointment',appointController.getAppointByParDate);



module.exports = router;

