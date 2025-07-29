const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/db');
require('./models/user');
require('./models/facility');
require('./models/inventoryRecord');
require('./models/log');
require('./models/setting');

const authRoutes = require('./routes/auth');
const facilitiesRoutes = require('./routes/facilities');
const inventoryRoutes = require('./routes/inventory');
const logsRoutes = require('./routes/logs');
const reportsRoutes = require('./routes/reports'); // 添加报表路由
const settingsRoutes = require('./routes/settings'); // 添加设置路由
const usersRoutes = require('./routes/users'); // 添加用户管理路由

const app = express();

// 生产环境配置
if (process.env.NODE_ENV === 'production') {
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://sfxt-fqmdse09g-aaaaas-projects-5c4b6a56.vercel.app',
    credentials: true
  }));
} else {
  app.use(cors());
}

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/facilities', facilitiesRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/reports', reportsRoutes); // 使用报表路由
app.use('/api/settings', settingsRoutes); // 使用设置路由
app.use('/api/users', usersRoutes); // 使用用户管理路由

const PORT = process.env.PORT || 5002;

sequelize.sync().then(() => {
  console.log('数据库同步完成');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('数据库同步失败:', err);
}); 