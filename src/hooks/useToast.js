import { useContext } from "react";
import { ToastContext } from "../context/ToastContext";

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast harus dipakai di dalam ToastProvider");

  const showToast = context.showToast;
  const hideToast = context.hideToast;
  const showSuccess = context.showSuccess ?? ((msg, dur) => showToast(msg, "success", dur));
  const showError = context.showError ?? ((msg, dur) => showToast(msg, "error", dur));
  const showWarning = context.showWarning ?? ((msg, dur) => showToast(msg, "warning", dur));
  const showInfo = context.showInfo ?? ((msg, dur) => showToast(msg, "info", dur));

  return {
    ...context,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}