import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import Toast from "./Toast";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: 'male',
    dateOfBirth: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // Toast state
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'info'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    
    // Validate field on blur
    const fieldError = validateField(name, form[name]);
    setErrors({ ...errors, [name]: fieldError });
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        if (!value) return 'Họ tên không được để trống';
        if (value.length < 2) return 'Họ tên phải có ít nhất 2 ký tự';
        return '';
      
      case 'email':
        if (!value) return 'Email không được để trống';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Email không đúng định dạng';
        return '';
      
      case 'phone':
        if (!value) return 'Số điện thoại không được để trống';
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(value)) return 'Số điện thoại không hợp lệ';
        return '';
      
      case 'password':
        if (!value) return 'Mật khẩu không được để trống';
        if (value.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
        return '';
      
      case 'confirmPassword':
        if (!value) return 'Xác nhận mật khẩu không được để trống';
        if (value !== form.password) return 'Mật khẩu xác nhận không khớp';
        return '';
      
      default:
        return '';
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({
      isVisible: true,
      message,
      type
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const allErrors = {};
    const fieldsToValidate = ['fullName', 'email', 'phone', 'password', 'confirmPassword'];
    
    fieldsToValidate.forEach(field => {
      const error = validateField(field, form[field]);
      if (error) allErrors[field] = error;
    });
    
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setTouched({
        fullName: true,
        email: true,
        phone: true,
        password: true,
        confirmPassword: true
      });
      showToast('Vui lòng kiểm tra lại các thông tin bị lỗi!', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth
      });
      
      showToast('Đăng ký thành công!', 'success');
      
      // Chuyển hướng về trang login sau khi đăng ký thành công
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Đăng ký thất bại!';
      showToast(errorMessage, 'error');
    }
    setLoading(false);
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-illustration">
          <div className="illustration-content">
            <h2>Chào mừng bạn!</h2>
            <p>Đăng ký tài khoản để trải nghiệm dịch vụ nha khoa chất lượng cao</p>
          </div>
        </div>
        
        <div className="register-form-section">
          <div className="register-form-container">
            <h2 className="register-title">ĐĂNG KÝ TÀI KHOẢN</h2>
            
            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-group">
                <label>Họ và tên *</label>
                <input 
                  name="fullName" 
                  type="text"
                  value={form.fullName} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required 
                  placeholder="Nhập họ và tên của bạn"
                  className={touched.fullName && errors.fullName ? 'input-error' : ''}
                />
                {touched.fullName && errors.fullName && (
                  <div className="error-message">{errors.fullName}</div>
                )}
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input 
                  name="email" 
                  type="email"
                  value={form.email} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required 
                  placeholder="Nhập email của bạn"
                  className={touched.email && errors.email ? 'input-error' : ''}
                />
                {touched.email && errors.email && (
                  <div className="error-message">{errors.email}</div>
                )}
              </div>

              <div className="form-group">
                <label>Số điện thoại *</label>
                <input 
                  name="phone" 
                  type="tel"
                  value={form.phone} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required 
                  placeholder="Nhập số điện thoại"
                  className={touched.phone && errors.phone ? 'input-error' : ''}
                />
                {touched.phone && errors.phone && (
                  <div className="error-message">{errors.phone}</div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Giới tính</label>
                  <select 
                    name="gender" 
                    value={form.gender} 
                    onChange={handleChange}
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Ngày sinh</label>
                  <input 
                    name="dateOfBirth" 
                    type="date"
                    value={form.dateOfBirth} 
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Mật khẩu *</label>
                <input 
                  name="password" 
                  type="password" 
                  value={form.password} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required 
                  placeholder="Nhập mật khẩu"
                  className={touched.password && errors.password ? 'input-error' : ''}
                />
                {touched.password && errors.password && (
                  <div className="error-message">{errors.password}</div>
                )}
              </div>

              <div className="form-group">
                <label>Xác nhận mật khẩu *</label>
                <input 
                  name="confirmPassword" 
                  type="password" 
                  value={form.confirmPassword} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required 
                  placeholder="Nhập lại mật khẩu"
                  className={touched.confirmPassword && errors.confirmPassword ? 'input-error' : ''}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <div className="error-message">{errors.confirmPassword}</div>
                )}
              </div>

              <button 
                type="submit" 
                className="btn-register" 
                disabled={loading}
              >
                {loading ? 'Đang đăng ký...' : 'ĐĂNG KÝ'}
              </button>
            </form>
            
            {/* Toast Notification */}
            <Toast 
              message={toast.message}
              type={toast.type}
              isVisible={toast.isVisible}
              onClose={hideToast}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
