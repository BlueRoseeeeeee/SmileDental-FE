import React, { useState, useEffect } from 'react';
import { roomService } from '../utils/roomService';
import Toast from './Toast';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({ name: '', maxDoctors: 1, maxNurses: 1 });

  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });

  useEffect(() => { fetchRooms(); }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const data = await roomService.list();
      setRooms(Array.isArray(data) ? data : (data?.data || []));
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally { setLoading(false); }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return fetchRooms();
    setLoading(true);
    try {
      const data = await roomService.search(searchTerm.trim());
      setRooms(Array.isArray(data) ? data : (data?.data || []));
    } catch (error) {
      console.error('Error searching rooms:', error);
    } finally { setLoading(false); }
  };

  const showToast = (message, type = 'info') => setToast({ isVisible: true, message, type });
  const hideToast = () => setToast(prev => ({ ...prev, isVisible: false }));

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      await roomService.create(formData);
      setFormData({ name: '', maxDoctors: 1, maxNurses: 1 });
      setShowCreateForm(false);
      fetchRooms();
      showToast('Tạo phòng khám thành công!', 'success');
    } catch (error) {
      console.error('Error creating room:', error);
      showToast('Có lỗi xảy ra khi tạo phòng khám!', 'error');
    }
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    try {
      await roomService.update(editingRoom._id, formData);
      setEditingRoom(null);
      setFormData({ name: '', maxDoctors: 1, maxNurses: 1 });
      fetchRooms();
      showToast('Cập nhật phòng khám thành công!', 'success');
    } catch (error) {
      console.error('Error updating room:', error);
      showToast('Có lỗi xảy ra khi cập nhật phòng khám!', 'error');
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({ name: room.name, maxDoctors: room.maxDoctors, maxNurses: room.maxNurses });
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingRoom(null);
    setFormData({ name: '', maxDoctors: 1, maxNurses: 1 });
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN');

  return (
    <div className="room-management">
      <div className="card room-header">
        <h2>Quản lý phòng khám</h2>
        <button className="btn-create" onClick={() => setShowCreateForm(true)}>+ Thêm phòng khám</button>
      </div>

      <div className="card search-section">
        <div className="search-box">
          <input type="text" placeholder="Tìm kiếm phòng khám..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
          <button className="btn-ghost" onClick={handleSearch}>Tìm kiếm</button>
        </div>
      </div>

      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Thêm phòng khám mới</h3>
            <form onSubmit={handleCreateRoom}>
              <div className="form-grid">
                <div>
                  <label className="label">Tên phòng khám</label>
                  <input className="control" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div>
                  <label className="label">Số lượng bác sĩ tối đa</label>
                  <input type="number" min="1" className="control" value={formData.maxDoctors} onChange={(e) => setFormData({ ...formData, maxDoctors: parseInt(e.target.value) })} required />
                </div>
                <div>
                  <label className="label">Số lượng y tá tối đa</label>
                  <input type="number" min="1" className="control" value={formData.maxNurses} onChange={(e) => setFormData({ ...formData, maxNurses: parseInt(e.target.value) })} required />
                </div>
              </div>
              <div className="actions">
                <button type="submit" className="btn btn-primary">Lưu</button>
                <button type="button" className="btn btn-ghost" onClick={handleCancel}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingRoom && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Cập nhật phòng khám</h3>
            <form onSubmit={handleUpdateRoom}>
              <div className="form-grid">
                <div>
                  <label className="label">Tên phòng khám</label>
                  <input className="control" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div>
                  <label className="label">Số lượng bác sĩ tối đa</label>
                  <input type="number" min="1" className="control" value={formData.maxDoctors} onChange={(e) => setFormData({ ...formData, maxDoctors: parseInt(e.target.value) })} required />
                </div>
                <div>
                  <label className="label">Số lượng y tá tối đa</label>
                  <input type="number" min="1" className="control" value={formData.maxNurses} onChange={(e) => setFormData({ ...formData, maxNurses: parseInt(e.target.value) })} required />
                </div>
              </div>
              <div className="actions">
                <button type="submit" className="btn btn-primary">Cập nhật</button>
                <button type="button" className="btn btn-ghost" onClick={handleCancel}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="rooms-table">
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tên phòng khám</th>
                <th>Số lượng bác sĩ</th>
                <th>Số lượng y tá</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id}>
                  <td>{room.name}</td>
                  <td>{room.maxDoctors}</td>
                  <td>{room.maxNurses}</td>
                  <td><span className={`status ${room.isActive ? 'active' : 'inactive'}`}>{room.isActive ? 'Hoạt động' : 'Không hoạt động'}</span></td>
                  <td>{room.createdAt ? formatDate(room.createdAt) : '-'}</td>
                  <td><button className="btn-ghost" onClick={() => handleEdit(room)}>Sửa</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />
    </div>
  );
};

export default RoomManagement;
