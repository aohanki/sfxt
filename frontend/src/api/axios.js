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
  
  // 调试：打印完整请求URL
  console.log('Request URL:', config.baseURL + config.url);
  console.log('Request Method:', config.method);
  console.log('Request Headers:', config.headers);
  
  return config;
});

// 响应拦截器：调试响应
instance.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('API Error:', error);
    console.error('Error Config:', error.config);
    return Promise.reject(error);
  }
);

export default instance;