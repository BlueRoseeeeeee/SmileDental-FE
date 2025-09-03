import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  Menu,
  Card,
  Typography,
  Button,
  Avatar,
  Dropdown,
  Space,
  Breadcrumb,
  Divider,
  Badge,
  theme
} from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  SettingOutlined,
  LogoutOutlined,
  DashboardOutlined,
  MedicineBoxOutlined,
  UserSwitchOutlined,
  ScheduleOutlined,
  FileTextOutlined,
  BellOutlined,
  SearchOutlined,
  PlusOutlined,
  MenuOutlined
} from '@ant-design/icons';
import RoomManagement from './RoomManagement';
import ServiceManagement from './ServiceManagement';
import DoctorManagement from './DoctorManagement';
import NurseManagement from './NurseManagement';
import ShiftManagement from './ShiftManagement';
import './AdminDashboard.css';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('rooms');
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'rooms',
      icon: <MedicineBoxOutlined />,
      label: 'Quản lý phòng khám',
    },
    {
      key: 'services',
      icon: <FileTextOutlined />,
      label: 'Quản lý dịch vụ',
    },
    {
      key: 'doctors',
      icon: <UserOutlined />,
      label: 'Quản lý nha sĩ',
    },
    {
      key: 'nurses',
      icon: <TeamOutlined />,
      label: 'Quản lý y tá',
    },
    {
      key: 'schedule',
      icon: <CalendarOutlined />,
      label: 'Quản lý lịch làm việc',
      children: [
        {
          key: 'shift-management',
          icon: <ScheduleOutlined />,
          label: 'Quản lý ca làm việc',
        },
        {
          key: 'schedule-management',
          icon: <CalendarOutlined />,
          label: 'Quản lý lịch làm việc',
        },
      ],
    },
    {
      key: 'patients',
      icon: <UserOutlined />,
      label: 'Quản lý bệnh nhân',
    },
    {
      key: 'appointments',
      icon: <CalendarOutlined />,
      label: 'Quản lý lịch hẹn',
    },
    {
      key: 'reports',
      icon: <FileTextOutlined />,
      label: 'Báo cáo',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
    },
  ];

  const handleMenuClick = ({ key }) => {
    setSelectedKey(key);
  };

  const getCurrentLabel = () => {
    const findLabel = (items, key) => {
      for (const item of items) {
        if (item.key === key) return item.label;
        if (item.children) {
          const childLabel = findLabel(item.children, key);
          if (childLabel) return childLabel;
        }
      }
      return null;
    };
    return findLabel(menuItems, selectedKey) || 'Dashboard';
  };

  const getBreadcrumbItems = () => {
    const items = [
      { title: <HomeOutlined /> },
      { title: 'Admin' },
      { title: getCurrentLabel() },
    ];
    return items;
  };

  const renderContent = () => {
    switch (selectedKey) {
      case 'rooms':
        return <RoomManagement />;
      case 'services':
        return <ServiceManagement />;
      case 'doctors':
        return <DoctorManagement />;
      case 'nurses':
        return <NurseManagement />;
      case 'shift-management':
        return <ShiftManagement />;
      case 'schedule-management':
        return (
          <Card>
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <CalendarOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
              <Title level={3}>📋 Quản lý lịch làm việc</Title>
              <Text type="secondary">Chức năng quản lý lịch làm việc sẽ sớm có mặt!</Text>
            </div>
          </Card>
        );
      case 'dashboard':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <Card>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong>Tổng số phòng</Text>
                  <Badge count={12} style={{ backgroundColor: '#52c41a' }} />
                </div>
                <Text type="secondary">Phòng khám hiện có</Text>
              </Space>
            </Card>
            <Card>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong>Nha sĩ</Text>
                  <Badge count={8} style={{ backgroundColor: '#1890ff' }} />
                </div>
                <Text type="secondary">Đang làm việc</Text>
              </Space>
            </Card>
            <Card>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong>Lịch hẹn hôm nay</Text>
                  <Badge count={25} style={{ backgroundColor: '#fa8c16' }} />
                </div>
                <Text type="secondary">Cần xử lý</Text>
              </Space>
            </Card>
            <Card>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong>Bệnh nhân mới</Text>
                  <Badge count={5} style={{ backgroundColor: '#722ed1' }} />
                </div>
                <Text type="secondary">Trong tuần này</Text>
              </Space>
            </Card>
          </div>
        );
      default:
        return (
          <Card>
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <SettingOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
              <Title level={3}>🚧 Tính năng đang phát triển</Title>
              <Text type="secondary">Chức năng "{getCurrentLabel()}" sẽ sớm có mặt!</Text>
            </div>
          </Card>
        );
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ cá nhân',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: colorBgContainer,
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
        }}
      >
        <div style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
            {collapsed ? 'SD' : 'SmileDental'}
          </Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ height: 'calc(100% - 64px)', borderRight: 0 }}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      
      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: colorBgContainer, 
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuOutlined /> : <MenuOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          
          <Space size="large">
            <Button type="text" icon={<BellOutlined />} />
            <Button type="text" icon={<SearchOutlined />} />
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <Text strong>Admin</Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        
        <Content style={{ margin: '0px 16px', padding: '24px', background: colorBgContainer, borderRadius: borderRadiusLG }}>
          <div style={{ marginBottom: '24px' }}>
            <Breadcrumb items={getBreadcrumbItems()} />
            <Divider style={{ margin: '16px 0' }} />
          </div>
          
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
