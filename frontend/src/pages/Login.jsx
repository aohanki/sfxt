import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post('/auth/login', values);
      login(res.data.token);
    } catch (err) {
      message.error(err.response?.data?.message || '登录失败');
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      maxWidth: 400, 
      margin: '100px auto',
      padding: '20px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      backgroundColor: 'white'
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        color: '#1890ff'
      }}>
        消防设施库存管理系统
      </h2>
      <Form
        name="login"
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder="用户名" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password placeholder="密码" />
        </Form.Item>
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading} 
            block
            style={{ height: '40px' }}
          >
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
} 