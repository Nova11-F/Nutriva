import { useCallback, useMemo, useState } from "react";
import Toast from "../components/ui/Toast";
import { ToastContext } from "./ToastContextInstance";

export { ToastContext };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const hideToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "info", duration = 3000) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);

      if (type !== "loading" && duration > 0) {
        setTimeout(() => hideToast(id), duration);
      }

      return id;
    },
    [hideToast]
  );

  const showSuccess = useCallback(
    (message, duration = 3000) => showToast(message, "success", duration),
    [showToast]
  );

  const showError = useCallback(
    (message, duration = 4000) => showToast(message, "error", duration),
    [showToast]
  );

  const showWarning = useCallback(
    (message, duration = 3500) => showToast(message, "warning", duration),
    [showToast]
  );

  const showInfo = useCallback(
    (message, duration = 3000) => showToast(message, "info", duration),
    [showToast]
  );

  const value = useMemo(
    () => ({
      showToast,
      hideToast,
      showSuccess,
      showError,
      showWarning,
      showInfo,
    }),
    [showToast, hideToast, showSuccess, showError, showWarning, showInfo]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => hideToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
