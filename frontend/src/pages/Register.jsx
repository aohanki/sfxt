import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

export default function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post('/auth/register', values);
      message.success('注册成功，请登录！');
      setTimeout(() => navigate('/login'), 1000);
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
          <Title level={2} style={{ marginBottom: 0 }}>用户注册</Title>
          <Text type="secondary">创建你的账户，体验智能库存管理</Text>
        </div>
        <Form
          name="register"
          onFinish={onFinish}
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
            <Button type="link" onClick={() => navigate('/login')} style={{ padding: 0, marginLeft: 4 }}>
              去登录
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
} 