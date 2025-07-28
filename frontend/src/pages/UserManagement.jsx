import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message, Tag, Space, Popconfirm } from 'antd';
import { DeleteOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import axios from '../api/axios';

const ROLE_LABELS = {
  superadmin: { text: '超级管理员', color: 'red' },
  admin: { text: '管理员', color: 'orange' },
  user: { text: '普通用户', color: 'blue' }
};

const ROLE_ORDER = ['user', 'admin', 'superadmin'];

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/users');
      setUsers(response.data.filter(u => ROLE_ORDER.includes(u.role)));
    } catch (error) {
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`/users/${userId}`);
      message.success('删除用户成功');
      fetchUsers();
    } catch (error) {
      message.error('删除用户失败');
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await axios.put(`/users/${userId}/role`, { role: newRole });
      message.success('更新用户权限成功');
      fetchUsers();
    } catch (error) {
      message.error('更新用户权限失败');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={ROLE_LABELS[role]?.color || 'default'}>
          {ROLE_LABELS[role]?.text || role}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => {
        if (record.role === 'superadmin') return null;
        return (
          <Space>
            {record.role === 'user' && (
              <Button
                type="primary"
                size="small"
                icon={<UpOutlined />}
                onClick={() => handleUpdateRole(record.id, 'admin')}
              >
                升级为管理员
              </Button>
            )}
            {record.role === 'admin' && (
              <>
                <Button
                  type="default"
                  size="small"
                  icon={<DownOutlined />}
                  onClick={() => handleUpdateRole(record.id, 'user')}
                >
                  降级为普通用户
                </Button>
              </>
            )}
            <Popconfirm
              title="确定要删除这个用户吗？"
              onConfirm={() => handleDeleteUser(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="primary"
                danger
                size="small"
                icon={<DeleteOutlined />}
              >
                删除
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <h2>用户管理</h2>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />
    </div>
  );
} 