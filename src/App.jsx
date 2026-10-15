import AppRoutes from "./routes/AppRoutes";
import { ToastProvider } from "./context/ToastContext";
import { ChildProvider } from "./context/ChildContext";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ChildProvider>
          <AppRoutes />
        </ChildProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
