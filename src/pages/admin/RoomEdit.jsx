import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Card,
  Button,
  Form,
  Input,
  InputNumber,
  Space,
  Typography,
  Row,
  Col,
  Divider,
  Spin
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { roomService } from '../../utils/roomService';
import { useToast } from '../../components/common/useToast';

const { Title, Text } = Typography;

/**
 * Room Edit Component
 * Edit room information with sub-rooms
 */
const RoomEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { show: showToast } = useToast();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [room, setRoom] = useState(null);

  const fetchRoomDetails = async () => {
    setLoading(true);
    try {
      let roomData;
      if (location.state?.roomData) {
        roomData = location.state.roomData;
      } else {
        const roomsResponse = await roomService.list(1, 1000);
        const foundRoom = roomsResponse.rooms?.find(room => room._id === id);
        if (!foundRoom) {
          throw new Error('Không tìm thấy phòng khám với ID này');
        }
        roomData = foundRoom;
      }
      
      setRoom(roomData);
      
      // Set form values
      form.setFieldsValue({
        name: roomData.name,
        subRooms: roomData.subRooms?.length > 0 ? roomData.subRooms : []
      });
    } catch (error) {
      showToast('Lỗi khi tải thông tin phòng khám', 'error');
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
      const validSubRooms = values.subRooms
        .map((subRoom, index) => ({
          ...subRoom,
          name: subRoom.name.trim() || `Ghế ${index + 1}`
        }))
        .filter(subRoom => subRoom.maxDoctors > 0 && subRoom.maxNurses > 0);
      
      await roomService.update(id, {
        name: values.name,
        subRooms: validSubRooms
      });
      console.log('Cập nhật phòng khám thành công');
      showToast('Cập nhật phòng khám thành công', 'success');
      navigate(-1);
    } catch (error) {
      showToast('Lỗi khi cập nhật phòng khám', 'error');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    navigate('/admin?menu=rooms');
  };

  /**
   * Add new sub-room
   */
  const addSubRoom = () => {
    const currentSubRooms = form.getFieldValue('subRooms') || [];
    form.setFieldsValue({
      subRooms: [...currentSubRooms, { name: '', maxDoctors: 1, maxNurses: 1 }]
    });
  };

  /**
   * Remove sub-room
   */
  const removeSubRoom = (index) => {
    const currentSubRooms = form.getFieldValue('subRooms') || [];
    form.setFieldsValue({
      subRooms: currentSubRooms.filter((_, i) => i !== index)
    });
  };

  useEffect(() => {
    if (id) {
      fetchRoomDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Đang tải thông tin phòng khám...</Text>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Text type="danger">Không tìm thấy thông tin phòng khám</Text>
        <br />
        <Button 
          type="primary" 
          onClick={() => navigate('/admin?menu=rooms')}
          style={{ marginTop: 16 }}
        >
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  /**
   * Render sub-rooms form
   */
  const renderSubRoomsForm = () => (
    <Form.List name="subRooms">
      {(fields, { add, remove }) => (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Title level={5}>Danh sách ghế khám</Title>
            <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
              Thêm ghế khám
            </Button>
          </div>
          
          {fields.map(({ key, name, ...restField }) => {
            const isExistingSubRoom = room.subRooms?.[name]?._id;
            
            return (
              <Card 
                key={key} 
                size="small" 
                style={{ marginBottom: 16 }}
                extra={
                  !isExistingSubRoom && (
                    <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                    />
                  )
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
                      <Input placeholder="Nhập tên ghế khám" size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      {...restField}
                      name={[name, 'maxDoctors']}
                      label="Số lượng nha sĩ tối đa"
                      rules={[{ required: true, message: 'Vui lòng nhập số lượng nha sĩ!' }]}
                    >
                      <InputNumber min={1} style={{ width: '100%' }} size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      {...restField}
                      name={[name, 'maxNurses']}
                      label="Số lượng y tá tối đa"
                      rules={[{ required: true, message: 'Vui lòng nhập số lượng y tá!' }]}
                    >
                      <InputNumber min={1} style={{ width: '100%' }} size="large" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            );
          })}
        </div>
      )}
    </Form.List>
  );

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
                Chỉnh sửa phòng khám
              </Title>
            </Space>
          </Col>
        </Row>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ maxWidth: 1000 }}
        >
          <Form.Item
            name="name"
            label="Tên phòng khám"
            rules={[{ required: true, message: 'Vui lòng nhập tên phòng khám!' }]}
          >
            <Input placeholder="Nhập tên phòng khám" size="large" />
          </Form.Item>
          
          <Divider />
          
          {renderSubRoomsForm()}
          
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

export default RoomEdit;
