const express = require('express');
const router = express.Router();
const logsController = require('../controllers/logsController');
const authMiddleware = require('../middlewares/authMiddleware');
const { isSuperAdmin } = require('../middlewares/roleMiddleware');

// 获取日志（仅超级管理员）
router.get('/', authMiddleware, isSuperAdmin, logsController.getLogs);
// 删除日志（仅超级管理员）
router.delete('/:id', authMiddleware, isSuperAdmin, logsController.deleteLog);

module.exports = router; 