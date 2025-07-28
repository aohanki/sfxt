# 🚀 完整部署步骤指南

## 准备工作

确保你的代码已经上传到 GitHub：
- 仓库地址：https://github.com/aohanki/sfxt
- 所有文件都已提交

## 第一步：创建免费数据库（PlanetScale）

### 1.1 注册 PlanetScale
1. 访问 https://planetscale.com
2. 点击 "Start for free"
3. 使用 GitHub 账号登录

### 1.2 创建组织
1. 输入组织名称：`fire-inventory`
2. 点击 "Create organization"

### 1.3 创建数据库
1. 点击 "Create database"
2. 数据库名称：`fire_inventory`
3. 选择 "Development" 分支
4. 点击 "Create database"

### 1.4 获取连接信息
1. 点击你的数据库名称
2. 点击 "Connect" 按钮
3. 选择 "Connect with MySQL"
4. 复制连接信息：
   ```
   Host: aws.connect.psdb.cloud
   User: your_username
   Password: your_password
   Database: your_database_name
   Port: 3306
   ```

## 第二步：部署到 Vercel

### 2.1 注册 Vercel
1. 访问 https://vercel.com
2. 使用 GitHub 账号登录

### 2.2 创建项目
1. 点击 "New Project"
2. 选择你的仓库 `aohanki/sfxt`
3. 点击 "Import"

### 2.3 配置部署设置
在项目配置页面设置：
- **Framework Preset**: 选择 "Other"
- **Root Directory**: 留空
- **Build Command**: `cd frontend && npm install && npm run build`
- **Output Directory**: `frontend/build`
- **Install Command**: `npm install`

### 2.4 设置环境变量
在 "Environment Variables" 部分添加：

```
DB_HOST=你的planetscale_host
DB_USER=你的planetscale_user
DB_PASSWORD=你的planetscale_password
DB_NAME=你的planetscale_database
DB_PORT=3306
JWT_SECRET=fire_inventory_secret_2024
NODE_ENV=production
```

**重要**：请将上面的值替换为你从 PlanetScale 获取的实际连接信息！

### 2.5 部署应用
1. 点击 "Deploy"
2. 等待部署完成（3-5分钟）
3. 获取你的应用 URL

## 第三步：测试部署

### 3.1 访问应用
1. 打开 Vercel 提供的 URL
2. 确认页面正常加载

### 3.2 注册用户
1. 点击 "注册"
2. 创建管理员账号
3. 使用新账号登录

### 3.3 测试功能
1. **仪表盘**：查看统计信息
2. **设施管理**：添加、编辑、删除设施
3. **库存管理**：查看库存信息
4. **用户管理**：管理用户账号
5. **报表统计**：查看各种报表

## 第四步：分享你的应用

部署完成后，你可以：
1. 分享 Vercel URL 给其他人
2. 任何人都可以通过这个链接访问你的应用
3. 支持多用户同时使用

## 🔧 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查环境变量是否正确
   - 确认 PlanetScale 数据库正常运行

2. **部署失败**
   - 检查构建日志
   - 确认所有依赖都已安装

3. **页面无法访问**
   - 检查 Vercel 部署状态
   - 确认域名配置正确

## 🎉 完成！

部署成功后，你将获得：
- ✅ 完全免费的应用托管
- ✅ 免费数据库服务
- ✅ 公开访问的 URL
- ✅ 支持多用户使用

---

**现在开始按照上述步骤操作吧！有任何问题随时告诉我！** 🚀 