import { create } from "zustand";
import type { Notification } from "../@types/notification.types";

type NotificationStore = {
  instructorNotifications: Notification[];
  studentNotifications: Notification[];

  addInstructorNotification: (notification: Notification) => void;
  addStudentNotification: (notification: Notification) => void;

  clearInstructorNotifications: () => void;
  clearStudentNotifications: () => void;
  clearAllNotifications: () => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
  instructorNotifications: [],
  studentNotifications: [],

  addInstructorNotification: (notification) =>
    set((state) => ({
      instructorNotifications: [notification, ...state.instructorNotifications],
    })),

  addStudentNotification: (notification) =>
    set((state) => ({
      studentNotifications: [notification, ...state.studentNotifications],
    })),

  clearInstructorNotifications: () =>
    set({
      instructorNotifications: [],
    }),

  clearStudentNotifications: () =>
    set({
      studentNotifications: [],
    }),

  clearAllNotifications: () =>
    set({
      instructorNotifications: [],
      studentNotifications: [],
    }),
}));
