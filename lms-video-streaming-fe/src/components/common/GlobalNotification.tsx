import { App } from "antd";
import { useEffect } from "react";
import { setNotificationInstance } from "../../utils/notification.utils";

const GlobalNotification = () => {
  const { notification } = App.useApp();

  useEffect(() => {
    setNotificationInstance(notification);
  }, [notification]);

  return null;
};

export default GlobalNotification;
