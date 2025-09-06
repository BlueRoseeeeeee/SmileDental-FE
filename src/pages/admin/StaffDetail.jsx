import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Spin,
  Avatar,
  Divider
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  UserOutlined
} from '@ant-design/icons';
import { staffService } from '../../utils/staffService';
import { useToast } from '../../components/common/useToast';

const { Title, Text } = Typography;

/**
 * Staff Detail Component
 * Displays detailed information of a staff member
 */
const StaffDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch staff details
   */
  const fetchStaffDetails = async () => {
    setLoading(true);
    try {
      const response = await staffService.getById(id);
      setStaff(response.user);
    } catch (error) {
      console.error('Error fetching staff details:', error);
      showToast('Lỗi khi tải thông tin nhân viên', 'error');
      navigate('/admin/staff');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get role display info
   */
  const getRoleInfo = (role) => {
    const roleOptions = [
      { value: 'admin', label: 'Quản trị viên', color: 'red' },
      { value: 'dentist', label: 'Bác sĩ', color: 'blue' },
      { value: 'nurse', label: 'Y tá', color: 'green' },
      { value: 'receptionist', label: 'Lễ tân', color: 'orange' },
      { value: 'manager', label: 'Quản lý', color: 'purple' },
      { value: 'patient', label: 'Bệnh nhân', color: 'cyan' }
    ];
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

  /**
   * Get type display info
   */
  const getTypeInfo = (type) => {
    const typeMap = {
      'fulltime': { label: 'Toàn thời gian', color: 'purple' },
      'parttime': { label: 'Bán thời gian', color: 'orange' },
      'normal': { label: 'Thường', color: 'pink' },
      'null': { label: 'Không xác định', color: 'default' }
    };
    return typeMap[type] || { label: type, color: 'default' };
  };

  /**
   * Get gender display info
   */
  const getGenderInfo = (gender) => {
    const genderMap = {
      'male': { label: 'Nam', color: 'blue' },
      'female': { label: 'Nữ', color: 'pink' },
      'other': { label: 'Khác', color: 'default' }
    };
    return genderMap[gender] || { label: gender, color: 'default' };
  };

  useEffect(() => {
    if (id) {
      fetchStaffDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Đang tải thông tin nhân viên...</Text>
        </div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Text type="danger">Không tìm thấy thông tin nhân viên</Text>
        <br />
        <Button 
          type="primary" 
          onClick={() => navigate('/admin?menu=staff')}
          style={{ marginTop: 16 }}
        >
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const roleInfo = getRoleInfo(staff.role);
  const typeInfo = getTypeInfo(staff.type);
  const genderInfo = getGenderInfo(staff.gender);

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        {/* Header */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Space>
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate('/admin?menu=staff')}
              >
                Quay lại
              </Button>
              <Title level={3} style={{ margin: 0 }}>
                Chi tiết nhân viên
              </Title>
            </Space>
          </Col>
          <Col>
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/staff/edit/${staff._id}`)}
            >
              Chỉnh sửa
            </Button>
          </Col>
        </Row>

        {/* Staff Information */}
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card style={{ textAlign: 'center' }}>
              <Avatar 
                size={120} 
                icon={<UserOutlined />} 
                style={{ backgroundColor: '#1890ff', marginBottom: 16 }}
              />
              <Title level={4} style={{ margin: 0 }}>
                {staff.fullName}
              </Title>
              <Text type="secondary" style={{ fontSize: '16px' }}>
                {staff.email}
              </Text>
            </Card>
          </Col>

          {/* Detailed Information */}
          <Col xs={24} md={16}>
            <Card title="Thông tin chi tiết">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Text strong>Họ và tên:</Text>
                  <br />
                  <Text style={{ fontSize: '16px' }}>{staff.fullName}</Text>
                </Col>
                <Col xs={24} sm={12}>
                  <Text strong>Email:</Text>
                  <br />
                  <Text style={{ fontSize: '16px' }}>{staff.email}</Text>
                </Col>
              </Row>
              
              <Divider />
              
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Text strong>Số điện thoại:</Text>
                  <br />
                  <Text style={{ fontSize: '16px' }}>{formatPhone(staff.phone)}</Text>
                </Col>
                <Col xs={24} sm={12}>
                  <Text strong>Vai trò:</Text>
                  <br />
                  <Tag color={roleInfo.color} style={{ fontSize: '14px' }}>
                    {roleInfo.label}
                  </Tag>
                </Col>
              </Row>
              
              <Divider />
              
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Text strong>Loại:</Text>
                  <br />
                  <Tag color={typeInfo.color} style={{ fontSize: '14px' }}>
                    {typeInfo.label}
                  </Tag>
                </Col>
                <Col xs={24} sm={12}>
                  <Text strong>Giới tính:</Text>
                  <br />
                  <Tag color={genderInfo.color} style={{ fontSize: '14px' }}>
                    {genderInfo.label}
                  </Tag>
                </Col>
              </Row>
              
              <Divider />
              
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Text strong>Ngày sinh:</Text>
                  <br />
                  <Text style={{ fontSize: '16px' }}>{formatDate(staff.dateOfBirth)}</Text>
                </Col>
                <Col xs={24} sm={12}>
                  <Text strong>Trạng thái:</Text>
                  <br />
                  <Tag color={staff.isActive ? 'green' : 'red'} style={{ fontSize: '14px' }}>
                    {staff.isActive ? 'Hoạt động' : 'Không hoạt động'}
                  </Tag>
                </Col>
              </Row>
              
              <Divider />
              
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Text strong>Ngày tạo:</Text>
                  <br />
                  <Text style={{ fontSize: '16px' }}>{formatDate(staff.createdAt)}</Text>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default StaffDetail;
