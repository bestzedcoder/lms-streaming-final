import React, { createContext, useContext, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import type { IMessage, StompSubscription } from "@stomp/stompjs";
import { useAuthStore } from "../store/useAuthStore.store";
import { useNotificationStore } from "../store/useNotification.store";
import type { Notification } from "../@types/notification.types";
type WebSocketContextType = {
  connected: boolean;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const stompClientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<StompSubscription[]>([]);
  const { user } = useAuthStore();

  const addInstructorNotification = useNotificationStore(
    (state) => state.addInstructorNotification,
  );

  const addStudentNotification = useNotificationStore(
    (state) => state.addStudentNotification,
  );

  useEffect(() => {
    if (!user) {
      subscriptionsRef.current.forEach((sub) => sub.unsubscribe());
      subscriptionsRef.current = [];

      stompClientRef.current?.deactivate();
      stompClientRef.current = null;
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS("/api/ws"),
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("WebSocket connected");

        subscriptionsRef.current.forEach((sub) => sub.unsubscribe());
        subscriptionsRef.current = [];

        if (user.role === "INSTRUCTOR") {
          const instructorSub = client.subscribe(
            "/user/queue/instructor-notifications",
            (message: IMessage) => {
              console.log("Instructor raw message:", message.body);

              const payload = JSON.parse(message.body) as Notification;

              console.log("Instructor notification:", payload);

              addInstructorNotification(payload);
            },
          );

          subscriptionsRef.current.push(instructorSub);
        }

        if (user.role === "STUDENT") {
          const studentSub = client.subscribe(
            "/user/queue/student-notifications",
            (message: IMessage) => {
              console.log("Student raw message:", message.body);

              const payload = JSON.parse(message.body) as Notification;

              console.log("Student notification:", payload);

              addStudentNotification(payload);
            },
          );

          subscriptionsRef.current.push(studentSub);
        }
      },

      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
      },

      onWebSocketError: (error) => {
        console.error("WebSocket error:", error);
      },

      onDisconnect: () => {
        console.log("WebSocket disconnected");
      },
    });

    stompClientRef.current = client;
    client.activate();

    return () => {
      subscriptionsRef.current.forEach((sub) => sub.unsubscribe());
      subscriptionsRef.current = [];

      client.deactivate();
      stompClientRef.current = null;
    };
  }, [user?.id, user?.role, addInstructorNotification, addStudentNotification]);

  return (
    <WebSocketContext.Provider
      value={{ connected: !!stompClientRef.current?.connected }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);

  if (!context) {
    throw new Error("useWebSocket must be used inside WebSocketProvider");
  }

  return context;
};
