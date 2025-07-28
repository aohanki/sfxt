import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, message } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { ToolOutlined, WarningOutlined, ClockCircleOutlined } from '@ant-design/icons';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const isSuperAdmin = user && user.role === 'superadmin';
  const isAdmin = user && user.role === 'admin';
  const isUser = user && user.role === 'user';

  useEffect(() => {
    setLoading(true);
    if (isSuperAdmin) {
      Promise.all([
        axios.get('/reports/stats'),
        axios.get('/logs')
      ]).then(([statsRes, logsRes]) => {
        setStats(statsRes.data);
        setRecentLogs(logsRes.data.slice(0, 5));
      }).catch(() => {
        message.error('数据加载失败');
      }).finally(() => {
        setLoading(false);
      });
    } else {
      // admin 和 user 只请求 /reports/stats
      axios.get('/reports/stats')
        .then(res => setStats(res.data))
        .catch(() => message.error('数据加载失败'))
        .finally(() => setLoading(false));
    }
  }, [isSuperAdmin, isAdmin, isUser]);

  // 状态分布饼图配置
  const getPieOption = () => {
    const data = stats?.statusCounts.map(item => ({
      name: item.status || '未知',
      value: item.count
    })) || [];
    return {
      title: { text: '设施状态分布', left: 'center' },
      tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
      legend: { orient: 'vertical', left: 'left' },
      series: [
        {
          name: '设施状态',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: { show: true, position: 'outside' },
          emphasis: { label: { show: true, fontSize: '16', fontWeight: 'bold' } },
          labelLine: { show: true },
          data: data
        }
      ]
    };
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card loading={loading}>
            <Statistic
              title="设施总数"
              value={stats?.totalFacilities ?? 0}
              prefix={<ToolOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card loading={loading}>
            <Statistic
              title="即将过期"
              value={stats?.expiringSoon?.length ?? 0}
              valueStyle={{ color: '#cf1322' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card loading={loading}>
            <Statistic
              title="今日操作数"
              value={isSuperAdmin ? (recentLogs ? recentLogs.filter(log => {
                const today = new Date();
                const logDate = new Date(log.created_at);
                return today.toDateString() === logDate.toDateString();
              }).length : 0) : '-'}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={12}>
          <Card title="状态分布" loading={loading}>
            <ReactEcharts option={getPieOption()} style={{ height: '300px' }} />
          </Card>
        </Col>
        {/* 只有超级管理员和管理员显示最近操作记录 */}
        {(isSuperAdmin || isAdmin) && (
          <Col span={12}>
            <Card title="最近操作记录" loading={loading}>
              {/* 只有超级管理员有 recentLogs，管理员可根据需要调整 */}
              <div style={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
                {isSuperAdmin ? (
                  <ul style={{ paddingLeft: 20 }}>
                    {recentLogs.map(log => (
                      <li key={log.id}>{log.User?.username} - {log.action} - {new Date(log.created_at).toLocaleString()}</li>
                    ))}
                  </ul>
                ) : '无权限查看'}
              </div>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
}