"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { authStorage } from "@/lib/auth-storage";

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Determine the socket URL
        // If NEXT_PUBLIC_API_URL is defined, use it (stripping /api/v1 if present)
        // Otherwise default to http://localhost:3010
        let socketUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010";
        
        // Remove trailing /api/v1 or /api if present to get the root URL
        socketUrl = socketUrl.replace(/\/api\/v1\/?$/, "").replace(/\/api\/?$/, "");
        
        // Ensure no trailing slash
        if (socketUrl.endsWith("/")) {
            socketUrl = socketUrl.slice(0, -1);
        }

        const token = authStorage.getAccessToken();

        // Backend uses namespace /api/v1/realtime
        const socketInstance = io(`${socketUrl}/api/v1/realtime`, {
            path: "/socket.io",
            transports: ["websocket", "polling"],
            autoConnect: true,
            auth: {
                token: token ? `Bearer ${token}` : undefined,
            },
        });

        socketInstance.on("connect", () => {
            // Only log in development if explicitly enabled
            if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_SOCKET_LOGS === 'true') {
                console.log("Socket connected");
            }
            setIsConnected(true);
        });

        socketInstance.on("disconnect", () => {
            // Only log in development if explicitly enabled
            if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_SOCKET_LOGS === 'true') {
                console.log("Socket disconnected");
            }
            setIsConnected(false);
        });

        socketInstance.on("connect_error", (err) => {
            // Always log connection errors as they indicate real issues
            console.error("Socket connection error:", err);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};