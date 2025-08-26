import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>SmileDental</h3>
            <p>Chăm sóc nụ cười của bạn với dịch vụ nha khoa chất lượng cao.</p>
          </div>
          
          <div className="footer-section">
            <h4>Liên hệ</h4>
            <p>📞 090-123-4567</p>
            <p>📧 info@smiledental.com</p>
            <p>📍 123 Đường ABC, Quận 1, TP.HCM</p>
          </div>
          
          <div className="footer-section">
            <h4>Dịch vụ</h4>
            <ul>
              <li>Khám tổng quát</li>
              <li>Trám răng</li>
              <li>Nhổ răng</li>
              <li>Chỉnh nha</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Giờ làm việc</h4>
            <p>Thứ 2 - Thứ 6: 8:00 - 20:00</p>
            <p>Thứ 7: 8:00 - 18:00</p>
            <p>Chủ nhật: 8:00 - 16:00</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 SmileDental. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
