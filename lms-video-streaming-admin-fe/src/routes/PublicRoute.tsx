import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

function PublicRoute({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>; // Render gì nhẹ nhẹ thôi
  if (user) return <Navigate to="/" replace />;
  return children;
}

export default PublicRoute;
