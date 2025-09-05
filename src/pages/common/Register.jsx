import React, { useState } from "react";
import OtpInput from "../../components/common/OtpInput";
import { normalizeVietnameseName, validateRegister } from "../../utils/validation";
import { useToast } from "../../components/common/useToast";
import "./Login.css";
import authImg from "../../assets/image/hinh-anh-dang-nhap-dang-ki.png";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { Link , useNavigate} from "react-router-dom";
import { apiClient } from "../../utils/axiosConfig";

function range(start, end) { return Array.from({length: end-start+1}, (_,i)=>start+i); }

function Register() {
  const { show } = useToast();
  const navigate= useNavigate();
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    phone: "",
    day: "",
    month: "",
    year: "",
    gender: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [errors, setErrors] = useState({});
  const [sendingOtp, setSendingOtp] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleBlur = (field) => {
    const newValues = { ...values };
    if (field === "fullName") newValues.fullName = normalizeVietnameseName(values.fullName);
    setValues(newValues);
    setErrors(validateRegister(newValues));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValues = { ...values, [name]: value };
    setValues(newValues);
    setErrors(validateRegister(newValues));
  };

  const handleOtpChange = (otp) => {
    const newValues = { ...values, otp };
    setValues(newValues);
    setErrors(validateRegister(newValues));
  };

  const sendOtp = async () => {
    console.log("Send OTP clicked"); // Debug log
    
    if (!values.email) { 
      setErrors((e)=>({...e,email:"Vui lòng nhập email"})); 
      show("Vui lòng nhập email", "error");
      return; 
    }
    if (errors.email) return;
    
    console.log("Sending OTP to:", values.email); // Debug log
    setSendingOtp(true);
    
    try {
      const response = await apiClient.post('/auth/send-otp-register', 
        { email: values.email }
      );
      console.log("OTP sent successfully:", response); // Debug log
      show("Đã gửi OTP đến email", "success");
    } catch (err) {
      console.log("OTP send error:", err); // Debug log
      const message = err.response?.data?.message || err.message || "Gửi OTP thất bại";
      show(message, "error");
    } finally {
      setSendingOtp(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const validation = validateRegister(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    setSubmitting(true);
    try {
      const payload = {
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        role: "patient",
        type: "null",
        phone: values.phone,
        fullName: normalizeVietnameseName(values.fullName),
        gender: values.gender,
        dateOfBirth: `${values.year}-${String(values.month).padStart(2,'0')}-${String(values.day).padStart(2,'0')}`,
        otp: values.otp,
      };
             await apiClient.post('/auth/register', payload);
      show("Đăng ký thành công", "success");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Đăng ký thất bại";
      show(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const years = range(1900, new Date().getFullYear());
  const months = range(1, 12);
  const days = range(1, 31);

  return (
    <>
      <Header />
      <div className="auth">
        <div className="auth__container">
          <div className="auth__illustration">
          <div>
          <img src={authImg} alt="Smile Dental" />
          </div>
            
          </div>
        <form className="auth__form" onSubmit={submit} noValidate>
          <h2 className="auth__title">Đăng ký</h2>
          <div className={`field ${errors.fullName ? "field--error" : ""}`}>
            <label className="field__label">Họ và tên</label>
            <input name="fullName" className="field__input" value={values.fullName} onChange={handleChange} onBlur={()=>handleBlur("fullName")} />
            {errors.fullName && <div className="field__error">{errors.fullName}</div>}
          </div>
          <div className="field-group">
          <div className={`field ${errors.email ? "field--error" : ""}`} style={{flex:1}}>
            <label className="field__label">Email</label>
            <input name="email" className="field__input" value={values.email} onChange={handleChange}  style={{flex:1}} onBlur={()=>handleBlur("email")} />
            {errors.email && <div className="field__error">{errors.email}</div>}
          </div>
          <div className="field" style={{width:"20%", marginTop:28}}>
            <button 
              type="button" 
              className="btn btn--primary" 
              onClick={sendOtp} 
              disabled={sendingOtp}
            >
              {sendingOtp ? "Đang gửi..." : "Gửi OTP"}
            </button>
          </div>
          </div>
          <div className={`field ${errors.otp ? "field--error" : ""}`}>
            <label className="field__label">Mã OTP</label>
            <OtpInput value={values.otp} onChange={handleOtpChange} />
            {errors.otp && <div className="field__error">{errors.otp}</div>}
          </div>
          <div className={`field ${errors.phone ? "field--error" : ""}`}>
            <label className="field__label">Số điện thoại</label>
            <input name="phone" className="field__input" value={values.phone} onChange={handleChange} onBlur={()=>handleBlur("phone")} />
            {errors.phone && <div className="field__error">{errors.phone}</div>}
          </div>
            <div className={`field ${errors.gender ? "field--error" : ""}`}>
              <label className="field__label">Giới tính</label>
              <div style={{display:'flex', gap:12}}>
                <label><input type="radio" name="gender" value="male" checked={values.gender==='male'} onChange={handleChange} /> Nam</label>
                <label><input type="radio" name="gender" value="female" checked={values.gender==='female'} onChange={handleChange} /> Nữ</label>
                <label><input type="radio" name="gender" value="other" checked={values.gender==='other'} onChange={handleChange} /> Khác</label>
              </div>
              {errors.gender && <div className="field__error">{errors.gender}</div>}
            </div>
            <div className={`field ${errors.dateOfBirth ? "field--error" : ""}`}>
              <label className="field__label">Ngày sinh</label>
              <div style={{display:'flex', gap:8}}>
                <select name="day" className="field__input" value={values.day} onChange={handleChange}>
                  <option value="">Ngày</option>
                  {days.map(d=> <option key={d} value={d}>{d}</option>)}
                </select>
                <select name="month" className="field__input" value={values.month} onChange={handleChange}>
                  <option value="">Tháng</option>
                  {months.map(m=> <option key={m} value={m}>{m}</option>)}
                </select>
                <select name="year" className="field__input" value={values.year} onChange={handleChange}>
                  <option value="">Năm</option>
                  {years.map(y=> <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              {errors.dateOfBirth && <div className="field__error">{errors.dateOfBirth}</div>}
            </div>
          <div className={`field ${errors.password ? "field--error" : ""}`}>
            <label className="field__label">Mật khẩu</label>
            <input type="password" name="password" className="field__input" value={values.password} onChange={handleChange} onBlur={()=>handleBlur("password")} />
            {errors.password && <div className="field__error">{errors.password}</div>}
          </div>
          <div className={`field ${errors.confirmPassword ? "field--error" : ""}`}>
            <label className="field__label">Xác nhận mật khẩu</label>
            <input type="password" name="confirmPassword" className="field__input" value={values.confirmPassword} onChange={handleChange} onBlur={()=>handleBlur("confirmPassword")} />
            {errors.confirmPassword && <div className="field__error">{errors.confirmPassword}</div>}
          </div>
          
          <button type="submit" className="btn btn--primary" disabled={submitting}>Đăng ký</button>
          <div style={{textAlign:'center', marginTop:12}}>
            <span>Đã có tài khoản? </span>
            <Link to="/login" className="link">Đăng nhập</Link>
          </div>
        </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Register;


