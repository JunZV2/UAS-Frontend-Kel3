const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/sales/custom', reportController.getCustomSalesReport);

module.exports = router;