import React, { useState, useEffect } from 'react';
import { serviceService } from '../../utils/serviceService';
import { useToast } from '../../components/common/Toast';
import './ServiceManagement.css';

const ServiceManagement = () => {
  const { show: showToast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    duration: '',
    price: 0,
    description: '',
    requireExamFirst: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await serviceService.list();
      setServices(Array.isArray(data) ? data : (data?.data || []));
    } catch (error) {
      console.error('Error fetching services:', error);
      showToast('Có lỗi xảy ra khi tải danh sách dịch vụ!', 'error');
    } finally { setLoading(false); }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return fetchServices();
    setLoading(true);
    try {
      const data = await serviceService.search(searchTerm.trim());
      setServices(Array.isArray(data) ? data : (data?.data || []));
    } catch (error) {
      console.error('Error searching services:', error);
      showToast('Có lỗi xảy ra khi tìm kiếm dịch vụ!', 'error');
    } finally { setLoading(false); }
  };



  // Format tiền Việt Nam
  const formatCurrency = (value) => {
    if (!value) return '';
    // Loại bỏ tất cả ký tự không phải số
    const numericValue = value.toString().replace(/[^\d]/g, '');
    if (!numericValue) return '';
    // Format với dấu phẩy ngăn cách hàng nghìn
    return new Intl.NumberFormat('vi-VN').format(parseInt(numericValue));
  };

  // Parse tiền từ format về số
  const parseCurrency = (value) => {
    if (!value) return '';
    // Loại bỏ tất cả ký tự không phải số
    return value.toString().replace(/[^\d]/g, '');
  };

  // Validate form data
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'duration':
        if (!value) {
          newErrors.duration = 'Thời gian không được để trống';
        } else if (isNaN(value) || parseInt(value) <= 0) {
          newErrors.duration = 'Thời gian phải là số lớn hơn 0';
        } else {
          delete newErrors.duration;
        }
        break;
      case 'price': {
        const priceValue = parseCurrency(value);
        if (!priceValue) {
          newErrors.price = 'Giá không được để trống';
        } else if (parseInt(priceValue) < 0) {
          newErrors.price = 'Giá phải là số lớn hơn hoặc bằng 0';
        } else {
          delete newErrors.price;
        }
        break;
      }
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Tên dịch vụ không được để trống';
        } else {
          delete newErrors.name;
        }
        break;
      case 'type':
        if (!value) {
          newErrors.type = 'Vui lòng chọn loại dịch vụ';
        } else {
          delete newErrors.type;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    
    // Validate tất cả fields
    const isNameValid = validateField('name', formData.name);
    const isTypeValid = validateField('type', formData.type);
    const isDurationValid = validateField('duration', formData.duration);
    const isPriceValid = validateField('price', formData.price);
    
    if (!isNameValid || !isTypeValid || !isDurationValid || !isPriceValid) {
      showToast('Vui lòng kiểm tra lại thông tin!', 'error');
      return;
    }
    
         try {
       await serviceService.create({
         ...formData,
         duration: parseInt(formData.duration),
         price: parseInt(formData.price),
         requireExamFirst: formData.requireExamFirst === 'true'
       });
      
      setFormData({
        name: '',
        type: '',
        duration: '',
        price: 0,
        description: '',
        requireExamFirst: false
      });
      setErrors({});
      setShowCreateForm(false);
      fetchServices();
      showToast('Tạo dịch vụ thành công!', 'success');
    } catch (error) {
      console.error('Error creating service:', error);
      showToast(error.message || 'Có lỗi xảy ra khi tạo dịch vụ!', 'error');
    }
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    
    // Validate tất cả fields
    const isNameValid = validateField('name', formData.name);
    const isTypeValid = validateField('type', formData.type);
    const isDurationValid = validateField('duration', formData.duration);
    const isPriceValid = validateField('price', formData.price);
    
    if (!isNameValid || !isTypeValid || !isDurationValid || !isPriceValid) {
      showToast('Vui lòng kiểm tra lại thông tin!', 'error');
      return;
    }
    
         try {
       await serviceService.update(editingService._id, {
         ...formData,
         duration: parseInt(formData.duration),
         price: parseInt(formData.price),
         requireExamFirst: formData.requireExamFirst === 'true'
       });
      
      setEditingService(null);
      setFormData({
        name: '',
        type: '',
        duration: '',
        price: 0,
        description: '',
        requireExamFirst: false
      });
      setErrors({});
      fetchServices();
      showToast('Cập nhật dịch vụ thành công!', 'success');
    } catch (error) {
      console.error('Error updating service:', error);
      showToast(error.message || 'Có lỗi xảy ra khi cập nhật dịch vụ!', 'error');
    }
  };

  const handleToggleServiceStatus = async (serviceId, currentStatus) => {
    const action = currentStatus ? 'tạm ngưng' : 'kích hoạt';
    if (!window.confirm(`Bạn có chắc chắn muốn ${action} dịch vụ này?`)) return;
    
    try {
      await serviceService.toggleStatus(serviceId);
      fetchServices();
      showToast(`${action.charAt(0).toUpperCase() + action.slice(1)} dịch vụ thành công!`, 'success');
    } catch (error) {
      console.error('Error toggling service status:', error);
      showToast(error.message || `Có lỗi xảy ra khi ${action} dịch vụ!`, 'error');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      type: service.type,
      duration: service.duration,
      price: service.price,
      description: service.description,
      requireExamFirst: service.requireExamFirst ? 'true' : 'false'
    });
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingService(null);
    setFormData({
      name: '',
      type: '',
      duration: '',
      price: 0,
      description: '',
      requireExamFirst: false
    });
    setErrors({});
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN');
  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price);

  return (
    <div className="service-management">
      <div className="card service-header">
        <h2>Quản lý dịch vụ</h2>
        <button className="btn-create" onClick={() => setShowCreateForm(true)}>
          + Thêm dịch vụ
        </button>
      </div>

      <div className="card search-section">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Tìm kiếm dịch vụ..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()} 
          />
          <button className="btn-ghost" onClick={handleSearch}>Tìm kiếm</button>
        </div>
      </div>

      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Thêm dịch vụ mới</h3>
                         <form onSubmit={handleCreateService}>
               <div className="form-section">
                 <label className="label">Tên dịch vụ</label>
                 <input 
                   className={`control ${errors.name ? 'error' : ''}`}
                   value={formData.name} 
                   onChange={(e) => {
                     setFormData({ ...formData, name: e.target.value });
                     validateField('name', e.target.value);
                   }}
                   onBlur={(e) => validateField('name', e.target.value)}
                   placeholder="Nhập tên dịch vụ"
                   required 
                 />
                 {errors.name && <div className="error-message">{errors.name}</div>}
               </div>

               <div className="form-section">
                 <label className="label">Loại dịch vụ</label>
                 <select 
                   className={`control ${errors.type ? 'error' : ''}`}
                   value={formData.type} 
                   onChange={(e) => {
                     setFormData({ ...formData, type: e.target.value });
                     validateField('type', e.target.value);
                   }}
                   onBlur={(e) => validateField('type', e.target.value)}
                   required
                 >
                   <option value="">Chọn loại dịch vụ</option>
                   <option value="exam">Khám</option>
                   <option value="treatment">Điều trị</option>
                 </select>
                 {errors.type && <div className="error-message">{errors.type}</div>}
               </div>

               <div className="form-grid">
                 <div>
                   <label className="label">Thời gian (phút)</label>
                   <input 
                     type="number" 
                     className={`control ${errors.duration ? 'error' : ''}`}
                     value={formData.duration} 
                     onChange={(e) => {
                       setFormData({ ...formData, duration: e.target.value });
                       validateField('duration', e.target.value);
                     }}
                     onBlur={(e) => validateField('duration', e.target.value)}
                     placeholder="Nhập thời gian"
                     required 
                   />
                   {errors.duration && <div className="error-message">{errors.duration}</div>}
                 </div>
                                   <div>
                    <label className="label">Giá (VNĐ)</label>
                    <input 
                      type="text" 
                      className={`control ${errors.price ? 'error' : ''}`}
                      value={formatCurrency(formData.price)} 
                      onChange={(e) => {
                        const rawValue = parseCurrency(e.target.value);
                        setFormData({ ...formData, price: rawValue });
                        validateField('price', rawValue);
                      }}
                      onBlur={(e) => validateField('price', parseCurrency(e.target.value))}
                      placeholder="Nhập giá (VD: 1,500,000)"
                      required 
                    />
                    {errors.price && <div className="error-message">{errors.price}</div>}
                  </div>
               </div>

              <div className="form-section">
                <label className="label">Mô tả</label>
                <textarea 
                  className="control" 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  placeholder="Nhập mô tả dịch vụ"
                  rows="3"
                />
              </div>

              <div className="form-section">
                <label className="label">
                  <input 
                    type="checkbox" 
                    checked={formData.requireExamFirst === 'true'} 
                    onChange={(e) => setFormData({ ...formData, requireExamFirst: e.target.checked ? 'true' : 'false' })} 
                  />
                  Yêu cầu khám trước
                </label>
              </div>
              
              <div className="actions">
                <button type="submit" className="btn btn-primary">Lưu</button>
                <button type="button" className="btn btn-ghost" onClick={handleCancel}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingService && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Cập nhật dịch vụ</h3>
            <form onSubmit={handleUpdateService}>
              <div className="form-section">
                <label className="label">Tên dịch vụ</label>
                <input 
                  className="control" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  placeholder="Nhập tên dịch vụ"
                  required 
                />
              </div>

              <div className="form-section">
                <label className="label">Loại dịch vụ</label>
                <select 
                  className="control" 
                  value={formData.type} 
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="exam">Khám</option>
                  <option value="treatment">Điều trị</option>
                </select>
              </div>

              <div className="form-grid">
                <div>
                  <label className="label">Thời gian (phút)</label>
                  <input 
                    type="number" 
                    className="control" 
                    value={formData.duration} 
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })} 
                    placeholder="Nhập thời gian"
                    required 
                  />
                </div>
                                 <div>
                   <label className="label">Giá (VNĐ)</label>
                   <input 
                     type="text" 
                     className="control" 
                     value={formatCurrency(formData.price)} 
                     onChange={(e) => {
                       const rawValue = parseCurrency(e.target.value);
                       setFormData({ ...formData, price: rawValue });
                     }}
                     placeholder="Nhập giá"
                     required 
                   />
                 </div>
              </div>

              <div className="form-section">
                <label className="label">Mô tả</label>
                <textarea 
                  className="control" 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  placeholder="Nhập mô tả dịch vụ"
                  rows="3"
                />
              </div>

              <div className="form-section">
                <label className="label">
                  <input 
                    type="checkbox" 
                    checked={formData.requireExamFirst === 'true'} 
                    onChange={(e) => setFormData({ ...formData, requireExamFirst: e.target.checked ? 'true' : 'false' })} 
                  />
                  Yêu cầu khám trước
                </label>
              </div>
              
              <div className="actions">
                <button type="submit" className="btn btn-primary">Cập nhật</button>
                <button type="button" className="btn btn-ghost" onClick={handleCancel}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="services-table">
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tên dịch vụ</th>
                <th>Loại</th>
                <th>Thời gian</th>
                <th>Giá</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id}>
                  <td>
                    <div className="service-name">{service.name}</div>
                    {service.description && (
                      <div className="service-description">{service.description}</div>
                    )}
                  </td>
                  <td>
                    <span className={`service-type ${service.type}`}>
                      {service.type === 'exam' ? 'Khám' : 'Điều trị'}
                    </span>
                  </td>
                  <td>{service.duration} phút</td>
                  <td>{formatPrice(service.price)} VNĐ</td>
                  <td>
                    <span className={`status ${service.isActive ? 'active' : 'inactive'}`}>
                      {service.isActive ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td>{service.createdAt ? formatDate(service.createdAt) : '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-ghost" onClick={() => handleEdit(service)}>
                        Sửa
                      </button>
                      <button 
                        className={`btn-ghost ${service.isActive ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => handleToggleServiceStatus(service._id, service.isActive)}
                      >
                        {service.isActive ? 'Tạm ngưng' : 'Kích hoạt'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default ServiceManagement;
