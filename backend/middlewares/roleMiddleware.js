const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: '未登录' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: '无权限访问' });
    }

    next();
  };
};

module.exports = {
  isSuperAdmin: checkRole(['superadmin']),
  isAdminOrAbove: checkRole(['superadmin', 'admin']),
  isWorkerOrAbove: checkRole(['superadmin', 'admin', 'worker', 'user']) // 允许user访问
}; 