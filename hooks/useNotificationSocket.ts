import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_NOTIFICATION_SOCKET_URL || "http://localhost:3006";

export const useNotificationSocket = (
  token: string,
  onNotification?: (notification: any) => void
) => {
  useEffect(() => {
    if (!token) return;
    const memberId = localStorage.getItem("memberId");
    if (!memberId) {
      console.error("Notification socket init failed: Missing memberId");
      return;
    }

    const socket: Socket = io(SOCKET_URL, {
      auth: { token },
      query: { memberId },
    });

    socket.on("connect", () => {
      console.log("✅ Connected to notification service");
    });

    socket.on("notification", (notification) => {
      console.log("🔔 New notification:", notification);
      if (onNotification) onNotification(notification);
    });

    socket.on("disconnect", () => {
      console.log("⚪ Disconnected from notification service");
    });

    return () => {
      socket.disconnect();
    };
  }, [token, onNotification]);
};
