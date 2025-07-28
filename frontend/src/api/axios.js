import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5002/api',  // 改用5002端口
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