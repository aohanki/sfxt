const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const authMiddleware = require('../middlewares/authMiddleware');
const { isSuperAdmin } = require('../middlewares/roleMiddleware');

// 获取设置（仅管理员）
router.get('/', authMiddleware, isSuperAdmin, settingsController.getSettings);

// 更新设置（仅超级管理员）
router.post('/', authMiddleware, isSuperAdmin, settingsController.updateSettings);

module.exports = router; 