import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { VscError } from "react-icons/vsc";
import { CiWarning } from "react-icons/ci";
import { IoIosInformationCircleOutline } from "react-icons/io";
import "./toast.css";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((message, variant = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => remove(id), 5000);
  }, [remove]);

  const value = useMemo(() => ({ show }), [show]);

  const getIcon = (variant) => {
    switch (variant) {
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
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.variant} show`} role="status">
            <div className="toast-content">
              <span className="toast-icon">{getIcon(t.variant)}</span>
              <span className="toast-message">{t.message}</span>
              <button className="toast-close" onClick={() => remove(t.id)}>
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

// Standalone Toast component for direct usage
const Toast = ({ message, type, isVisible, onClose }) => {
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

  if (!isVisible) return null;

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
