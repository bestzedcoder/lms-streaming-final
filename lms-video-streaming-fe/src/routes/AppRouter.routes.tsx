import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import HomePage from "../pages/student/HomePage";
import StudentLayout from "../components/layout/StudentLayout";
import ProfileLayout from "../components/layout/ProfileLayout";
import InfoPage from "../pages/user/InfoPage";
import EditProfilePage from "../pages/user/EditProfilePage";
import EditPhotoPage from "../pages/user/EditPhotoPage";
import InstructorLayout from "../components/layout/InstructorLayout";
import InstructorDashboard from "../pages/instructor/InstructorDashboard";
import InstructorSettingsPage from "../pages/instructor/InstructorSettingsPage";
import AdminLayout from "../components/layout/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagementPage from "../pages/admin/UserManagementPage";
import ChangePasswordPage from "../pages/user/ChangePasswordPage";
import ManageCoursePage from "../pages/instructor/ManageCoursePage";
import InstructorCoursesPage from "../pages/instructor/InstructorCoursesPage";
import CreateCoursePage from "../pages/instructor/CreateCoursePage";
import InstructorCourseDetailPage from "../pages/instructor/InstructorCourseDetailPage";
import CategoryManagerPage from "../pages/admin/CategoryManagerPage";
import PublicCoursesPage from "../pages/student/PublicCoursePage";
import CourseDetailsPage from "../pages/student/CourseDetailsPage";

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

        <Route element={<StudentLayout />}>
          <Route
            path="/"
            element={<Navigate to={"/student/dashboard"} replace />}
          />
          <Route path="/student/dashboard" element={<HomePage />} />
          <Route
            path="/student/courses/search"
            element={<PublicCoursesPage />}
          />
          <Route
            path="/student/courses/:slug"
            element={<CourseDetailsPage />}
          />
          <Route
            element={
              <PrivateRoute allowedRoles={["STUDENT", "INSTRUCTOR", "ADMIN"]} />
            }
          >
            <Route path="/user" element={<ProfileLayout />}>
              <Route index element={<Navigate to="info" replace />} />

              <Route path="info" element={<InfoPage />} />
              <Route path="edit-profile" element={<EditProfilePage />} />
              <Route path="edit-photo" element={<EditPhotoPage />} />
              <Route path="security" element={<ChangePasswordPage />} />
            </Route>
            <Route
              path="/student/my-courses"
              element={<div>Khóa học của tôi</div>}
            />
            {/* ... */}
          </Route>
        </Route>

        <Route element={<PrivateRoute allowedRoles={["INSTRUCTOR"]} />}>
          <Route path="/instructor" element={<InstructorLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<InstructorDashboard />} />
            <Route path="courses" element={<InstructorCoursesPage />} />

            <Route path="courses/create" element={<CreateCoursePage />} />
            <Route
              path="courses/:id"
              element={<InstructorCourseDetailPage />}
            />
            <Route
              path="courses/:courseId/manage"
              element={<ManageCoursePage />}
            />
            <Route path="students" element={<div>Quản lý học viên</div>} />
            <Route path="analytics" element={<div>Phân tích chi tiết</div>} />
            <Route path="earnings" element={<div>Ví & Doanh thu</div>} />
            <Route path="settings" element={<InstructorSettingsPage />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
          <Route
            path="/admin"
            element={<Navigate to={"/admin/dashboard"} replace />}
          />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="categories" element={<CategoryManagerPage />} />
          </Route>
        </Route>

        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
