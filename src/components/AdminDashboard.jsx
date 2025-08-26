import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoomManagement from './RoomManagement';
import './admin.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('rooms');

  const menuItems = [
    { id: 'rooms', label: 'Quản lý phòng khám', icon: '🏥' },
    {id:'services', label:'Quản lý dịch vụ', icon:''},
    { id: 'doctors', label: 'Quản lý bác sĩ', icon: '👨‍⚕️' },
    { id: 'nurses', label: 'Quản lý y tá', icon: '👩‍⚕️' },
    { id: 'patients', label: 'Quản lý bệnh nhân', icon: '👥' },
    { id: 'appointments', label: 'Quản lý lịch hẹn', icon: '📅' },
    { id: 'reports', label: 'Báo cáo', icon: '📈' },
    { id: 'settings', label: 'Cài đặt', icon: '⚙️' }
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'rooms':
        return <RoomManagement />;
      default:
        return (
          <div className="coming-soon card">
            <h2>🚧 Tính năng đang phát triển</h2>
            <p>Chức năng "{menuItems.find(item => item.id === activeMenu)?.label}" sẽ sớm có mặt!</p>
          </div>
        );
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>🏥 SmileDental</h2>
          <p>Admin Dashboard</p>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => setActiveMenu(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button 
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/login');
            }}
          >
            <span>🚪</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      <div className="main-content">
        <header className="content-header">
          <h1>{menuItems.find(item => item.id === activeMenu)?.label}</h1>
          <div className="user-info">
            <span>👤 Admin</span>
          </div>
        </header>
        <div className="content-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
