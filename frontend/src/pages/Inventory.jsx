import React, { useEffect, useState } from 'react';
import { Table, Card, Alert, Row, Col } from 'antd';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Inventory({ readOnly }) {
  const [records, setRecords] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const isUser = user && user.role === 'user';

  // 获取所有记录
  const fetchRecords = () => {
    setLoading(true);
    axios.get('/inventory/records').then(res => {
      if (res.data && Array.isArray(res.data.records)) {
        setRecords(res.data.records);
      } else {
        setRecords([]);
      }
    }).catch(() => {})
    .finally(() => setLoading(false));
  };

  // 获取所有设施用于下拉框
  const fetchFacilities = () => {
    axios.get('/facilities').then(res => {
      setFacilities(res.data);
    }).catch(() => {});
  };

  useEffect(() => {
    fetchRecords();
    fetchFacilities();
  }, []);

  // 预警检查
  const getWarnings = () => {
    const warnings = [];
    if (!Array.isArray(records) || !Array.isArray(facilities)) return warnings;
    // 检查即将过期的设施
    const nearExpiry = facilities.filter(f => {
      if (!f.expiry_date) return false;
      const daysToExpiry = moment(f.expiry_date).diff(moment(), 'days');
      return daysToExpiry >= 0 && daysToExpiry <= 30;
    });
    if (nearExpiry.length > 0) {
      warnings.push({ type: 'error', message: `${nearExpiry.length}个设施即将过期，请及时处理` });
    }
    return warnings;
  };

  const warnings = getWarnings();

  // 库存变动历史图表
  const getHistoryOption = () => {
    if (!Array.isArray(records)) return { xAxis: { data: [] }, series: [] };
    const dates = [...new Set(records.map(r => moment(r.operation_time).format('YYYY-MM-DD')))].sort();
    const inData = dates.map(date => records.filter(r => moment(r.operation_time).format('YYYY-MM-DD') === date && r.operation_type === '入库').reduce((sum, r) => sum + r.quantity, 0));
    const outData = dates.map(date => records.filter(r => moment(r.operation_time).format('YYYY-MM-DD') === date && r.operation_type === '出库').reduce((sum, r) => sum + r.quantity, 0));
    return {
      title: { text: '库存变动历史' },
      tooltip: { trigger: 'axis' },
      legend: { data: ['入库', '出库'] },
      xAxis: { type: 'category', data: dates },
      yAxis: { type: 'value' },
      series: [
        { name: '入库', type: 'bar', data: inData, color: '#52c41a' },
        { name: '出库', type: 'bar', data: outData, color: '#ff4d4f' }
      ]
    };
  };

  return (
    <div>
      {warnings.map((warning, index) => (
        <Alert key={index} message={warning.message} type={warning.type} showIcon style={{ marginBottom: 16 }} />
      ))}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="现有库存">
            <Table
              dataSource={facilities}
              columns={[
                { title: '名称', dataIndex: 'name' },
                { title: '型号', dataIndex: 'model' },
                { title: '库存数量', dataIndex: 'quantity' },
                { title: '状态', dataIndex: 'status' },
                { title: '位置', dataIndex: 'location' }
              ]}
              pagination={false}
              size="small"
              style={{ marginBottom: 16 }}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
      {/* 普通用户保留库存变动历史柱状图 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card>
            <ReactEcharts option={getHistoryOption()} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}