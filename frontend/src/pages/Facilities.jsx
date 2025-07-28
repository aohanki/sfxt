import React, { useEffect, useState } from 'react';
import {
  Table, Button, Modal, Form, Input, DatePicker, message,
  Popconfirm, Space, Upload, Input as AntInput, Select, InputNumber
} from 'antd';
import {
  UploadOutlined,
  DownloadOutlined,
  SearchOutlined,
  FilterOutlined
} from '@ant-design/icons';
import moment from 'moment';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


const { Search } = AntInput;
const { Option } = Select;

export default function Facilities({ readOnly = false }) {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [form] = Form.useForm();
  const { user } = useAuth();
  const isAdmin = user && user.role === 'admin';
  const isSuperAdmin = user && user.role === 'superadmin';
  const isReadOnly = user && (user.role === 'worker' || user.role === 'viewer');

  const fetchData = () => {
    setLoading(true);
    axios.get('/facilities').then(res => {
      setData(res.data);
      setFilteredData(res.data);
    }).catch(() => {
      message.error('数据加载失败');
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 搜索和筛选
  useEffect(() => {
    let result = [...data];

    // 搜索过滤
    if (searchText) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.model?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.serial_number?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 状态筛选
    if (filterStatus !== 'all') {
      result = result.filter(item => item.status === filterStatus);
    }

    setFilteredData(result);
  }, [searchText, filterStatus, data]);

  useEffect(() => {
    function handleAmapPick(e) {
      if (e.data && e.data.amapLng && e.data.amapLat) {
        form.setFieldsValue({
          longitude: e.data.amapLng,
          latitude: e.data.amapLat
        });
      }
    }
    window.addEventListener('message', handleAmapPick);
    return () => window.removeEventListener('message', handleAmapPick);
  }, [form]);

  const getNextSerialNumber = () => {
    // 获取所有数字编号
    const numbers = data
      .map(item => item.serial_number)
      .filter(sn => /^\d+$/.test(sn))
      .map(sn => parseInt(sn, 10))
      .sort((a, b) => a - b);
    // 查找最小未用编号
    let next = 1;
    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] !== next) break;
      next++;
    }
    return String(next).padStart(3, '0');
  };

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    // 自动填入下一个编号
    form.setFieldsValue({ serial_number: getNextSerialNumber() });
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditing(record);
    // 保证所有字段都能正确显示
    const safeRecord = { ...record };
    Object.keys(safeRecord).forEach(key => {
      if (safeRecord[key] === null || safeRecord[key] === undefined) safeRecord[key] = '';
    });
    form.setFieldsValue({
      ...safeRecord,
      purchase_date: safeRecord.purchase_date ? moment(safeRecord.purchase_date) : null,
      expiry_date: safeRecord.expiry_date ? moment(safeRecord.expiry_date) : null,
    });
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    axios.delete(`/facilities/${id}`).then(() => {
      message.success('删除成功');
      fetchData();
    }).catch(() => {
      message.error('删除失败');
    });
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      // 把所有空字符串转为 null
      const payload = {
        ...values,
        purchase_date: values.purchase_date ? values.purchase_date.format('YYYY-MM-DD') : null,
        expiry_date: values.expiry_date ? values.expiry_date.format('YYYY-MM-DD') : null,
      };
      Object.keys(payload).forEach(key => {
        if (payload[key] === '') payload[key] = null;
      });
      console.log('提交到后端的数据:', payload);

      const request = editing
        ? axios.put(`/facilities/${editing.id}`, payload)
        : axios.post('/facilities', payload);

      request.then(() => {
        message.success(editing ? '更新成功' : '新增成功');
        setModalVisible(false);
        setTimeout(fetchData, 100); // 确保数据刷新
      }).catch(err => {
        if (err.response && err.response.data) {
          const msg = err.response.data.message || '';
          const detail = err.response.data.error?.message || JSON.stringify(err.response.data.error) || '';
          message.error(msg + (detail ? ': ' + detail : ''));
          console.error('后端返回错误:', err.response.data);
        } else {
          message.error(editing ? '更新失败' : '新增失败');
          console.error('未知错误:', err);
        }
      });
    }).catch(err => {
      console.log('表单校验失败：', err);
      if (err && err.errorFields) {
        err.errorFields.forEach(field => {
          console.log('校验失败字段:', field.name, '，错误信息:', field.errors);
        });
      }
    });
  };

  // 导出Excel
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData.map(item => ({
      名称: item.name,
      型号: item.model,
      编号: item.serial_number,
      位置: item.location,
      生产厂家: item.manufacturer,
      采购日期: item.purchase_date,
      有效期: item.expiry_date,
      状态: item.status
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "设施列表");
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, '设施列表.xlsx');
  };

  // 导入Excel
  const handleImport = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // 转换字段名
      const facilities = jsonData.map(item => ({
        name: item.名称,
        model: item.型号,
        serial_number: item.编号,
        location: item.位置,
        manufacturer: item.生产厂家,
        purchase_date: item.采购日期,
        expiry_date: item.有效期,
        status: item.状态 || '在库'
      }));

      // 批量导入
      axios.post('/facilities/batch', facilities)
        .then(() => {
          message.success('导入成功');
          fetchData();
        })
        .catch(() => {
          message.error('导入失败');
        });
    };
    reader.readAsArrayBuffer(file);
    return false;
  };

  const columns = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '型号', dataIndex: 'model', key: 'model', render: v => v || '-' },
    { title: '编号', dataIndex: 'serial_number', key: 'serial_number' },
    { title: '位置', dataIndex: 'location', key: 'location', render: v => v || '-' },
    { title: '生产厂家', dataIndex: 'manufacturer', key: 'manufacturer', render: v => v || '-' },
    { 
      title: '采购日期', 
      dataIndex: 'purchase_date', 
      key: 'purchase_date',
      render: date => date ? moment(date).format('YYYY-MM-DD') : '-'
    },
    { 
      title: '有效期', 
      dataIndex: 'expiry_date', 
      key: 'expiry_date',
      render: date => date ? moment(date).format('YYYY-MM-DD') : '-'
    },
    { title: '状态', dataIndex: 'status', key: 'status' },
    { title: '库存数量', dataIndex: 'quantity', key: 'quantity' },
    (isAdmin || isSuperAdmin) && {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除吗？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ].filter(Boolean);

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        {!readOnly && <Button type="primary" onClick={handleAdd}>新增设施</Button>}
        <Search
          placeholder="搜索设施名称/型号/编号/位置"
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          defaultValue="all"
          style={{ width: 120 }}
          onChange={value => setFilterStatus(value)}
        >
          <Option value="all">全部状态</Option>
          <Option value="在库">在库</Option>
          <Option value="领用">已领用</Option>
          <Option value="维修">维修中</Option>
          <Option value="报废">已报废</Option>
        </Select>
        {!(isReadOnly) && (
          <>
            <Upload
              beforeUpload={handleImport}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>导入Excel</Button>
            </Upload>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              导出Excel
            </Button>
          </>
        )}
      </Space>

      <Table
        dataSource={filteredData}
        columns={readOnly ? columns.filter(col => col.key !== 'action') : columns}
        rowKey="id"
        loading={loading}
        bordered
      />

      {!readOnly && (
        <Modal
          title={editing ? '编辑设施' : '新增设施'}
          open={modalVisible}
          onOk={handleOk}
          onCancel={() => setModalVisible(false)}
          destroyOnHidden
        >
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}> <Input /> </Form.Item>
            <Form.Item name="model" label="型号">
              <Input value={form.getFieldValue('model') || ''} onChange={e => form.setFieldsValue({ model: e.target.value })} />
            </Form.Item>
            <Form.Item name="serial_number" label="编号" rules={[{ required: true, message: '请输入编号' }]}> <Input /> </Form.Item>
            <Form.Item name="location" label="位置">
              <Input value={form.getFieldValue('location') || ''} onChange={e => form.setFieldsValue({ location: e.target.value })} />
            </Form.Item>
            <Form.Item name="manufacturer" label="生产厂家">
              <Input value={form.getFieldValue('manufacturer') || ''} onChange={e => form.setFieldsValue({ manufacturer: e.target.value })} />
            </Form.Item>
            <Form.Item name="purchase_date" label="采购日期">
              <DatePicker
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
                showTime={false}
                value={form.getFieldValue('purchase_date') ? moment(form.getFieldValue('purchase_date')) : null}
                onChange={date => form.setFieldsValue({ purchase_date: date })}
              />
            </Form.Item>
            <Form.Item name="expiry_date" label="有效期">
              <DatePicker
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
                showTime={false}
                value={form.getFieldValue('expiry_date') ? moment(form.getFieldValue('expiry_date')) : null}
                onChange={date => form.setFieldsValue({ expiry_date: date })}
              />
            </Form.Item>
            <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}> <Select> <Option value="在库">在库</Option> <Option value="领用">已领用</Option> <Option value="维修">维修中</Option> <Option value="报废">已报废</Option> </Select> </Form.Item>
            <Form.Item name="quantity" label="库存数量" rules={[{ required: true, message: '请输入库存数量' }]}> <InputNumber style={{ width: '100%' }} min={0} /> </Form.Item>
            <Form.Item name="longitude" label="经度"> <Input readOnly placeholder="请在下方地图选点" /> </Form.Item>
            <Form.Item name="latitude" label="纬度"> <Input readOnly placeholder="请在下方地图选点" /> </Form.Item>
            <Form.Item label="地图选点" shouldUpdate={false}>
              <iframe
                title="amap-picker"
                srcDoc={`<!doctype html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1.0'><style>html,body,#picker-map{width:100%;height:100%;margin:0;padding:0;}</style></head><body><div id='picker-map'></div><script src='https://webapi.amap.com/maps?v=2.0&key=171a5f80225cff64d7524f031a2d516d'></script><script>var map=new AMap.Map('picker-map',{zoom:16,center:[113.2206,23.0997]});var marker=new AMap.Marker({map:map});map.on('click',function(e){marker.setPosition(e.lnglat);window.parent.postMessage({amapLng:e.lnglat.lng,amapLat:e.lnglat.lat},'*');});</script></body></html>`}
                style={{ width: '100%', height: 300, border: '1px solid #eee' }}
              />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
}