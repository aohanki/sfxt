# Vercel 部署指南

## 1. 前端部署（已完成）
- 项目已部署到：`https://sfxt-fqmdse09g-aaaaas-projects-5c4b6a56.vercel.app`

## 2. 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

### 数据库配置
```
DB_HOST=your-supabase-host.supabase.co
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-supabase-password
DB_PORT=5432
DB_DIALECT=postgres
```

### JWT 配置
```
JWT_SECRET=your-jwt-secret-key
```

### 其他配置
```
NODE_ENV=production
FRONTEND_URL=https://sfxt-fqmdse09g-aaaaas-projects-5c4b6a56.vercel.app
```

## 3. 获取 Supabase 数据库信息

1. 登录 Supabase 控制台
2. 选择你的项目
3. 进入 Settings > Database
4. 复制以下信息：
   - Host
   - Database name (通常是 postgres)
   - Port (通常是 5432)
   - User (通常是 postgres)
   - Password

## 4. 重新部署

配置环境变量后，Vercel 会自动重新部署。

## 5. 测试

部署完成后，访问应用并尝试登录。

默认超级管理员账号：
- 用户名：superadmin
- 密码：admin 