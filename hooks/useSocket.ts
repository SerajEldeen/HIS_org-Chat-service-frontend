import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const memberId = localStorage.getItem("memberId");

    if (!token || !memberId) {
      console.error("Socket init failed: Missing token or memberId");
      return;
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    console.log("🔌 Connecting socket with token and memberId:", {
      token,
      memberId: memberId,
    });

    const newSocket = io(SOCKET_URL!, {
      transports: ["websocket"],
      auth: { token },
      query: { memberId },
    });

    newSocket.on("connect", () => {
      console.log("✅ Connected to WebSocket");
    });

    newSocket.on("disconnect", (reason) => {
      console.log("⚪ Disconnected from WebSocket. Reason:", reason);
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ WebSocket connection error:", err.message);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return socket;
};
