import React, { useState } from "react";
import OtpInput from "../../components/common/OtpInput";
import { validateReset } from "../../utils/validation";
import { useToast } from "../../components/common/Toast";
import "./ForgotPassword.css";
import authImg from "../../assets/image/hinh-anh-dang-nhap-dang-ki.png";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const API = "http://localhost:3001/api/auth";

function ForgotPassword() {
  const { show } = useToast();
  const [values, setValues] = useState({ email: "", otp: "", newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [sendingOtp, setSendingOtp] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const handleBlur = () => {
    setErrors((prev) => ({ ...prev, ...validateReset(values) }));
  };

  const sendOtp = async () => {
    if (!values.email) { setErrors((e)=>({...e,email:"Vui lòng nhập email"})); return; }
    setSendingOtp(true);
    try {
      const res = await fetch(`${API}/send-otp-reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Gửi OTP thất bại");
      show("Đã gửi OTP đến email", "success");
    } catch (err) {
      show(err.message, "error");
    } finally {
      setSendingOtp(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const validation = validateReset(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Đặt lại mật khẩu thất bại");
      show("Đặt lại mật khẩu thành công", "success");
    } catch (err) {
      show(err.message, "error");
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
          <h2 className="auth__title">Đặt lại mật khẩu</h2>
          <div className="field-group">
          <div className={`field ${errors.email ? "field--error" : ""}`} style={{flex:1}}>
            <label className="field__label">Email</label>
            <input name="email" className="field__input" value={values.email} onChange={handleChange} onBlur={handleBlur} />
            {errors.email && <div className="field__error">{errors.email}</div>}
          </div>
          <div className="field" style={{marginTop:28}}>
            <button type="button" className="btn btn--primary" onClick={sendOtp} disabled={sendingOtp}>Gửi OTP</button>
          </div>
          </div>
          <div className={`field ${errors.otp ? "field--error" : ""}`}>
            <label className="field__label">Mã OTP</label>
            <OtpInput value={values.otp} onChange={(v)=>setValues((s)=>({...s, otp:v}))} />
            {errors.otp && <div className="field__error">{errors.otp}</div>}
          </div>
          <div className={`field ${errors.newPassword ? "field--error" : ""}`}>
            <label className="field__label">Mật khẩu mới</label>
            <input type="password" name="newPassword" className="field__input" value={values.newPassword} onChange={handleChange} onBlur={handleBlur} />
            {errors.newPassword && <div className="field__error">{errors.newPassword}</div>}
          </div>
          <div className={`field ${errors.confirmPassword ? "field--error" : ""}`}>
            <label className="field__label">Xác nhận mật khẩu</label>
            <input type="password" name="confirmPassword" className="field__input" value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur} />
            {errors.confirmPassword && <div className="field__error">{errors.confirmPassword}</div>}
          </div>
          <button type="submit" className="btn btn--primary" disabled={submitting}>Đặt lại mật khẩu</button>
        </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ForgotPassword;


