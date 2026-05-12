import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axiosClient from "../api/axiosClient";

interface NotificationContextType {
  // Số lượng khóa học chờ duyệt
  pendingCoursesCount: number;
  fetchPendingCount: () => Promise<void>;
  decreaseCount: (amount?: number) => void;

  // Số lượng yêu cầu làm giảng viên
  pendingInstructorCount: number;
  fetchPendingInstructorCount: () => Promise<void>;
  decreaseInstructorCount: (amount?: number) => void;

  // Số lượng yêu cầu/báo cáo từ khóa học
  pendingCourseRequestCount: number;
  fetchPendingCourseRequestCount: () => Promise<void>;
  decreaseCourseRequestCount: (amount?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pendingCoursesCount, setPendingCoursesCount] = useState<number>(0);
  const [pendingInstructorCount, setPendingInstructorCount] =
    useState<number>(0);
  const [pendingCourseRequestCount, setPendingCourseRequestCount] =
    useState<number>(0);

  // 1. Fetch số lượng khóa học chờ duyệt
  const fetchPendingCount = useCallback(async () => {
    try {
      const res = await axiosClient.get("/admin/course/count-pending");
      setPendingCoursesCount(res.data);
    } catch (error: any) {
      console.error("Lỗi khi fetch số lượng khóa học:", error?.message);
    }
  }, []);

  // 2. Fetch số lượng yêu cầu nâng cấp GV
  const fetchPendingInstructorCount = useCallback(async () => {
    try {
      const res = await axiosClient.get("/admin/requests/count-instructor");
      setPendingInstructorCount(res.data);
    } catch (error: any) {
      console.error("Lỗi khi fetch số lượng yêu cầu GV:", error?.message);
    }
  }, []);

  // 3. Fetch số lượng yêu cầu/báo cáo khóa học (Mới thêm)
  const fetchPendingCourseRequestCount = useCallback(async () => {
    try {
      const res = await axiosClient.get("admin/requests/count-course");
      setPendingCourseRequestCount(res.data);
    } catch (error: any) {
      console.error("Lỗi khi fetch số lượng yêu cầu khóa học:", error?.message);
    }
  }, []);

  // --- Các hàm giảm count thủ công khi Admin xử lý nhanh ---
  const decreaseCount = (amount: number = 1) => {
    setPendingCoursesCount((prev) => Math.max(0, prev - amount));
  };

  const decreaseInstructorCount = (amount: number = 1) => {
    setPendingInstructorCount((prev) => Math.max(0, prev - amount));
  };

  const decreaseCourseRequestCount = (amount: number = 1) => {
    setPendingCourseRequestCount((prev) => Math.max(0, prev - amount));
  };

  useEffect(() => {
    // Gọi lần đầu
    fetchPendingCount();
    fetchPendingInstructorCount();
    fetchPendingCourseRequestCount();

    // Thiết lập interval để auto-refresh sau mỗi 60 giây
    const interval = setInterval(() => {
      fetchPendingCount();
      fetchPendingInstructorCount();
      fetchPendingCourseRequestCount();
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [
    fetchPendingCount,
    fetchPendingInstructorCount,
    fetchPendingCourseRequestCount,
  ]);

  return (
    <NotificationContext.Provider
      value={{
        pendingCoursesCount,
        fetchPendingCount,
        decreaseCount,
        pendingInstructorCount,
        fetchPendingInstructorCount,
        decreaseInstructorCount,
        pendingCourseRequestCount,
        fetchPendingCourseRequestCount,
        decreaseCourseRequestCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
};
