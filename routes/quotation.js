const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotation');

var myTokenFile = require('../services/verifyTokenFile');
var verifyToken = myTokenFile.verifyToken;

router.post('/create-quotation',verifyToken,quotationController.createQuotation);

router.post('/user-quotations',verifyToken,quotationController.getUserQuotations);


module.exports = router;

