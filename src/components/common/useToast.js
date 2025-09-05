import { useContext } from "react";
import { ToastContext } from "./ToastContext.js";

/**
 * Hook để sử dụng toast trong các component
 * @returns {Object} Object chứa hàm show để hiển thị toast
 * @throws {Error} Nếu hook được sử dụng bên ngoài ToastProvider
 */
export function useToast() {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error("useToast phải được sử dụng bên trong ToastProvider");
  }
  
  return context;
}
