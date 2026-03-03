import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoute";
import { NotificationProvider } from "./context/NotificationContext";

function App() {
  return (
    <BrowserRouter basename="/admin">
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;
