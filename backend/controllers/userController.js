const User = require('../models/user');

// 获取所有用户列表（仅超级管理员）
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'role', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });
    res.json(users.filter(u => ['superadmin', 'admin', 'user'].includes(u.role)));
  } catch (error) {
    console.error('获取用户列表失败:', error);
    res.status(500).json({ message: '获取用户列表失败' });
  }
};

// 删除用户（仅超级管理员）
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    if (user.role === 'superadmin') {
      return res.status(403).json({ message: '不能删除超级管理员' });
    }
    await user.destroy();
    res.json({ message: '删除用户成功' });
  } catch (error) {
    console.error('删除用户失败:', error);
    res.status(500).json({ message: '删除用户失败' });
  }
};

// 更新用户角色（仅超级管理员）
exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    if (user.role === 'superadmin') {
      return res.status(403).json({ message: '不能修改超级管理员的角色' });
    }
    const validRoles = ['user', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: '无效的角色' });
    }
    user.role = role;
    await user.save();
    res.json({ message: '更新用户角色成功', user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    console.error('更新用户角色失败:', error);
    res.status(500).json({ message: '更新用户角色失败' });
  }
}; 