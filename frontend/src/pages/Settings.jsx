import React, { useState, useEffect } from 'react';
import { Card, Form, InputNumber, Button, message, Switch, Input, Space } from 'antd';
import axios from '../api/axios';

export default function Settings() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 获取当前设置
    axios.get('/settings').then(res => {
      form.setFieldsValue(res.data);
    }).catch(() => {
      message.error('设置加载失败');
    });
  }, [form]);

  const handleSave = (values) => {
    setLoading(true);
    axios.post('/settings', values)
      .then((response) => {
        if (response.data && response.data.message) {
          message.success(response.data.message);
        } else {
          message.success('设置保存成功');
        }
      })
      .catch((error) => {
        message.error(error.response?.data?.message || '设置保存失败');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Card title="系统设置">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={{
          stockWarningThreshold: 10,
          expiryWarningDays: 30,
          enableEmailNotification: false,
          emailRecipients: ''
        }}
      >
        <Form.Item
          name="stockWarningThreshold"
          label="库存预警阈值"
          tooltip="当库存数量低于此值时触发预警"
          rules={[{ required: true, message: '请输入库存预警阈值' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="expiryWarningDays"
          label="有效期预警天数"
          tooltip="提前多少天提醒设施即将过期"
          rules={[{ required: true, message: '请输入有效期预警天数' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="enableEmailNotification"
          label="启用邮件通知"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="emailRecipients"
          label="通知邮箱"
          tooltip="多个邮箱用逗号分隔"
          rules={[
            {
              required: false,
              type: 'string',
              pattern: /^([a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+,?)*$/,
              message: '请输入有效的邮箱地址，多个邮箱用逗号分隔'
            }
          ]}
        >
          <Input.TextArea rows={3} placeholder="example1@domain.com, example2@domain.com" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            保存设置
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
} 