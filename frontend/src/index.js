import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ConfigProvider locale={zhCN}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ConfigProvider>
);