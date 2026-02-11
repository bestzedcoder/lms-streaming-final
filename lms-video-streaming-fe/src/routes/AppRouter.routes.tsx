import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalLoading from "../components/common/GlobalLoading";
import LoginPage from "../pages/auth/LoginPage";
import NotFoundPage from "../pages/error/NotFoundPage";
import ForbiddenPage from "../pages/error/ForbiddenPage";
import PrivateRoute from "./PrivateRoute.routes";
import RegisterPage from "../pages/auth/RegisterPage";
import VerifyAccountPage from "../pages/auth/VerifyAccountPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import AuthRoute from "./AuthRoute.routes";

const StudentHome = () => <div>Trang chủ Học viên</div>;
const AdminDashboard = () => <div>Admin Dashboard</div>;

const AppRouter = () => {
  return (
    <BrowserRouter>
      <GlobalLoading />

      <Routes>
        <Route element={<AuthRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-account" element={<VerifyAccountPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        <Route
          element={
            <PrivateRoute allowedRoles={["STUDENT", "INSTRUCTOR", "ADMIN"]} />
          }
        >
          <Route path="/" element={<StudentHome />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
