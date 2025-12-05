const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, customerController.getAllCustomers);

module.exports = router;
