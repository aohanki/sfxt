const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser, updateUserRole } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

// 超级管理员权限检查中间件
const requireSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({ message: '需要超级管理员权限' });
  }
};

// 所有用户管理路由都需要超级管理员权限
router.use(authenticateToken);
router.use(requireSuperAdmin);

// 获取所有用户列表
router.get('/', getAllUsers);

// 删除用户
router.delete('/:id', deleteUser);

// 更新用户角色
router.put('/:id/role', updateUserRole);

module.exports = router; 