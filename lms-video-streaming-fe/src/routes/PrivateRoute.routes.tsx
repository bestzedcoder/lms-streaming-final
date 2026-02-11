// routes/PrivateRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.store";

const PrivateRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
