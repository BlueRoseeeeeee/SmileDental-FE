import React, { useState } from "react";
import { useToast } from "../../components/common/Toast";
import { validateLogin } from "../../utils/validation";
import "./auth.css";
import authImg from "../../assets/image/hinh-anh-dang-nhap-dang-ki.png";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { useNavigate } from "react-router-dom";
import { setAuth } from "../../utils/auth";

const API = "http://localhost:3001/api/auth";

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

  const handleBlur = () => setErrors((prev) => ({ ...prev, ...validateLogin(values) }));
  const handleChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const cleaned = { email: values.email.trim(), password: values.password.trim() };
    const validation = validateLogin(cleaned);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleaned),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Đăng nhập thất bại');

      setAuth({ accessToken: data.accessToken, user: data.user });
      const role = getUserRole(data.user);
      show("Đăng nhập thành công", "success");
      navigate(roleToPath[role] || '/');
    } catch (err) {
      show(err.message || "Đăng nhập thất bại", "error");
    } finally { setSubmitting(false); }
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


