import { notification } from "antd";
import type { NotificationInstance } from "antd/es/notification/interface";

let notificationInstance: NotificationInstance | null = null;

export const setNotificationInstance = (instance: NotificationInstance) => {
  notificationInstance = instance;
};

type NotificationType = "success" | "info" | "warning" | "error";

export const notify = {
  open: (type: NotificationType, message: string, description?: string) => {
    if (!notificationInstance) {
      console.warn("Notification instance not ready, using default.");
      notification.open({ type, message, description });
      return;
    }

    notificationInstance[type]({
      message: message,
      description: description,
      placement: "topRight",
      duration: 3,
    });
  },

  success: (message: string, description?: string) =>
    notify.open("success", message, description),

  error: (message: string, description?: string) =>
    notify.open("error", message, description),

  info: (message: string, description?: string) =>
    notify.open("info", message, description),

  warning: (message: string, description?: string) =>
    notify.open("warning", message, description),
};
