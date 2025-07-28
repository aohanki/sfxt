import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, message, Button, Space, Select, Input } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { 
  ToolOutlined, 
  WarningOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import axios from '../api/axios';
import moment from 'moment';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import zhCN from 'antd/es/locale/zh_CN';

const { Option } = Select;

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [operator, setOperator] = useState('');
  const [searchText, setSearchText] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/reports/stats', {
        params: {
          operator,
          search: searchText
        }
      });
      setStats(res.data);
    } catch (err) {
      message.error('统计数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [operator, searchText]);

  // 状态分布饼图配置
  const getPieOption = () => {
    const data = stats?.statusCounts.map(item => ({
      name: item.status || '未知',
      value: item.count
    })) || [];

    return {
      title: {
        text: '设施状态分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '设施状态',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'outside'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '16',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true
          },
          data: data
        }
      ]
    };
  };

  // 导出Excel报表
  const handleExport = () => {
    // 创建工作簿
    const wb = XLSX.utils.book_new();

    // 1. 基本统计数据
    const basicStats = [
      ['统计时间范围', `${moment().startOf('day').format('YYYY-MM-DD')} 至 ${moment().endOf('day').format('YYYY-MM-DD')}`],
      ['设施总数', stats.totalFacilities],
      ['即将过期设施数', stats.expiringSoon.length],
      ['即将过期设施总数量', stats.expiringSoon.reduce((sum, item) => sum + (item.quantity || 0), 0)],
      ['已过期设施数', stats?.expiredFacilities?.length || 0],
      ['已过期设施总数量', (stats?.expiredFacilities || []).reduce((sum, item) => sum + (item.quantity || 0), 0)],
      ['', ''],
      ['状态分布:', ''],
      ...stats.statusCounts.map(item => [item.status, item.count])
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(basicStats);
    XLSX.utils.book_append_sheet(wb, ws1, "基本统计");

    // 2. 即将过期设施清单
    const expiringData = stats.expiringSoon.map(item => ({
      '名称': item.name,
      '型号': item.model,
      '位置': item.location,
      '生产厂家': item.manufacturer,
      '采购日期': item.purchase_date,
      '有效期': item.expiry_date,
      '状态': item.status,
      '库存数量': item.quantity || 0,
      '剩余天数': moment(item.expiry_date).diff(moment(), 'days')
    }));
    const ws2 = XLSX.utils.json_to_sheet(expiringData);
    XLSX.utils.book_append_sheet(wb, ws2, "即将过期设施");

    // 3. 已过期设施清单
    const expiredData = (stats?.expiredFacilities || []).map(item => ({
      '名称': item.name,
      '型号': item.model,
      '位置': item.location,
      '生产厂家': item.manufacturer,
      '采购日期': item.purchase_date,
      '有效期': item.expiry_date,
      '状态': item.status,
      '库存数量': item.quantity || 0,
      '过期天数': moment().diff(moment(item.expiry_date), 'days')
    }));
    const ws3 = XLSX.utils.json_to_sheet(expiredData);
    XLSX.utils.book_append_sheet(wb, ws3, "已过期设施");

    // 4. 所有设施清单
    const allFacilitiesData = stats.allFacilities.map(item => ({
      '名称': item.name,
      '型号': item.model,
      '编号': item.serial_number,
      '位置': item.location,
      '生产厂家': item.manufacturer,
      '采购日期': item.purchase_date ? moment(item.purchase_date).format('YYYY-MM-DD') : '',
      '有效期': item.expiry_date ? moment(item.expiry_date).format('YYYY-MM-DD') : '',
      '状态': item.status,
      '库存数量': item.quantity || 0,
      '剩余天数': item.expiry_date ? moment(item.expiry_date).diff(moment(), 'days') : '无有效期'
    }));
    const ws4 = XLSX.utils.json_to_sheet(allFacilitiesData);
    XLSX.utils.book_append_sheet(wb, ws4, "所有设施");

    // 导出文件
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `设施统计报表_${moment().format('YYYY-MM-DD')}.xlsx`);
  };

  const expiringColumns = [
    { title: '名称', dataIndex: 'name' },
    { title: '型号', dataIndex: 'model' },
    { title: '位置', dataIndex: 'location' },
    { title: '数量', dataIndex: 'quantity' },
    { title: '状态', dataIndex: 'status' },
    { 
      title: '有效期至', 
      dataIndex: 'expiry_date', 
      render: date => moment(date).format('YYYY-MM-DD'),
      sorter: (a, b) => moment(a.expiry_date).unix() - moment(b.expiry_date).unix()
    },
    {
      title: '剩余天数',
      dataIndex: 'expiry_date',
      render: date => moment(date).diff(moment(), 'days'),
      sorter: (a, b) => moment(a.expiry_date).diff(moment()) - moment(b.expiry_date).diff(moment())
    }
  ];

  const expiredColumns = [
    { title: '名称', dataIndex: 'name' },
    { title: '型号', dataIndex: 'model' },
    { title: '位置', dataIndex: 'location' },
    { title: '数量', dataIndex: 'quantity' },
    { title: '状态', dataIndex: 'status' },
    { 
      title: '有效期至', 
      dataIndex: 'expiry_date', 
      render: date => moment(date).format('YYYY-MM-DD'),
      sorter: (a, b) => moment(a.expiry_date).unix() - moment(b.expiry_date).unix()
    },
    {
      title: '过期天数',
      dataIndex: 'expiry_date',
      render: date => moment().diff(moment(date), 'days'),
      sorter: (a, b) => moment(a.expiry_date).diff(moment()) - moment(b.expiry_date).diff(moment())
    }
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        {/* 日期选择器已移除 */}
        <Select
          style={{ width: 200 }}
          placeholder="按操作人筛选"
          allowClear
          onChange={value => setOperator(value)}
        >
          {stats?.allLogs && Array.from(new Set(stats.allLogs.map(log => log.User?.username).filter(Boolean))).map(username => (
            <Option key={username} value={username}>{username}</Option>
          ))}
        </Select>
        <Input.Search
          placeholder="搜索设施名称/型号"
          style={{ width: 200 }}
          onSearch={value => setSearchText(value)}
          allowClear
        />
        <Button 
          type="primary" 
          icon={<DownloadOutlined />} 
          onClick={handleExport}
        >
          导出报表
        </Button>
      </Space>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title="设施总数"
              value={stats?.totalFacilities}
              prefix={<ToolOutlined />}
            />
          </Card>
        </Col>
        {stats?.statusCounts.map(item => (
          <Col xs={24} sm={12} md={6} key={item.status}>
            <Card loading={loading}>
              <Statistic
                title={`${item.status}数量`}
                value={item.count}
                valueStyle={{ 
                  color: item.status === '在库' ? '#3f8600' : 
                         item.status === '领用' ? '#1890ff' :
                         item.status === '维修' ? '#faad14' : '#cf1322'
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card loading={loading}>
            <Statistic
              title="即将过期 (30天内)"
              value={stats?.expiringSoon.length}
              valueStyle={{ color: '#cf1322' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card loading={loading}>
            <Statistic
              title="即将过期设施总数量"
              value={stats?.expiringSoon.reduce((sum, item) => sum + (item.quantity || 0), 0)}
              valueStyle={{ color: '#cf1322' }}
              prefix={<WarningOutlined />}
              suffix="件"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card loading={loading}>
            <Statistic
              title="已过期设施数"
              value={stats?.expiredFacilities?.length || 0}
              valueStyle={{ color: '#bfbfbf' }}
              prefix={<WarningOutlined />}
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
        <Col span={12}>
          <Card title="即将过期设施列表" loading={loading}>
            <Table
              dataSource={stats?.expiringSoon}
              columns={expiringColumns}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Card title="已过期设施列表" loading={loading}>
            <Table
              dataSource={stats?.expiredFacilities || []}
              columns={expiredColumns}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}