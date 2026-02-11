import { App } from "antd";
import { useEffect } from "react";
import { setNotificationInstance } from "../../utils/notification.utils";

const GlobalNotification = () => {
  // Hook này chỉ hoạt động bên trong component con của <App>
  const { notification } = App.useApp();

  useEffect(() => {
    // Gán instance vào biến global ngay khi app chạy
    setNotificationInstance(notification);
  }, [notification]);

  return null; // Không render giao diện gì cả
};

export default GlobalNotification;
