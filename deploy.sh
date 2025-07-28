#!/bin/bash

echo "🚀 开始部署消防设施库存管理系统..."

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 正在安装 Vercel CLI..."
    npm install -g vercel
fi

# 检查是否已登录 Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 请先登录 Vercel..."
    vercel login
fi

# 构建前端
echo "🔨 构建前端应用..."
cd frontend
npm install
npm run build
cd ..

# 部署到 Vercel
echo "🌐 部署到 Vercel..."
vercel --prod

echo "✅ 部署完成！"
echo "🌍 你的应用现在可以通过以下链接访问："
echo "   https://your-app-name.vercel.app" 