# 🆓 免费部署指南

## 方案一：Railway + Vercel（推荐）

### 后端部署（Railway - 免费）

1. **注册 Railway**
   - 访问 https://railway.app
   - 使用 GitHub 账号登录

2. **创建项目**
   - 点击 "Start a New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择你的仓库 `aohanki/sfxt`

3. **添加免费数据库**
   - 点击 "New" → "Database" → "MySQL"
   - 等待创建完成

4. **配置环境变量**
   在 Railway 项目设置中添加：
   ```
   DB_HOST=你的railway_mysql_host
   DB_USER=你的railway_mysql_user
   DB_PASSWORD=你的railway_mysql_password
   DB_NAME=railway
   DB_PORT=3306
   JWT_SECRET=your_secret_key_123
   NODE_ENV=production
   ```

5. **获取后端 URL**
   - 部署完成后，复制 Railway 提供的 URL
   - 例如：`https://your-app.railway.app`

### 前端部署（Vercel - 免费）

1. **注册 Vercel**
   - 访问 https://vercel.com
   - 使用 GitHub 账号登录

2. **创建项目**
   - 点击 "New Project"
   - 选择你的仓库 `aohanki/sfxt`

3. **配置部署设置**
   - Framework Preset: `Create React App`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

4. **更新 API 地址**
   - 将 `frontend/vercel.json` 中的 URL 替换为你的 Railway 后端 URL

## 方案二：Vercel 全栈部署（更简单）

1. **注册 Vercel**
   - 访问 https://vercel.com
   - 使用 GitHub 账号登录

2. **创建项目**
   - 点击 "New Project"
   - 选择你的仓库 `aohanki/sfxt`

3. **配置环境变量**
   ```
   DB_HOST=你的数据库主机
   DB_USER=你的数据库用户
   DB_PASSWORD=你的数据库密码
   DB_NAME=fire_inventory
   DB_PORT=3306
   JWT_SECRET=your_secret_key_123
   NODE_ENV=production
   ```

4. **部署**
   - 点击 "Deploy"

## 免费数据库选项

### 1. Railway MySQL（推荐）
- 免费额度：每月 $5 信用
- 包含在 Railway 部署中

### 2. PlanetScale
- 免费额度：每月 1GB 存储
- 注册：https://planetscale.com

### 3. Supabase
- 免费额度：每月 500MB 数据库
- 注册：https://supabase.com

### 4. Neon
- 免费额度：每月 3GB 存储
- 注册：https://neon.tech

## 🚀 快速开始

### 步骤 1：准备数据库
1. 选择上述任一免费数据库服务
2. 创建数据库
3. 获取连接信息

### 步骤 2：部署后端
1. 使用 Railway 部署后端
2. 配置数据库环境变量
3. 获取后端 URL

### 步骤 3：部署前端
1. 使用 Vercel 部署前端
2. 更新 API 地址
3. 获取前端 URL

### 步骤 4：测试
1. 访问前端 URL
2. 注册新用户
3. 测试所有功能

## 💰 费用说明

- **Railway**: 每月 $5 免费信用（足够小型项目）
- **Vercel**: 完全免费（个人项目）
- **数据库**: 上述选项都提供免费额度

## 🔧 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查环境变量
   - 确认数据库服务正常运行

2. **API 请求失败**
   - 检查 CORS 设置
   - 确认后端 URL 正确

3. **部署失败**
   - 检查构建日志
   - 确认依赖安装正确

## 📞 获取帮助

如果遇到问题：
1. 检查部署日志
2. 查看浏览器控制台
3. 确认环境变量设置

---

**🎉 完成部署后，你的应用将完全免费运行！** 