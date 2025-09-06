import React, { useState, useEffect } from "react";
import { useToast } from "../../components/common/useToast";
import { validateLogin } from "../../utils/validation";
import "./Login.css";
import authImg from "../../assets/image/hinh-anh-dang-nhap-dang-ki.png";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { useNavigate } from "react-router-dom";
import { setAuth } from "../../utils/auth";
import { apiClient } from "../../utils/axiosConfig";

function getUserRole(user) {
  if (!user) return "";
  const candidates = [user.role, user.roleName, user?.role?.name].filter(Boolean);
  const raw = candidates[0];
  return typeof raw === 'string' ? raw.toLowerCase() : String(raw || '').toLowerCase();
}

const roleToPath = {
  admin: '/admin',
  manager: '/admin',
  dentist: '/dashboard/dentist',
  nurse: '/dashboard/nurse',
  receptionist: '/dashboard/reception',
  patient: '/',
};

function Login() {
  const { show } = useToast();
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);


  // Load saved email khi component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setValues(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleBlur = () => setErrors((prev) => ({ ...prev, ...validateLogin(values) }));
  const handleChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  
  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
    if (!e.target.checked) {
      // Nếu bỏ chọn remember me, xóa email đã lưu
      localStorage.removeItem('rememberedEmail');
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    
    const cleaned = { email: values.email.trim(), password: values.password.trim() };
    const validation = validateLogin(cleaned);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    
    setSubmitting(true);
    
    try {
      const { data } = await apiClient.post('/auth/login', cleaned);
      setAuth({ accessToken: data.accessToken, user: data.user });
      
      // Lưu email nếu remember me được chọn
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', cleaned.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      const role = getUserRole(data.user);
      show("Đăng nhập thành công", "success");
      navigate(roleToPath[role] || '/');
    } catch (err) {
      const message =err.response?.data?.message || err.message||"Email hoặc mật khẩu không chính xác" || "Đăng nhập thất bại" ;
      show(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="auth">
        <div className="auth__container">
          <div className="auth__illustration">
            <img src={authImg} alt="Smile Dental" />
          </div>
        <form className="auth__form" onSubmit={submit} noValidate>
          <h2 className="auth__title">Đăng nhập</h2>
          <div className={`field ${errors.email ? "field--error" : ""}`}>
            <label className="field__label">Email</label>
            <input name="email" className="field__input" value={values.email} onChange={handleChange} onBlur={handleBlur} />
            {errors.email && <div className="field__error">{errors.email}</div>}
          </div>
          <div className={`field ${errors.password ? "field--error" : ""}`}>
            <label className="field__label">Mật khẩu</label>
            <input type="password" name="password" className="field__input" value={values.password} onChange={handleChange} onBlur={handleBlur} />
            {errors.password && <div className="field__error">{errors.password}</div>}
          </div>
          
          {/* Remember Me checkbox */}
          <div className="field field--checkbox">
            <label className="checkbox">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={handleRememberMeChange}
                className="checkbox__input"
              />
              <span className="checkbox__mark"></span>
              <span className="checkbox__label">Ghi nhớ đăng nhập</span>
            </label>
          </div>
          
          <button type="submit" className="btn btn--primary" disabled={submitting} >{submitting ? "Đang đăng nhập..." : "Đăng nhập"}</button>
          
          <div style={{ display:"flex", justifyContent:"flex-end", marginTop:10}} >
          <a href="/forgot-password">Quên mật khẩu?</a>
          </div>
        </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;


