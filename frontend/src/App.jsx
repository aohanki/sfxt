import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Layout, Menu, Button, Modal } from 'antd';
import {
  DashboardOutlined,
  ToolOutlined,
  SwapOutlined,
  BarChartOutlined,
  FileTextOutlined,
  SettingOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useAuth } from './context/AuthContext';

import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Facilities from './pages/Facilities';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import Logs from './pages/Logs';
import Settings from './pages/Settings';
import MapView from './pages/MapView';
import UserManagement from './pages/UserManagement';

const { Header, Content, Sider } = Layout;

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [logoutModal, setLogoutModal] = useState(false);

  // 菜单渲染
  const getMenuItems = () => {
    const items = [];
    items.push(
      <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
        <Link to="/">仪表盘</Link>
      </Menu.Item>
    );
    // 设施管理（仅superadmin和admin）
    if (user.role === 'superadmin' || user.role === 'admin') {
      items.push(
        <Menu.Item key="facilities" icon={<ToolOutlined />}>
          <Link to="/facilities">设施管理</Link>
        </Menu.Item>
      );
    }
    // 库存管理
    items.push(
      <Menu.Item key="inventory" icon={<SwapOutlined />}>
        <Link to="/inventory">库存管理</Link>
      </Menu.Item>
    );
    // 报表统计（仅superadmin和admin）
    if (user.role === 'superadmin' || user.role === 'admin') {
      items.push(
        <Menu.Item key="reports" icon={<BarChartOutlined />}>
          <Link to="/reports">报表统计</Link>
        </Menu.Item>
      );
    }
    // 设施分布地图
    items.push(
      <Menu.Item key="map" icon={<BarChartOutlined />}>
        <Link to="/map">设施分布地图</Link>
      </Menu.Item>
    );
    // 用户管理、日志、系统设置（仅超级管理员）
    if (user.role === 'superadmin') {
      items.push(
        <Menu.Item key="users" icon={<TeamOutlined />}>
          <Link to="/users">用户管理</Link>
        </Menu.Item>,
        <Menu.Item key="logs" icon={<FileTextOutlined />}>
          <Link to="/logs">操作日志</Link>
        </Menu.Item>,
        <Menu.Item key="settings" icon={<SettingOutlined />}>
          <Link to="/settings">系统设置</Link>
        </Menu.Item>
      );
    }
    return items;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div style={{
          height: '32px',
          margin: '16px',
          background: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          textAlign: 'center',
          lineHeight: '32px'
        }}>
          消防库存管理
        </div>
        <Menu theme="dark" defaultSelectedKeys={['dashboard']} mode="inline">
          {getMenuItems()}
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: '0 16px', background: '#fff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button type="primary" onClick={() => setLogoutModal(true)}>
            登出
          </Button>
          <Modal
            title="确认登出"
            open={logoutModal}
            onOk={logout}
            onCancel={() => setLogoutModal(false)}
            okText="确定"
            cancelText="取消"
          >
            <p>确定要退出登录吗？</p>
          </Modal>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360, background: '#fff' }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Auth /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Auth /> : <Navigate to="/" />} />
        <Route path="/*" element={user ? (
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {(user.role === 'superadmin' || user.role === 'admin') && (
                <Route path="/facilities" element={<Facilities readOnly={false} />} />
              )}
              {/* 普通用户不再有设施查询页面 */}
              <Route path="/inventory" element={<Inventory readOnly={user.role === 'user'} />} />
              {(user.role === 'superadmin' || user.role === 'admin') && (
                <Route path="/reports" element={<Reports />} />
              )}
              <Route path="/map" element={<MapView />} />
              {user.role === 'superadmin' && (
                <>
                  <Route path="/users" element={<UserManagement />} />
                  <Route path="/logs" element={<Logs />} />
                  <Route path="/settings" element={<Settings />} />
                </>
              )}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AppLayout>
        ) : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;