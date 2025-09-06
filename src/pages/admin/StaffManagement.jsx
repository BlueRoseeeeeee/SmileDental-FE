import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Spin,
  Empty,
  Tooltip,
  Avatar
} from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { staffService } from '../../utils/staffService';
import { useToast } from '../../components/common/useToast';
import './StaffManagement.css';

const { Title, Text } = Typography;
const { Option } = Select;

const StaffManagement = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  // State management
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} nhân viên`,
    pageSizeOptions: ['2','5','10']
  });

  const roleOptions = [
    { value: 'admin', label: 'Quản trị viên', color: 'red' },
    { value: 'dentist', label: 'Bác sĩ', color: 'blue' },
    { value: 'nurse', label: 'Y tá', color: 'green' },
    { value: 'receptionist', label: 'Lễ tân', color: 'orange' },
    { value: 'manager', label: 'Quản lý', color: 'purple' },
    { value: 'patient', label: 'Bệnh nhân', color: 'cyan' }
  ];

  /**
   * Fetch staff data from API
   */
  const fetchStaff = async (page = 1, pageSize = 10, role = '', search = '') => {
    setLoading(true);
    try {
      let response;
      if (search) {
        response = await staffService.search(search, page, pageSize);
      } else if (role) {
        response = await staffService.searchByRole(role, page, pageSize);
      } else {
        response = await staffService.list(page, pageSize);
      }
      
      setStaff(response.users || []);
      setPagination(prev => ({
        ...prev,
        current: response.page || 1,
        pageSize: response.limit || 10,
        total: response.total || 0
      }));
    } catch (error) {
      console.error('Error fetching staff:', error);
      showToast('Lỗi khi tải danh sách nhân viên', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle search by name/email
   */
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchStaff(1, pagination.pageSize, selectedRole, searchTerm);
  };

  /**
   * Handle table pagination change
   */
  const handleTableChange = (paginationInfo) => {
    const { current, pageSize } = paginationInfo;
    setPagination(prev => ({ ...prev, current, pageSize }));
    fetchStaff(current, pageSize, selectedRole, searchTerm);
  };

  /**
   * Handle role filter change
   */
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchStaff(1, pagination.pageSize, role, searchTerm);
  };

  /**
   * Handle refresh data
   */
  const handleRefresh = () => {
    fetchStaff(pagination.current, pagination.pageSize, selectedRole, searchTerm);
  };

  /**
   * Handle view staff details
   */
  const handleViewStaff = (id) => {
    navigate(`/admin/staff/detail/${id}`);
  };

  /**
   * Handle edit staff
   */
  const handleEditStaff = (id) => {
    navigate(`/admin/staff/edit/${id}`);
  };


  /**
   * Get role display info
   */
  const getRoleInfo = (role) => {
    return roleOptions.find(option => option.value === role) || 
           { value: role, label: role, color: 'default' };
  };

  /**
   * Format date
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  /**
   * Format phone number
   */
  const formatPhone = (phone) => {
    if (!phone) return 'N/A';
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
  };

  // Table columns configuration
  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (name, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar 
            size="small" 
            icon={<UserOutlined />} 
            style={{ backgroundColor: '#1890ff' }}
          />
          <div>
            <Text strong>{name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.email}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const roleInfo = getRoleInfo(role);
        return (
          <Tag color={roleInfo.color}>
            {roleInfo.label}
          </Tag>
        );
      },
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const typeMap = {
          'fulltime': { label: 'Toàn thời gian', color: 'purple' },
          'parttime': { label: 'Bán thời gian', color: 'orange' },
          'normal': { label: 'Thường', color: 'pink' },
          'null': { label: 'Không xác định', color: 'default' }
        };
        const typeInfo = typeMap[type] || { label: type, color: 'default' };
        return <Tag color={typeInfo.color}>{typeInfo.label}</Tag>;
      },
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => {
        const genderMap = {
          'male': { label: 'Nam', color: 'blue' },
          'female': { label: 'Nữ', color: 'pink' },
          'other': { label: 'Khác', color: 'default' }
        };
        const genderInfo = genderMap[gender] || { label: gender, color: 'default' };
        return <Tag color={genderInfo.color}>{genderInfo.label}</Tag>;
      },
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => <Text>{formatPhone(phone)}</Text>,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (date) => <Text>{formatDate(date)}</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => handleViewStaff(record._id)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleEditStaff(record._id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]; 
  
  useEffect(() => {
    fetchStaff();
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        {/* Search and Filter Section */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Lọc theo vai trò"
              value={selectedRole}
              onChange={handleRoleChange}
              allowClear
              style={{ width: '100%' }}
              size="large"
            >
              {roleOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  <span style={{ fontSize: '16px', fontWeight: '500' }}>
                    {option.label}
                  </span>
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Tìm kiếm theo tên hoặc email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              suffix={<SearchOutlined />}
              size="large"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button 
              type="primary" 
              icon={<SearchOutlined />} 
              onClick={handleSearch}
              style={{ width: '100%' }}
              size="large"
            >
              Tìm kiếm
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button 
              type="default" 
              icon={<ReloadOutlined />} 
              onClick={handleRefresh}
              loading={loading}
              style={{ width: '100%' }}
              size="large"
            >
              Làm mới
            </Button>
          </Col>
        </Row>

        {/* Staff Table */}
        <Table
          columns={columns}
          dataSource={staff}
          rowKey="_id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          locale={{
            emptyText: (
              <Empty 
                description="Không có nhân viên nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default StaffManagement;
