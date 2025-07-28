import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

export default function Auth() {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onLogin = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post('/auth/login', values);
      localStorage.setItem('token', res.data.token);
      message.success('登录成功！');
      // 立即跳转，不使用 setTimeout
      window.location.href = '/';
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        message.error(err.response.data.message);
      } else {
        message.error('登录失败');
      }
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (values) => {
    setLoading(true);
    try {
      await axios.post('/auth/register', values);
      message.success('注册成功，请登录！');
      setTimeout(() => setMode('login'), 1000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        message.error(err.response.data.message);
      } else {
        message.error('注册失败');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)' }}>
      <Card style={{ width: 380, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', borderRadius: 12 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ marginBottom: 0 }}>消防设施库存管理系统</Title>
          <Text type="secondary">{mode === 'login' ? '登录你的账户' : '注册新账户'}</Text>
        </div>
        {mode === 'login' ? (
          <Form
            name="login"
            onFinish={onLogin}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="请输入用户名" size="large" autoComplete="username" />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" size="large" autoComplete="current-password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large" loading={loading} style={{ borderRadius: 6 }}>
                登录
              </Button>
            </Form.Item>
            <div style={{ textAlign: 'right' }}>
              <Text type="secondary">没有账号？</Text>
              <Button type="link" onClick={() => setMode('register')} style={{ padding: 0, marginLeft: 4 }}>
                去注册
              </Button>
            </div>
          </Form>
        ) : (
          <Form
            name="register"
            onFinish={onRegister}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, message: '用户名至少3位' }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="请输入用户名" size="large" autoComplete="username" />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6位' }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" size="large" autoComplete="new-password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large" loading={loading} style={{ borderRadius: 6 }}>
                注册
              </Button>
            </Form.Item>
            <div style={{ textAlign: 'right' }}>
              <Text type="secondary">已有账号？</Text>
              <Button type="link" onClick={() => setMode('login')} style={{ padding: 0, marginLeft: 4 }}>
                去登录
              </Button>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
} 