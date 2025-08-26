import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/image/smile-dental-logo.png";
import "./header.css";

function Header() {
  const navigate = useNavigate();
  return (
    <header className="site-header">
      <div className="site-header__container">
        <div className="site-header__brand">
          <img className="site-header__logo" src={logo} alt="Smile Dental" style={{width:80, height:80}} />
        </div>
        <nav className="site-header__nav">
          <Link className="site-header__link site-header__link--active" to="/">Trang chủ</Link>
          <a className="site-header__link" href="#">Giới thiệu</a>
          <a className="site-header__link" href="#">Bảng giá</a>
          <a className="site-header__link" href="#">Dịch vụ</a>
          <a className="site-header__link" href="#">Kiến thức nha khoa</a>
          <a className="site-header__link" href="#">Liên hệ</a>
        </nav>
        <div className="site-header__actions">
          <button className="btn btn--primary" onClick={()=>navigate('/register')}>Đăng ký</button>
          <button className="btn btn--secondary" onClick={()=>navigate('/login')}>Đăng nhập</button>
          <button className="btn btn--outline">
            <span className="btn__icon" aria-hidden>📅</span>
            Đặt lịch khám
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;


