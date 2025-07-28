import React, { useEffect, useState } from 'react';
import { Table, message, Popconfirm, Button } from 'antd';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = () => {
    setLoading(true);
    axios.get('/logs')
      .then(res => setLogs(res.data))
      .catch(() => message.error('日志加载失败'))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/logs/${id}`);
      message.success('删除成功');
      fetchLogs();
    } catch {
      message.error('删除失败');
    }
  };

  const columns = [
    { title: '操作人', dataIndex: 'User', render: user => user?.username || '-' },
    { title: '操作内容', dataIndex: 'action' },
    { title: '时间', dataIndex: 'created_at', render: t => new Date(t).toLocaleString() },
    user?.role === 'superadmin' && {
      title: '操作',
      dataIndex: 'id',
      render: (id) => (
        <Popconfirm title="确定删除这条日志吗？" onConfirm={() => handleDelete(id)} okText="确定" cancelText="取消">
          <Button danger size="small">删除</Button>
        </Popconfirm>
      )
    }
  ].filter(Boolean);

  return (
    <div>
      <h2>操作日志</h2>
      <Table
        dataSource={logs}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
}