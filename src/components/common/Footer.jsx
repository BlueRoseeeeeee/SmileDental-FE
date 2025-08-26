import React from "react";
import "./footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        <div className="site-footer__column">
          <h4 className="site-footer__heading">NHA KHOA SMILE DENTAL</h4>
          <p className="site-footer__text">Địa chỉ: Nguyễn Văn Bảo, Gò Vấp, thành phố Hồ Chí Minh</p>
          <p className="site-footer__text">Email: smiledental@gmail.com</p>
          <p className="site-footer__text">GIỜ LÀM VIỆC: 8:30 - 18:30 tất cả các ngày trong tuần</p>
        </div>
        <div className="site-footer__column">
          <h4 className="site-footer__heading">GIỚI THIỆU</h4>
          <ul className="site-footer__list">
            <li className="site-footer__item"><a className="site-footer__link" href="#">Về Chúng Tôi</a></li>
            <li className="site-footer__item"><a className="site-footer__link" href="#">Bảng Giá Dịch Vụ</a></li>
            <li className="site-footer__item"><a className="site-footer__link" href="#">Tin Tức Sự Kiện</a></li>
            <li className="site-footer__item"><a className="site-footer__link" href="#">Kiến Thức Nha Khoa</a></li>
            <li className="site-footer__item"><a className="site-footer__link" href="#">Chính sách bảo mật</a></li>
          </ul>
        </div>
        <div className="site-footer__column">
          <h4 className="site-footer__heading">LIÊN HỆ</h4>
          <p className="site-footer__text">HOTLINE: 190000010</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;


