const Log = require('../models/log');
const User = require('../models/user');

exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.findAll({
      include: [{ model: User, attributes: ['username'] }],
      order: [['created_at', 'DESC']],
      limit: 200 //限制最多返回200条
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: '获取日志失败', error });
  }
};

exports.deleteLog = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Log.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: '删除成功' });
    } else {
      res.status(404).json({ message: '日志不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '删除失败', error });
  }
}; 