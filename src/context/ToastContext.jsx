import { createContext, useCallback, useState } from "react";
import { ToastContainer } from "../components/ui/Toast";

export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const hideToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "info", duration = 3000) => {
      const id = Date.now() + Math.random(); // id unik
      setToasts((prev) => [...prev, { id, message, type }]);

      if (type !== "loading") {
        setTimeout(() => hideToast(id), duration);
      }
      return id; 
    },
    [hideToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={hideToast} />
    </ToastContext.Provider>
  );
}