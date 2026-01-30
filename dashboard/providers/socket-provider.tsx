"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

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
        // Connect to backend URL (default to localhost:3010 if not set)
        const socketUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010";

        const socketInstance = io(socketUrl, {
            path: "/api/v1/socket.io",
            transports: ["websocket", "polling"],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 20,
            auth: typeof window !== 'undefined' ? { token: localStorage.getItem('accessToken') } : {},
        });

        socketInstance.on("connect", () => {
            console.log("[SocketProvider] Connected to:", socketUrl);
            setIsConnected(true);
        });

        socketInstance.on("connect_error", (error) => {
            console.error("[SocketProvider] Connection error:", error.message);
            setIsConnected(false);
        });

        socketInstance.on("disconnect", () => {
            setIsConnected(false);
        });

        // Small delay to ensure clean startup
        const timeout = setTimeout(() => setSocket(socketInstance), 100);

        return () => {
            clearTimeout(timeout);
            socketInstance.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
