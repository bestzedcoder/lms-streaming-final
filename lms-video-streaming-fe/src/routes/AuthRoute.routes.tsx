import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.store";

const AuthRoute = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    if (user?.role === "INSTRUCTOR") {
      return <Navigate to="/instructor/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AuthRoute;
