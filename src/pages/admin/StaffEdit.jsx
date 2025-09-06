import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Space,
  Typography,
  Row,
  Col,
  Spin,
  Switch
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { staffService } from '../../utils/staffService';
import { useToast } from '../../components/common/useToast';

const { Title, Text } = Typography;
const { Option } = Select;

/**
 * Staff Edit Component
 * Edit staff information
 */
const StaffEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [staff, setStaff] = useState(null);

  /**
   * Fetch staff details for editing
   */
  const fetchStaffDetails = async () => {
    setLoading(true);
    try {
      const response = await staffService.getById(id);
      setStaff(response.user);
      
      // Set form values
      form.setFieldsValue({
        fullName: response.user.fullName,
        email: response.user.email,
        phone: response.user.phone,
        role: response.user.role,
        type: response.user.type,
        gender: response.user.gender,
        dateOfBirth: response.user.dateOfBirth ? dayjs(response.user.dateOfBirth) : null,
        isActive: response.user.isActive
      });
    } catch (error) {
      console.error('Error fetching staff details:', error);
      showToast('Lỗi khi tải thông tin nhân viên', 'error');
      navigate('/admin/staff');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      // Format data according to API structure
      const formattedData = {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.toISOString() : null,
        type: values.type,
        isActive: values.isActive
      };
      
      console.log('Sending data:', formattedData); // Debug log
      
      await staffService.update(id, formattedData);
      showToast('Cập nhật thông tin nhân viên thành công', 'success');
      navigate(`/admin/staff/detail/${id}`);
    } catch (error) {
      console.error('Error updating staff:', error);
      showToast('Lỗi khi cập nhật thông tin nhân viên', 'error');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    navigate(`/admin/staff/detail/${id}`);
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

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        {/* Header */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Space>
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={handleCancel}
              >
                Quay lại
              </Button>
              <Title level={3} style={{ margin: 0 }}>
                Chỉnh sửa nhân viên
              </Title>
            </Space>
          </Col>
        </Row>

        {/* Edit Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ maxWidth: 800 }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
              >
                <Input placeholder="Nhập họ và tên" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' }
                ]}
              >
                <Input placeholder="Nhập email" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
              >
                <Input placeholder="Nhập số điện thoại" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="gender"
                label="Giới tính"
                rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
              >
                <Select placeholder="Chọn giới tính" size="large">
                  <Option value="male">Nam</Option>
                  <Option value="female">Nữ</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="dateOfBirth"
                label="Ngày sinh"
                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  placeholder="Chọn ngày sinh"
                  format="DD/MM/YYYY"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="type"
                label="Loại"
                rules={[{ required: true, message: 'Vui lòng chọn loại' }]}
              >
                <Select placeholder="Chọn loại" size="large">
                  <Option value="fulltime">Toàn thời gian</Option>
                  <Option value="parttime">Bán thời gian</Option>
                  <Option value="normal">Thường</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="isActive"
            label="Trạng thái hoạt động"
            valuePropName="checked"
          >
            <Switch 
              checkedChildren="Hoạt động" 
              unCheckedChildren="Không hoạt động"
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 32, textAlign: 'right' }}>
            <Space size="large">
              <Button 
                size="large"
                onClick={handleCancel}
              >
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />}
                loading={saving}
                size="large"
              >
                Lưu thay đổi
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default StaffEdit;
