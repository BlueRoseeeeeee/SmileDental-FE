import React, { useState, useEffect } from 'react';
import { useToast } from '../../components/common/useToast';
import { shiftApiClient } from '../../utils/axiosConfig';
import './ShiftManagement.css';

const ShiftManagement = () => {
  const { show: showToast } = useToast();
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
     const [formData, setFormData] = useState({
     name: '',
     startTime: '',
     endTime: '',
     startHour: '',
     startMinute: '',
     endHour: '',
     endMinute: '',
     isActive: true
   });

  useEffect(() => {
    fetchShifts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchShifts = async () => {
    setLoading(true);
    try {
      const response = await shiftApiClient.get('/shift');
      setShifts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching shifts:', error);
      showToast(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tải danh sách ca làm việc!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const searchShifts = async () => {
    if (!searchTerm.trim()) {
      fetchShifts();
      return;
    }

    setLoading(true);
    try {
      const response = await shiftApiClient.get(`/shift/search?q=${encodeURIComponent(searchTerm)}`);
      setShifts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error searching shifts:', error);
      showToast(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tìm kiếm ca làm việc!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShift = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      showToast('Vui lòng nhập tên ca làm việc!', 'error');
      return;
    }
    if (!formData.startTime) {
      showToast('Vui lòng chọn giờ bắt đầu!', 'error');
      return;
    }
    if (!formData.endTime) {
      showToast('Vui lòng chọn giờ kết thúc!', 'error');
      return;
    }
    if (formData.startTime >= formData.endTime) {
      showToast('Giờ bắt đầu phải nhỏ hơn giờ kết thúc!', 'error');
      return;
    }

    try {
      await shiftApiClient.post('/shift', formData);
      showToast('Tạo ca làm việc thành công!', 'success');
      setShowCreateForm(false);
      resetForm();
      fetchShifts();
    } catch (error) {
      console.error('Error creating shift:', error);
      showToast(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tạo ca làm việc!', 'error');
    }
  };

  const handleUpdateShift = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      showToast('Vui lòng nhập tên ca làm việc!', 'error');
      return;
    }
    if (!formData.startTime) {
      showToast('Vui lòng chọn giờ bắt đầu!', 'error');
      return;
    }
    if (!formData.endTime) {
      showToast('Vui lòng chọn giờ kết thúc!', 'error');
      return;
    }
    if (formData.startTime >= formData.endTime) {
      showToast('Giờ bắt đầu phải nhỏ hơn giờ kết thúc!', 'error');
      return;
    }

    try {
      await shiftApiClient.put(`/shift/${editingShift._id}`, {
        name: formData.name,
        startTime: formData.startTime,
        endTime: formData.endTime
      });
      showToast('Cập nhật ca làm việc thành công!', 'success');
      setEditingShift(null);
      resetForm();
      fetchShifts();
    } catch (error) {
      console.error('Error updating shift:', error);
      showToast(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi cập nhật ca làm việc!', 'error');
    }
  };

  const handleToggleStatus = async (shiftId) => {
    try {
      await shiftApiClient.patch(`/shift/${shiftId}/toggle`);
      showToast('Cập nhật trạng thái thành công!', 'success');
      fetchShifts();
    } catch (error) {
      console.error('Error toggling status:', error);
      showToast(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi cập nhật trạng thái!', 'error');
    }
  };

     const handleEdit = (shift) => {
     setEditingShift(shift);
     // Parse time string to get hour and minute
     const [startHour, startMinute] = shift.startTime.split(':').map(Number);
     const [endHour, endMinute] = shift.endTime.split(':').map(Number);
     setFormData({
       name: shift.name,
       startTime: shift.startTime,
       endTime: shift.endTime,
       startHour: startHour,
       startMinute: startMinute,
       endHour: endHour,
       endMinute: endMinute,
       isActive: shift.isActive
     });
     setShowCreateForm(true);
   };

     const resetForm = () => {
     setFormData({
       name: '',
       startTime: '',
       endTime: '',
       startHour: '',
       startMinute: '',
       endHour: '',
       endMinute: '',
       isActive: true
     });
     setEditingShift(null);
   };

     const handleCancel = () => {
     setShowCreateForm(false);
     setEditingShift(null);
     resetForm();
   };

  return (
    <div className="shift-management">
             <div className="card shift-header">
         <h2>Quản lý ca làm việc</h2>
         <div className="header-actions">
           <span className="total-count">Tổng: {shifts.length} ca</span>
           <button 
             className="btn-primary"
             onClick={() => setShowCreateForm(true)}
           >
             Tạo ca mới
           </button>
         </div>
       </div>

      {showCreateForm && (
                 <div className="card form-section">
           <h3>{editingShift ? 'Cập nhật ca làm việc' : 'Tạo ca làm việc mới'}</h3>
          <form onSubmit={editingShift ? handleUpdateShift : handleCreateShift}>
            <div className="form-row">
              <div className="form-group">
                <label>Tên ca làm việc *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ví dụ: Ca sáng, Ca chiều..."
                  required
                />
              </div>
              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  value={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                  disabled={editingShift}
                >
                  <option value={true}>Hoạt động</option>
                  <option value={false}>Tạm dừng</option>
                </select>
              </div>
            </div>
                         <div className="form-row">
               <div className="form-group">
                 <label>Giờ bắt đầu *</label>
                 <div className="time-input-group">
                   <input
                     type="number"
                     min="0"
                     max="23"
                     placeholder="Giờ"
                     value={formData.startHour || ''}
                                           onChange={(e) => {
                        const value = e.target.value;
                        setFormData({
                          ...formData,
                          startHour: value,
                          startTime: value === '' ? '' : `${value.padStart(2, '0')}:${(formData.startMinute || 0).toString().padStart(2, '0')}`
                        });
                      }}
                      onBlur={(e) => {
                        const value = e.target.value;
                        if (value !== '') {
                          const hour = parseInt(value);
                          if (hour >= 0 && hour <= 23) {
                            setFormData({
                              ...formData,
                              startHour: value, // Giữ nguyên string value thay vì parseInt
                              startTime: `${value.padStart(2, '0')}:${(formData.startMinute || 0).toString().padStart(2, '0')}`
                            });
                          }
                        }
                      }}
                     required
                   />
                   <span className="time-separator">:</span>
                   <input
                     type="number"
                     min="0"
                     max="59"
                     placeholder="Phút"
                     value={formData.startMinute || ''}
                                           onChange={(e) => {
                        const value = e.target.value;
                        setFormData({
                          ...formData,
                          startMinute: value,
                          startTime: value === '' ? '' : `${(formData.startHour || 0).toString().padStart(2, '0')}:${value.padStart(2, '0')}`
                        });
                      }}
                      onBlur={(e) => {
                        const value = e.target.value;
                        if (value !== '') {
                          const minute = parseInt(value);
                          if (minute >= 0 && minute <= 59) {
                            setFormData({
                              ...formData,
                              startMinute: value, // Giữ nguyên string value thay vì parseInt
                              startTime: `${(formData.startHour || 0).toString().padStart(2, '0')}:${value.padStart(2, '0')}`
                            });
                          }
                        }
                      }}
                     required
                   />
                 </div>
               </div>
               <div className="form-group">
                 <label>Giờ kết thúc *</label>
                 <div className="time-input-group">
                   <input
                     type="number"
                     min="0"
                     max="23"
                     placeholder="Giờ"
                     value={formData.endHour || ''}
                                           onChange={(e) => {
                        const value = e.target.value;
                        setFormData({
                          ...formData,
                          endHour: value,
                          endTime: value === '' ? '' : `${value.padStart(2, '0')}:${(formData.endMinute || 0).toString().padStart(2, '0')}`
                        });
                      }}
                      onBlur={(e) => {
                        const value = e.target.value;
                        if (value !== '') {
                          const hour = parseInt(value);
                          if (hour >= 0 && hour <= 23) {
                            setFormData({
                              ...formData,
                              endHour: value, // Giữ nguyên string value thay vì parseInt
                              endTime: `${value.padStart(2, '0')}:${(formData.endMinute || 0).toString().padStart(2, '0')}`
                            });
                          }
                        }
                      }}
                     required
                   />
                   <span className="time-separator">:</span>
                   <input
                     type="number"
                     min="0"
                     max="59"
                     placeholder="Phút"
                     value={formData.endMinute || ''}
                                           onChange={(e) => {
                        const value = e.target.value;
                        setFormData({
                          ...formData,
                          endMinute: value,
                          endTime: value === '' ? '' : `${(formData.endHour || 0).toString().padStart(2, '0')}:${value.padStart(2, '0')}`
                        });
                      }}
                      onBlur={(e) => {
                        const value = e.target.value;
                        if (value !== '') {
                          const minute = parseInt(value);
                          if (minute >= 0 && minute <= 59) {
                            setFormData({
                              ...formData,
                              endMinute: value, // Giữ nguyên string value thay vì parseInt
                              endTime: `${(formData.endHour || 0).toString().padStart(2, '0')}:${value.padStart(2, '0')}`
                            });
                          }
                        }
                      }}
                     required
                   />
                 </div>
               </div>
             </div>
                         <div className="form-actions">
               <button type="button" className="btn-ghost" onClick={handleCancel}>
                 Hủy
               </button>
               <button type="submit" className="btn-primary">
                 {editingShift ? 'Cập nhật' : 'Tạo mới'}
               </button>
             </div>
          </form>
        </div>
      )}

               <div className="card search-section">
           <div className="search-box">
             <input 
               type="text" 
               placeholder="Tìm kiếm ca làm việc theo tên..." 
               value={searchTerm} 
               onChange={(e) => setSearchTerm(e.target.value)}
               onKeyPress={(e) => e.key === 'Enter' && searchShifts()}
             />
             <button className="btn-primary" onClick={searchShifts}>
               Tìm kiếm
             </button>
             <button className="btn-ghost" onClick={fetchShifts}>
               Làm mới
             </button>
           </div>
         </div>

      <div className="card">
                 {loading ? (
           <div className="loading">
             <div className="spinner"></div>
             <p>Đang tải...</p>
           </div>
                 ) : shifts.length === 0 ? (
           <div className="empty">
             <p>Không có dữ liệu</p>
           </div>
        ) : (
          <div className="shifts-table">
            <table>
              <thead>
                <tr>
                  <th>Tên ca</th>
                  <th>Giờ bắt đầu</th>
                  <th>Giờ kết thúc</th>
                  <th>Thời gian</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((shift) => (
                  <tr key={shift._id}>
                    <td>
                      <div className="shift-info">
                        <span className="shift-name">{shift.name}</span>
                      </div>
                    </td>
                    <td>{shift.startTime}</td>
                    <td>{shift.endTime}</td>
                    <td>
                      <span className="duration">
                        {(() => {
                          const start = new Date(`2000-01-01T${shift.startTime}`);
                          const end = new Date(`2000-01-01T${shift.endTime}`);
                          const diff = end - start;
                          const hours = Math.floor(diff / (1000 * 60 * 60));
                          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                          return `${hours}h ${minutes}m`;
                        })()}
                      </span>
                    </td>
                    <td>
                      <span className={`status ${shift.isActive ? 'active' : 'inactive'}`}>
                        {shift.isActive ? 'Đang hoạt động' : 'Đã hủy'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-edit"
                          onClick={() => handleEdit(shift)}
                        >
                          Cập nhật
                        </button>
                        <button 
                          className={`btn-toggle ${shift.isActive ? 'deactivate' : 'activate'}`}
                          onClick={() => handleToggleStatus(shift._id)}
                        >
                          {shift.isActive ? 'Tạm ngưng' : 'Kích hoạt'}
                        </button>
                      </div>
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

export default ShiftManagement;
