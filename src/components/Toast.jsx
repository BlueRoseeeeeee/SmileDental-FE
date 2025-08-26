import React, { useEffect } from 'react';
import { IoMdCheckmarkCircle } from "react-icons/io";
import { VscError } from "react-icons/vsc";
import { CiWarning } from "react-icons/ci";
import { IoIosInformationCircleOutline } from "react-icons/io";

const Toast = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Tự động đóng sau 5 giây

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <IoMdCheckmarkCircle />;
      case 'error':
        return <VscError />;
      case 'warning':
        return <CiWarning />;
      default:
        return <IoIosInformationCircleOutline />;
    }
  };

  return (
    <div className={`toast toast-${type} ${isVisible ? 'show' : ''}`}>
      <div className="toast-content">
        <span className="toast-icon">{getIcon()}</span>
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
