import axios from 'axios';

// 强制重新构建 - 2024-07-29 08:55
const baseURL = process.env.NODE_ENV === 'production' 
  ? '/api'  // 生产环境使用相对路径
  : 'http://localhost:5002/api';  // 开发环境使用本地端口

console.log('API Base URL:', baseURL, 'NODE_ENV:', process.env.NODE_ENV);

const instance = axios.create({
  baseURL,
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