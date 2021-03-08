const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const jwt = require('jsonwebtoken');
var myTokenFile = require('../services/verifyTokenFile');
var verifyToken = myTokenFile.verifyToken;


router.post('/create-product',productController.createProduct);

router.get('/get-all-products',verifyToken,productController.getAllProducts);

router.get('/get-all-products/:prodCode',verifyToken,productController.getSingleProducts);


module.exports = router;

