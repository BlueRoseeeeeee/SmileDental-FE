import React, { useState, useCallback, useMemo } from "react";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { VscError } from "react-icons/vsc";
import { CiWarning } from "react-icons/ci";
import { IoIosInformationCircleOutline } from "react-icons/io";
import "./toast.css";
import { ToastContext } from "./ToastContext.js";

function ToastItem({ toast, onClose }) {

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <IoMdCheckmarkCircle className="toast-icon" />;
      case 'error':
        return <VscError className="toast-icon" />;
      case 'warning':
        return <CiWarning className="toast-icon" />;
      default:
        return <IoIosInformationCircleOutline className="toast-icon" />;
    }
  };

  return (
    <div 
      className={`toast toast-${toast.type} show`}
      data-toast-id={toast.id}
    >
      <div className="toast-content">
        {getIcon()}
        <span className="toast-message">{toast.message}</span>
        <button 
          className="toast-close-btn" 
          onClick={() => onClose(toast.id)}
          title="Đóng thông báo"
        >
          ×
        </button>
      </div>
    </div>
  );
}

/**
 * ToastProvider - Component quản lý hiển thị thông báo toast
 * @param {React.ReactNode} children - Các component con
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  /**
   * Xóa toast với animation fade-out
   * @param {string|number} id - ID của toast cần xóa
   */
  const removeToast = useCallback((id) => {
    const toastElement = document.querySelector(`[data-toast-id="${id}"]`);
    
    if (toastElement) {
      toastElement.classList.add('toast-fade-out');
      // Đợi animation hoàn thành (300ms) rồi mới xóa khỏi state
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, 300);
    } else {
      // Fallback: xóa ngay lập tức nếu không tìm thấy element
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }
  }, []);

  /**
   * Hiển thị toast mới
   * @param {string} message - Nội dung thông báo
   * @param {string} type - Loại toast: 'success', 'error', 'warning', 'info'
   */
  const showToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type };

    setToasts(prev => [...prev, newToast]);

    // Thời gian tự động đóng toast theo loại
    const autoCloseTimes = {
      error: 10000,   
      warning: 8000, 
      success: 4000,  
      info: 10000     
    };

    const autoCloseTime = autoCloseTimes[type] || autoCloseTimes.info;
    
    setTimeout(() => {
      removeToast(id);
    }, autoCloseTime);
  }, [removeToast]);

  const contextValue = useMemo(() => ({
    show: showToast
  }), [showToast]);


  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* Container hiển thị các toast */}
      <div className="toast-container">
        {toasts.map(toast => (
          <ToastItem 
            key={toast.id} 
            toast={toast} 
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}