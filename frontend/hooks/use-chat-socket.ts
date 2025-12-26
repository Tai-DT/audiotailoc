"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface ChatMessage {
  id: string;
  conversationId: string;
  content: string;
  senderType: string;
  senderId?: string;
  createdAt: string;
}

interface UseChatSocketOptions {
  conversationId?: string;
  guestId?: string;
  guestToken?: string;
}

export function useChatSocket(options: UseChatSocketOptions = {}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messageHandlerRef = useRef<((message: ChatMessage) => void) | null>(null);

  // Initialize socket connection
  useEffect(() => {
    let socketUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010";
    
    // Remove trailing /api/v1 or /api if present to get the root URL
    socketUrl = socketUrl.replace(/\/api\/v1\/?$/, "").replace(/\/api\/?$/, "");
    
    // Ensure no trailing slash
    if (socketUrl.endsWith("/")) {
      socketUrl = socketUrl.slice(0, -1);
    }

    const socketInstance = io(`${socketUrl}/api/v1/chat`, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      autoConnect: true,
      auth: {
        guestId: options.guestId,
        guestToken: options.guestToken,
      },
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      console.log("[Chat Socket] Connected");
      
      // Join conversation if ID provided
      if (options.conversationId) {
        socketInstance.emit("join_conversation", { conversationId: options.conversationId });
      }
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      console.log("[Chat Socket] Disconnected");
    });

    socketInstance.on("connect_error", (err) => {
      console.error("[Chat Socket] Connection error:", err.message);
    });

    // Listen for new messages
    socketInstance.on("new_message", (message: ChatMessage) => {
      console.log("[Chat Socket] New message:", message);
      setMessages(prev => {
        // Prevent duplicates
        if (prev.some(m => m.id === message.id)) return prev;
        return [...prev, message];
      });
      
      // Call external handler if set
      if (messageHandlerRef.current) {
        messageHandlerRef.current(message);
      }
    });

    setSocket(socketInstance);

    return () => {
      if (options.conversationId) {
        socketInstance.emit("leave_conversation", { conversationId: options.conversationId });
      }
      socketInstance.disconnect();
    };
  }, [options.conversationId, options.guestId, options.guestToken]);

  // Join a conversation
  const joinConversation = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      socket.emit("join_conversation", { conversationId });
    }
  }, [socket, isConnected]);

  // Leave a conversation
  const leaveConversation = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      socket.emit("leave_conversation", { conversationId });
    }
  }, [socket, isConnected]);

  // Send a message via WebSocket
  const sendMessage = useCallback((conversationId: string, content: string) => {
    if (socket && isConnected) {
      socket.emit("send_message", { conversationId, content });
    }
  }, [socket, isConnected]);

  // Set external message handler
  const onMessage = useCallback((handler: (message: ChatMessage) => void) => {
    messageHandlerRef.current = handler;
  }, []);

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    socket,
    isConnected,
    messages,
    joinConversation,
    leaveConversation,
    sendMessage,
    onMessage,
    clearMessages,
  };
}
