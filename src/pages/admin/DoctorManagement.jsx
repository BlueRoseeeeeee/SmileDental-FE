import React, { useState, useEffect } from 'react';
import { useToast } from '../../components/common/Toast';
import { apiClient } from '../../utils/axiosConfig';
import './DoctorManagement.css';

const DoctorManagement = () => {
  const { show: showToast } = useToast();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/user/by-role?role=dentist');
      setDoctors(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      showToast(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tải danh sách nha sĩ!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (doctorId) => {
    try {
      await apiClient.patch(`/user/${doctorId}/toggle-status`);
      showToast('Cập nhật trạng thái thành công!', 'success');
      fetchDoctors(); // Refresh list
    } catch (error) {
      console.error('Error updating status:', error);
      showToast(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi cập nhật trạng thái!', 'error');
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.phone.includes(searchTerm)
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
    <div className="doctor-management">
      <div className="card doctor-header">
        <h2>Quản lý nha sĩ</h2>
        <div className="header-actions">
          <span className="total-count">Tổng: {doctors.length} nha sĩ</span>
        </div>
      </div>

      <div className="card search-section">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Tìm kiếm nha sĩ theo tên, email, số điện thoại..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Đang tải danh sách nha sĩ...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="empty">
            <p>Không tìm thấy nha sĩ nào</p>
          </div>
        ) : (
          <div className="doctors-table">
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
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor._id}>
                    <td>
                      <div className="doctor-info">
                        <span className="doctor-name">{doctor.fullName}</span>
                      </div>
                    </td>
                    <td>{doctor.email}</td>
                    <td>{doctor.phone}</td>
                    <td>{getGenderLabel(doctor.gender)}</td>
                    <td>{formatDate(doctor.dateOfBirth)}</td>
                    <td>
                      <span className={`type-badge type-${doctor.type}`}>
                        {getTypeLabel(doctor.type)}
                      </span>
                    </td>
                    <td>
                      <span className={`status ${doctor.isActive ? 'active' : 'inactive'}`}>
                        {doctor.isActive ? 'Hoạt động' : 'Đã nghỉ việc'}
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

export default DoctorManagement;
