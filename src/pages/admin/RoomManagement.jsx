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
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  MedicineBoxOutlined,
  UserOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { roomService } from '../../utils/roomService';
import { useToast } from '../../components/common/useToast';

const { Title, Text } = Typography;
const { Search } = Input;

const RoomManagement = () => {
  const { show: showToast } = useToast();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [form] = Form.useForm();
  const [subRoomsForm] = Form.useForm();
  
  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,           // Trang hiện tại
    pageSize: 10,         // Số items per page
    total: 0,             // Tổng số items
    showSizeChanger: true, // Cho phép thay đổi page size
    showQuickJumper: true, // Cho phép nhảy nhanh đến trang
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} phòng khám`,
    pageSizeOptions: ['2','5','10'], // Các tùy chọn page size
  });

  useEffect(() => { 
    fetchRooms(); 
  }, []);

  const fetchRooms = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const data = await roomService.list(page, pageSize);
      setRooms(data?.rooms || []);
      setPagination(prev => ({
        ...prev,
        current: data?.page || page,
        total: data?.total || 0,
        pageSize: data?.limit || pageSize,
      }));
    } catch (error) {
      console.error('Error fetching rooms:', error);
      showToast('Có lỗi xảy ra khi tải danh sách phòng khám!', 'error');
    } finally { 
      setLoading(false); 
    }
  };

  const handleSearch = async (page = 1, pageSize = pagination.pageSize) => {
    if (!searchTerm.trim()) return fetchRooms(page, pageSize);
    setLoading(true);
    try {
      const data = await roomService.search(searchTerm.trim(), page, pageSize);
      
      // Xử lý dữ liệu phòng - dựa trên cấu trúc API thực tế
      setRooms(data?.rooms || []);
      
      // Cập nhật thông tin phân trang
      setPagination(prev => ({
        ...prev,
        current: data?.page || page,
        total: data?.total || 0,
        pageSize: data?.limit || pageSize,
      }));
    } catch (error) {
      console.error('Error searching rooms:', error);
      showToast('Có lỗi xảy ra khi tìm kiếm phòng khám!', 'error');
    } finally { 
      setLoading(false); 
    }
  };

  const handleCreateRoom = async (values) => {
    try {
      const validSubRooms = values.subRooms
        .map((subRoom, index) => ({
          ...subRoom,
          name: subRoom.name.trim() || `Ghế ${index + 1}`
        }))
        .filter(subRoom => subRoom.maxDoctors > 0 && subRoom.maxNurses > 0);
      
      await roomService.create({
        name: values.name,
        subRooms: validSubRooms
      });
      
      form.resetFields();
      setShowCreateForm(false);
      // Reset về trang đầu tiên sau khi tạo mới
      setPagination(prev => ({ ...prev, current: 1 }));
      fetchRooms(1, pagination.pageSize);
      showToast('Tạo phòng khám thành công!', 'success');
    } catch (error) {
      console.error('Error creating room:', error);
      showToast(error.message || 'Có lỗi xảy ra khi tạo phòng khám!', 'error');
    }
  };

  const handleUpdateRoom = async (values) => {
    try {
      const validSubRooms = values.subRooms
        .map((subRoom, index) => ({
          ...subRoom,
          name: subRoom.name.trim() || `Ghế ${index + 1}`
        }))
        .filter(subRoom => subRoom.maxDoctors > 0 && subRoom.maxNurses > 0);
      
      await roomService.update(editingRoom._id, {
        name: values.name,
        subRooms: validSubRooms
      });
      
      setEditingRoom(null);
      form.resetFields();
      // Giữ nguyên trang hiện tại sau khi cập nhật
      fetchRooms(pagination.current, pagination.pageSize);
      showToast('Cập nhật phòng khám thành công!', 'success');
    } catch (error) {
      console.error('Error updating room:', error);
      showToast(error.message || 'Có lỗi xảy ra khi cập nhật phòng khám!', 'error');
    }
  };

  const handleToggleRoomStatus = async (roomId, currentStatus) => {
    const action = currentStatus ? 'tạm ngưng' : 'kích hoạt';
    
    try {
      await roomService.toggleStatus(roomId);
      // Giữ nguyên trang hiện tại sau khi toggle status
      fetchRooms(pagination.current, pagination.pageSize);
      showToast(`${action.charAt(0).toUpperCase() + action.slice(1)} phòng khám thành công!`, 'success');
    } catch (error) {
      console.error('Error toggling room status:', error);
      showToast(error.message || `Có lỗi xảy ra khi ${action} phòng khám!`, 'error');
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    form.setFieldsValue({
      name: room.name,
      subRooms: room.subRooms?.length > 0 ? room.subRooms : []
    });
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingRoom(null);
    form.resetFields();
  };

  const addSubRoom = () => {
    const currentSubRooms = form.getFieldValue('subRooms') || [];
    form.setFieldsValue({
      subRooms: [...currentSubRooms, { name: '', maxDoctors: 1, maxNurses: 1 }]
    });
  };

  const removeSubRoom = (index) => {
    const currentSubRooms = form.getFieldValue('subRooms') || [];
    form.setFieldsValue({
      subRooms: currentSubRooms.filter((_, i) => i !== index)
    });
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN');

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
      fetchRooms(current, pageSize);
    }
  };

  const columns = [
    {
      title: 'Tên phòng khám',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          {record.subRooms?.length > 0 && (
            <div style={{ marginTop: 8 }}>
              {record.subRooms.map((subRoom, index) => (
                <div key={subRoom._id || index} style={{ fontSize: '12px', color: '#666', marginBottom: 4 }}>
                  <MedicineBoxOutlined style={{ marginRight: 4 }} />
                  {subRoom.name} 
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    (BS: {subRoom.maxDoctors}, YT: {subRoom.maxNurses})
                  </Text>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Số ghế khám',
      dataIndex: 'subRooms',
      key: 'subRoomsCount',
      render: (subRooms) => (
        <Tag color="blue">{subRooms?.length || 0}</Tag>
      ),
    },
    {
      title: 'Tổng nha sĩ',
      key: 'totalDoctors',
      render: (_, record) => {
        const total = record.subRooms?.reduce((sum, sub) => sum + (sub.maxDoctors || 0), 0) || 0;
        return <Tag icon={<UserOutlined />} color="green">{total}</Tag>;
      },
    },
    {
      title: 'Tổng y tá',
      key: 'totalNurses',
      render: (_, record) => {
        const total = record.subRooms?.reduce((sum, sub) => sum + (sub.maxNurses || 0), 0) || 0;
        return <Tag icon={<TeamOutlined />} color="orange">{total}</Tag>;
      },
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
            title={`Bạn có chắc chắn muốn ${record.isActive ? 'tạm ngưng' : 'kích hoạt'} phòng khám này?`}
            onConfirm={() => handleToggleRoomStatus(record._id, record.isActive)}
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

  const renderSubRoomsForm = () => (
    <Form.List name="subRooms">
      {(fields, { add, remove }) => (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Title level={5}>Danh sách ghế khám (tùy chọn)</Title>
            <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
              Thêm ghế khám
            </Button>
          </div>
          
          {fields.map(({ key, name, ...restField }) => (
            <Card 
              key={key} 
              size="small" 
              style={{ marginBottom: 16 }}
              extra={
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={() => remove(name)}
                />
              }
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, 'name']}
                    label="Tên ghế khám"
                    rules={[{ required: false }]}
                  >
                    <Input placeholder="Nhập tên ghế khám" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, 'maxDoctors']}
                    label="Số lượng nha sĩ tối đa"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng nha sĩ!' }]}
                  >
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, 'maxNurses']}
                    label="Số lượng y tá tối đa"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng y tá!' }]}
                  >
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          ))}
        </div>
      )}
    </Form.List>
  );

  return (
    <div>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setShowCreateForm(true)}
          >
            Thêm phòng khám
          </Button>
          <div className="search-box">
          <input 
            type="text" 
            placeholder="Tìm kiếm phòng khám..." 
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
          dataSource={rooms}
          rowKey="_id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          locale={{
            emptyText: <Empty description="Không có phòng khám nào" />
          }}
        />
      </Card>

      <Modal
        title={editingRoom ? 'Cập nhật phòng khám' : 'Thêm phòng khám mới'}
        open={showCreateForm || !!editingRoom}
        onCancel={handleCancel}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingRoom ? handleUpdateRoom : handleCreateRoom}
          initialValues={{
            name: '',
            subRooms: []
          }}
        >
          <Form.Item
            name="name"
            label="Tên phòng khám"
            rules={[{ required: true, message: 'Vui lòng nhập tên phòng khám!' }]}
          >
            <Input placeholder="Nhập tên phòng khám" />
          </Form.Item>
          
          <Divider />
          
          {renderSubRoomsForm()}
          
          <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {editingRoom ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomManagement;
