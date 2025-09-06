import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Modal,
  Form,
  InputNumber,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Divider,
  Popconfirm,
  Spin,
  Empty,
  Tooltip,
  Checkbox,
  Select
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  MedicineBoxOutlined,
  DollarOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { serviceService } from '../../utils/serviceService';
import { useToast } from '../../components/common/useToast';
import './ServiceManagement.css';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const ServiceManagement = () => {
  const { show: showToast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form] = Form.useForm();
  
  // Service type options
  const serviceTypeOptions = [
    { value: 'exam', label: 'Khám' },
    { value: 'treatment', label: 'Điều trị' }
  ];
  
  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,           // Trang hiện tại
    pageSize: 10,         // Số items per page
    total: 0,             // Tổng số items
    showSizeChanger: true, // Cho phép thay đổi page size
    showQuickJumper: true, // Cho phép nhảy nhanh đến trang
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} dịch vụ`,
    pageSizeOptions: ['2','5','10'], // Các tùy chọn page size
  });

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const data = await serviceService.list(page, pageSize);
      setServices(data?.services || []);
      setPagination(prev => ({
        ...prev,
        current: data?.page || page,
        total: data?.total || 0,
        pageSize: data?.limit || pageSize,
      }));
    } catch (error) {
      console.error('Error fetching services:', error);
      showToast('Có lỗi xảy ra khi tải danh sách dịch vụ!', 'error');
    } finally { setLoading(false); }
  };

  const handleSearch = async (page = 1, pageSize = pagination.pageSize) => {
    if (!searchTerm.trim()) return fetchServices(page, pageSize);
    setLoading(true);
    try {
      const data = await serviceService.search(searchTerm.trim(), page, pageSize);
      setServices(data?.services || []);
      setPagination(prev => ({
        ...prev,
        current: data?.page || page,
        total: data?.total || 0,
        pageSize: data?.limit || pageSize,
      }));
    } catch (error) {
      console.error('Error searching services:', error);
      showToast('Có lỗi xảy ra khi tìm kiếm dịch vụ!', 'error');
    } finally { setLoading(false); }
  };

  // Xử lý thay đổi trang
  const handleTableChange = (paginationInfo) => {
    const { current, pageSize } = paginationInfo;
    
    // Cập nhật pagination state
    setPagination(prev => ({
      ...prev,
      current,
      pageSize,
    }));
    
    // Gọi API với trang mới
    if (searchTerm.trim()) {
      handleSearch(current, pageSize);
    } else {
      fetchServices(current, pageSize);
    }
  };

  // Format tiền Việt Nam
  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };


  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN');

  // Formatter cho số tiền VNĐ
  const formatVND = (value) => {
    if (!value) return '';
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const columns = [
    {
      title: 'Tên dịch vụ',
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <Text>{name}</Text>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 200, // Đặt chiều rộng cố định
      ellipsis: true, // Cắt ngắn text dài
      render: (text, record) => (
        <div>
          <Text ellipsis={{ tooltip: text }}>{text}</Text>
        </div>
      ),
    },
    ,
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const typeOption = serviceTypeOptions.find(option => option.value === type);
        return (
          <Tag color={type === 'exam' ? 'green' : 'blue'}>
            {typeOption ? typeOption.label : type}
          </Tag>
        );
      },
    },
    {
      title: 'Thời gian',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => (
        <Tag color="green" icon={<ClockCircleOutlined />}>
          {duration} phút
        </Tag>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => (
        <Text strong style={{ color: '#52c41a' }}>
          {formatCurrency(price)}
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'status',
      render: (isActive) => (
        <Tag color={isActive ? 'success' : 'error'}>
          {isActive ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => date ? formatDate(date) : '-',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title={`Bạn có chắc chắn muốn ${record.isActive ? 'tạm ngưng' : 'kích hoạt'} dịch vụ này?`}
            onConfirm={() => handleToggleServiceStatus(record._id, record.isActive)}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title={record.isActive ? 'Tạm ngưng' : 'Kích hoạt'}>
              <Button 
                type={record.isActive ? "default" : "primary"}
                size="small"
                style={{ 
                  minWidth: '80px',
                  borderRadius: '6px'
                }}
              >
                {record.isActive ? 'Tạm ngưng' : 'Kích hoạt'}
              </Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEdit = (service) => {
    setEditingService(service);
    form.setFieldsValue({
      name: service.name,
      type: service.type,
      duration: service.duration,
      price: service.price,
      description: service.description,
      requireExamFirst: service.requireExamFirst
    });
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingService(null);
    form.resetFields();
  };

  const handleCreateService = async (values) => {
         try {
       await serviceService.create({
        ...values,
        duration: parseInt(values.duration),
        price: parseInt(values.price)
      });
      
      form.resetFields();
      setShowCreateForm(false);
      // Reset về trang đầu tiên sau khi tạo mới
      setPagination(prev => ({ ...prev, current: 1 }));
      fetchServices(1, pagination.pageSize);
      showToast('Tạo dịch vụ thành công!', 'success');
    } catch (error) {
      console.error('Error creating service:', error);
      showToast(error.message || 'Có lỗi xảy ra khi tạo dịch vụ!', 'error');
    }
  };

  const handleUpdateService = async (values) => {
         try {
       await serviceService.update(editingService._id, {
        ...values,
        duration: parseInt(values.duration),
        price: parseInt(values.price)
       });
      
      setEditingService(null);
      form.resetFields();
      // Giữ nguyên trang hiện tại sau khi cập nhật
      fetchServices(pagination.current, pagination.pageSize);
      showToast('Cập nhật dịch vụ thành công!', 'success');
    } catch (error) {
      console.error('Error updating service:', error);
      showToast(error.message || 'Có lỗi xảy ra khi cập nhật dịch vụ!', 'error');
    }
  };

  const handleToggleServiceStatus = async (serviceId, currentStatus) => {
    const action = currentStatus ? 'tạm ngưng' : 'kích hoạt';
    
    try {
      await serviceService.toggleStatus(serviceId);
      // Giữ nguyên trang hiện tại sau khi toggle status
      fetchServices(pagination.current, pagination.pageSize);
      showToast(`${action.charAt(0).toUpperCase() + action.slice(1)} dịch vụ thành công!`, 'success');
    } catch (error) {
      console.error('Error toggling service status:', error);
      showToast(error.message || `Có lỗi xảy ra khi ${action} dịch vụ!`, 'error');
    }
  };

  return (
    <div>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setShowCreateForm(true)}
          >
            Thêm dịch vụ
          </Button>
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Tìm kiếm dịch vụ theo tên" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && (() => {
                setPagination(prev => ({ ...prev, current: 1 }));
                handleSearch(1, pagination.pageSize);
              })()} 
            />
            <button className="btn-ghost" onClick={() => {
              setPagination(prev => ({ ...prev, current: 1 }));
              handleSearch(1, pagination.pageSize);
            }}>Tìm kiếm</button>
          </div>
        </Row>

        <Table
          columns={columns}
          dataSource={services}
          rowKey="_id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          locale={{
            emptyText: <Empty description="Không có dịch vụ nào" />
          }}
        />
      </Card>

      <Modal
        title={editingService ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ mới'}
        open={showCreateForm || !!editingService}
        onCancel={handleCancel}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingService ? handleUpdateService : handleCreateService}
          initialValues={{
            name: '',
            type: 'exam',
            duration: '',
            price: 0,
            description: '',
            requireExamFirst: false
          }}
        >
          <Form.Item
            name="name"
            label="Tên dịch vụ"
            rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
          >
            <Input placeholder="Nhập tên dịch vụ" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại dịch vụ"
            rules={[{ required: true, message: 'Vui lòng chọn loại dịch vụ!' }]}
          >
            <Select placeholder="Chọn loại dịch vụ" size="large">
              {serviceTypeOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="duration"
                label="Thời gian (phút)"
                rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập thời gian" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Giá"
                rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
              >
                <InputNumber 
                  min={0} 
                  style={{ width: '100%' }} 
                  placeholder="Nhập giá"
                  formatter={formatVND}
                  addonAfter="VNĐ"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea rows={3} placeholder="Nhập mô tả dịch vụ" />
          </Form.Item>

          <Form.Item
            name="requireExamFirst"
            valuePropName="checked"
          >
            <Checkbox>Yêu cầu khám trước</Checkbox>
          </Form.Item>

          <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {editingService ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceManagement;