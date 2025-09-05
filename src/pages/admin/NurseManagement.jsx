import React, { useState, useEffect } from 'react';
import { useToast } from '../../components/common/useToast';
import { apiClient } from '../../utils/axiosConfig';
import './NurseManagement.css';

const NurseManagement = () => {
  const { show: showToast } = useToast();
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNurses();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchNurses = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/user/by-role?role=nurse');
      setNurses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching nurses:', error);
      showToast(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tải danh sách y tá!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (nurseId) => {
    try {
      await apiClient.patch(`/user/${nurseId}/toggle-status`);
      showToast('Cập nhật trạng thái thành công!', 'success');
      fetchNurses(); // Refresh list
    } catch (error) {
      console.error('Error updating status:', error);
      showToast(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi cập nhật trạng thái!', 'error');
    }
  };

  const filteredNurses = nurses.filter(nurse =>
    nurse.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nurse.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nurse.phone.includes(searchTerm)
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'fulltime': return 'Toàn thời gian';
      case 'parttime': return 'Bán thời gian';
      case 'normal': return 'Thường';
      default: return type;
    }
  };

  const getGenderLabel = (gender) => {
    switch (gender) {
      case 'male': return 'Nam';
      case 'female': return 'Nữ';
      case 'other': return 'Khác';
      default: return gender;
    }
  };

  return (
    <div className="nurse-management">
      
      <div className="card search-section">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Tìm kiếm y tá theo tên, email, số điện thoại..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>
      <div className="total-count-wrapper">
          <span className="total-count" style={{background: '#166534', color: 'white', padding: '10px 30px'}}>Tổng: {nurses.length} y tá</span>
        </div>
      <div className="card">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Đang tải danh sách y tá...</p>
          </div>
        ) : filteredNurses.length === 0 ? (
          <div className="empty">
            <p>Không tìm thấy y tá nào</p>
          </div>
        ) : (
          <div className="nurses-table">
            <table>
              <thead>
                <tr>
                  <th>Họ và tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Giới tính</th>
                  <th>Ngày sinh</th>
                  <th>Loại</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredNurses.map((nurse) => (
                  <tr key={nurse._id}>
                    <td>
                      <div className="nurse-info">
                        <span className="nurse-name">{nurse.fullName}</span>
                      </div>
                    </td>
                    <td>{nurse.email}</td>
                    <td>{nurse.phone}</td>
                    <td>{getGenderLabel(nurse.gender)}</td>
                    <td>{formatDate(nurse.dateOfBirth)}</td>
                    <td>
                      <span className={`type-badge type-${nurse.type}`}>
                        {getTypeLabel(nurse.type)}
                      </span>
                    </td>
                    <td>
                      <span className={`status ${nurse.isActive ? 'active' : 'inactive'}`}>
                        {nurse.isActive ? 'Hoạt động' : 'Đã nghỉ việc'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default NurseManagement;
