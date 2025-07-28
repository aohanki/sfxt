const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const authMiddleware = require('../middlewares/authMiddleware');
const { isWorkerOrAbove } = require('../middlewares/roleMiddleware');

// 获取统计数据（管理员及以上）
router.get('/stats', authMiddleware, isWorkerOrAbove, reportsController.getStats);

module.exports = router; 