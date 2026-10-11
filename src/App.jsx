import AppRoutes from "./routes/AppRoutes";
import { ToastProvider } from "./context/ToastContext";
import { ChildProvider } from "./context/ChildContext";

export default function App() {
  return (
    <ToastProvider>
      <ChildProvider>
        <AppRoutes />
      </ChildProvider>
    </ToastProvider>
  );
}