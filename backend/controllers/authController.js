const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user) return res.status(401).json({ message: '用户不存在' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: '密码错误' });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
  res.json({ token });
};

exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: '用户名和密码必填' });
  try {
    const exist = await User.findOne({ where: { username } });
    if (exist) return res.status(409).json({ message: '用户名已存在' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash, role: 'user' });
    res.status(201).json({ message: '注册成功', user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: '注册失败', error });
  }
}; 