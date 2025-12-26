import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '@/lib/api-client';
import { useSocket } from '@/providers/socket-provider';
import { useToast } from '@/components/ui/use-toast';

export interface Message {
    id: string;
    conversationId: string;
    content: string;
    senderType: 'USER' | 'ADMIN' | 'SYSTEM' | 'AI';
    senderId?: string;
    createdAt: string;
    isRead: boolean;
}

export interface Conversation {
    id: string;
    userId?: string;
    guestId?: string;
    guestToken?: string;
    guestName?: string;
    guestPhone?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    users?: {
        id: string;
        name: string;
        email: string;
        avatarUrl?: string;
    };
    messages?: Message[]; // Last message
    unreadCount?: number;
}

export function useChat() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const { socket } = useSocket();
    const { toast } = useToast();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch conversations
    const fetchConversations = useCallback(async () => {
        try {
            const response = await apiClient.getConversations({ limit: 50 });
             
            const responseData = response.data as any;
            if (responseData && Array.isArray(responseData.data)) {
                setConversations(responseData.data);
            } else if (Array.isArray(responseData)) {
                setConversations(responseData);
            }
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        }
    }, []);

    // Fetch messages for active conversation
    const fetchMessages = useCallback(async (conversationId: string) => {
        try {
            setLoading(true);
            const response = await apiClient.getChatMessages(conversationId, { limit: 50 });
             
            const responseData = response.data as any;
            if (responseData && Array.isArray(responseData.data)) {
                setMessages(responseData.data);
                scrollToBottom();
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error);
            toast({
                title: 'Error',
                description: 'Failed to load messages',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    // Send message
    const sendMessage = useCallback(async (content: string) => {
        if (!activeConversation || !content.trim()) return;

        try {
            setSending(true);
            // Optimistic update
            const tempId = Date.now().toString();
            const tempMessage: Message = {
                id: tempId,
                conversationId: activeConversation.id,
                content,
                senderType: 'ADMIN',
                createdAt: new Date().toISOString(),
                isRead: true,
            };

            setMessages(prev => [...prev, tempMessage]);
            scrollToBottom();

            const response = await apiClient.sendChatMessage({
                conversationId: activeConversation.id,
                content,
                senderType: 'ADMIN',
            });

            // Replace temp message with real one
            if (response.data) {
                setMessages(prev => prev.map(m => m.id === tempId ? response.data as Message : m));
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            toast({
                title: 'Error',
                description: 'Failed to send message',
                variant: 'destructive',
            });
            // Remove temp message on error
            setMessages(prev => prev.filter(m => m.senderType !== 'ADMIN' || m.content !== content));
        } finally {
            setSending(false);
        }
    }, [activeConversation, toast]);

    // Select conversation
    const selectConversation = useCallback((conversation: Conversation) => {
        setActiveConversation(conversation);
        fetchMessages(conversation.id);

        // Join socket room
        if (socket) {
            socket.emit('chat:subscribe', { conversationId: conversation.id });
        }
    }, [fetchMessages, socket]);

    // Scroll to bottom
    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    // Socket listeners
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (data: Message) => {
            // If message belongs to active conversation, add it
            if (activeConversation && data.conversationId === activeConversation.id) {
                setMessages(prev => {
                    // Avoid duplicates
                    if (prev.some(m => m.id === data.id)) return prev;
                    return [...prev, data];
                });
                scrollToBottom();
            }

            // Update conversation list (last message)
            setConversations(prev => prev.map(c => {
                if (c.id === data.conversationId) {
                    return {
                        ...c,
                        messages: [data],
                        updatedAt: data.createdAt,
                    };
                }
                return c;
            }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
        };

        const handleNewConversation = (data: Conversation) => {
            setConversations(prev => [data, ...prev]);
        };

        socket.on('chat:message', handleNewMessage);
        socket.on('chat:new_conversation', handleNewConversation);

        return () => {
            socket.off('chat:message', handleNewMessage);
            socket.off('chat:new_conversation', handleNewConversation);
        };
    }, [socket, activeConversation]);

    // Initial load
    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    return {
        conversations,
        activeConversation,
        messages,
        loading,
        sending,
        messagesEndRef,
        selectConversation,
        sendMessage,
        refreshConversations: fetchConversations,
    };
}
