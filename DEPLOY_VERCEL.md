# 🚀 Vercel 全栈免费部署指南

## 第一步：注册 Vercel

1. 访问 https://vercel.com
2. 使用 GitHub 账号登录
3. 点击 "New Project"
4. 选择你的仓库 `aohanki/sfxt`

## 第二步：配置部署设置

在 Vercel 项目设置中：

- **Framework Preset**: 选择 "Other"
- **Root Directory**: 留空（使用根目录）
- **Build Command**: `cd frontend && npm install && npm run build`
- **Output Directory**: `frontend/build`
- **Install Command**: `npm install`

## 第三步：设置环境变量

在 Vercel 项目设置中添加：

```
DB_HOST=你的数据库主机
DB_USER=你的数据库用户
DB_PASSWORD=你的数据库密码
DB_NAME=fire_inventory
DB_PORT=3306
JWT_SECRET=fire_inventory_secret_2024
NODE_ENV=production
```

## 第四步：免费数据库选项

### 选项 1：PlanetScale（推荐）
1. 访问 https://planetscale.com
2. 注册免费账号
3. 创建新数据库
4. 获取连接信息

### 选项 2：Supabase
1. 访问 https://supabase.com
2. 注册免费账号
3. 创建新项目
4. 获取数据库连接信息

## 第五步：部署

1. 点击 "Deploy"
2. 等待部署完成
3. 获取你的应用 URL

## 🎉 完成！

部署完成后，你将获得一个完全免费的公开 URL！ 