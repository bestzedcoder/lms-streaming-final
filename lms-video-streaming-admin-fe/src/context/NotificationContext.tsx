import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axiosClient from "../api/axiosClient";

interface NotificationContextType {
  pendingCoursesCount: number;
  fetchPendingCount: () => Promise<void>;
  decreaseCount: (amount?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pendingCoursesCount, setPendingCoursesCount] = useState<number>(0);

  const fetchPendingCount = useCallback(async () => {
    try {
      const res = await axiosClient.get("/admin/course/count-pending");
      setPendingCoursesCount(res.data);
    } catch (error: any) {
      console.error("Lỗi khi fetch số lượng khóa học:", error?.message);
    }
  }, []);

  const decreaseCount = (amount: number = 1) => {
    setPendingCoursesCount((prev) => Math.max(0, prev - amount));
  };

  useEffect(() => {
    fetchPendingCount();
    const interval = setInterval(() => {
      fetchPendingCount();
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchPendingCount]);

  return (
    <NotificationContext.Provider
      value={{ pendingCoursesCount, fetchPendingCount, decreaseCount }}
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
