const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // "Bearer TOKEN"
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = { id: decodedToken.id, role: decodedToken.role };
    next();
  } catch (error) {
    res.status(401).json({ message: '认证失败!' });
  }
}; 