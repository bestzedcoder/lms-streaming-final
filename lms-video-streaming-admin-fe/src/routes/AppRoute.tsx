import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import PublicRoute from "./PublicRoute";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import UserPage from "../pages/UserPage";
import CategoryPage from "../pages/CategoryPage";
import CoursePendingPage from "../pages/CoursePendingPage";
import InstructorCoursesPage from "../pages/InstructorCoursesPage";
import InstructorRequestPage from "../pages/InstructorRequestPage";
import VideoPreviewPage from "../pages/VideoPreviewPage";
import LecturePreviewPage from "../pages/LecturePreviewPage";
import CourseRequestManager from "../pages/CourseRequestManager";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UserPage />} />
          <Route path="categories" element={<CategoryPage />} />
          <Route path="pending-courses" element={<CoursePendingPage />} />
          <Route path="course-requests" element={<CourseRequestManager />} />
          <Route path="courses-search" element={<InstructorCoursesPage />} />
          <Route path="pending-video" element={<VideoPreviewPage />} />
          <Route path="pending-lecture" element={<LecturePreviewPage />} />
          <Route
            path="instructor-requests"
            element={<InstructorRequestPage />}
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
