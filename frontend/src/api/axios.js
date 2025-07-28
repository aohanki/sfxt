import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://your-vercel-backend.vercel.app/api'  // 生产环境使用 Vercel 后端
    : 'http://localhost:5002/api',  // 开发环境使用本地端口
  timeout: 10000
});

// 请求拦截器：自动携带token
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;