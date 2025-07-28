const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/in', authMiddleware, inventoryController.inStock);
router.post('/out', authMiddleware, inventoryController.outStock);
router.get('/records', authMiddleware, inventoryController.getRecords);

module.exports = router; 