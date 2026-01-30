'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './button';
import { Input } from './input';
import { ScrollArea } from './scroll-area';
import {
    MessageSquareMore, X, Send, Loader2,
    Headphones,
    ExternalLink,
    LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiClient, API_ENDPOINTS } from '@/lib/api';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

interface ChatWidgetProps {
    zaloPhoneNumber: string;
    position?: 'bottom-right' | 'bottom-left';
}

interface ConversationState {
    id: string;
    guestId: string;
    guestToken: string;
}

interface ChatMessage {
    id: string;
    conversationId: string;
    content: string;
    senderType: string;
    senderId?: string;
    createdAt: string;
    _sent?: boolean; // Mark as sent via HTTP to prevent WebSocket duplicate
}

type ChatMode = 'menu' | 'zalo' | 'direct';

const LOCAL_KEY = 'guestChatSession';

export function ChatWidget({
    zaloPhoneNumber,
    position = 'bottom-right'
}: ChatWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<ChatMode>('menu');
    const [showPulse, setShowPulse] = useState(true);
    // Direct chat state
    const [guestName, setGuestName] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [initialMessage, setInitialMessage] = useState('');
    const [formErrors, setFormErrors] = useState<string[]>([]); // Track invalid fields
    const [message, setMessage] = useState('');
    const [conversation, setConversation] = useState<ConversationState | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const positionClasses = {
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
    };

    // Hide pulse after first interaction
    useEffect(() => {
        if (isOpen) setShowPulse(false);
    }, [isOpen]);

    // Create socket connection
    const createChatSocket = useCallback((conv: ConversationState) => {
        let socketUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010';
        socketUrl = socketUrl.replace(/\/api\/v1\/?$/, '').replace(/\/api\/?$/, '');
        if (socketUrl.endsWith('/')) {
            socketUrl = socketUrl.slice(0, -1);
        }

        const newSocket = io(`${socketUrl}/api/v1/chat`, {
            path: '/socket.io',
            transports: ['websocket', 'polling'],
            autoConnect: true,
            auth: {
                guestId: conv.guestId,
                guestToken: conv.guestToken,
            },
        });

        newSocket.on('connect', () => {
            console.log('[ChatWidget] Socket connected');
            newSocket.emit('join_conversation', { conversationId: conv.id });
        });

        newSocket.on('disconnect', () => {
            console.log('[ChatWidget] Socket disconnected');
        });

        return newSocket;
    }, []);

    // Load existing conversation
    useEffect(() => {
        const saved = localStorage.getItem(LOCAL_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved) as ConversationState;
                setConversation(parsed);
                fetchMessages(parsed);
                const sock = createChatSocket(parsed);
                setSocket(sock);
                return () => {
                    sock.emit('leave_conversation', { conversationId: parsed.id });
                    sock.disconnect();
                };
            } catch {
                // ignore
            }
        }
    }, [createChatSocket]);

    // Socket message listener
    useEffect(() => {
        if (!socket || !conversation) return;

        socket.emit('join_conversation', { conversationId: conversation.id });

        const handleNewMessage = (payload: { id?: string; conversationId: string; content: string; senderType: string; senderId?: string; createdAt: string }) => {
            if (payload.conversationId !== conversation.id) return;

            const newMessage: ChatMessage = {
                id: payload.id || `msg-${Date.now()}`,
                conversationId: payload.conversationId,
                content: payload.content,
                senderType: payload.senderType,
                senderId: payload.senderId,
                createdAt: payload.createdAt || new Date().toISOString()
            };

            setMessages(prev => {
                // Skip if message already exists (by id or same content sent recently)
                if (prev.some(m => m.id === newMessage.id)) return prev;
                // Skip if this is our own message that we sent via HTTP (already added as temp)
                if (newMessage.senderId === conversation.guestId && newMessage.senderType === 'GUEST') {
                    // Check if we already have this message (sent by us)
                    const existingIndex = prev.findIndex(m => m.content === newMessage.content && m.senderType === 'GUEST' &&
                        (m.id.startsWith('temp-') || m._sent)
                    );
                    if (existingIndex !== -1) {
                        // Replace temp message with real one from server
                        const updated = [...prev];
                        updated[existingIndex] = newMessage;
                        return updated;
                    }
                }
                return [...prev, newMessage];
            });
        };

        socket.on('new_message', handleNewMessage);

        return () => {
            socket.off('new_message', handleNewMessage);
            socket.emit('leave_conversation', { conversationId: conversation.id });
        };
    }, [socket, conversation]);

    // Auto scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const fetchMessages = async (state: ConversationState) => {
        try {
            setLoading(true);
            const res = await apiClient.get(API_ENDPOINTS.CHAT.CONVERSATION_MESSAGES(state.id), {
                params: { limit: 50, guestId: state.guestId, guestToken: state.guestToken }
            });
            const payload = res.data;
            const data = Array.isArray(payload)
                ? payload
                : payload.data || payload.messages || [];
            setMessages(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const startConversation = async () => {
        // Validate inputs
        const errors: string[] = [];
        if (!guestName.trim()) errors.push('Họ tên');
        if (!guestPhone.trim()) errors.push('Số điện thoại');
        if (!initialMessage.trim()) errors.push('Tin nhắn');

        if (errors.length > 0) {
            setFormErrors(errors);
            toast.error(`Vui lòng nhập: ${errors.join(', ')}`);
            return;
        }

        setFormErrors([]);
        setLoading(true);
        try {
            const res = await apiClient.post(API_ENDPOINTS.CHAT.CONVERSATIONS, {
                guestName,
                guestPhone,
                initialMessage,
            });
            // Response is wrapped: { success, data, message }
            const payload = res.data?.data || res.data;
            if (payload.id && payload.guestId && payload.guestToken) {
                const state: ConversationState = { id: payload.id, guestId: payload.guestId, guestToken: payload.guestToken };
                setConversation(state);
                localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
                setMessages(payload.messages || []);
                setInitialMessage('');
                const sock = createChatSocket(state);
                setSocket(sock);
                toast.success('Đã bắt đầu chat');
            } else {
                console.error('Invalid response:', payload);
                toast.error('Phản hồi không hợp lệ từ server');
            }
        } catch (error) {
            console.error(error);
            toast.error('Không thể tạo cuộc trò chuyện');
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!conversation || !message.trim()) return;
        setSending(true);
        const tempId = `temp-${Date.now()}`;
        const temp: ChatMessage = {
            id: tempId,
            conversationId: conversation.id,
            content: message,
            senderType: 'GUEST',
            senderId: conversation.guestId,
            createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, temp]);
        setMessage('');
        try {
            const res = await apiClient.post(API_ENDPOINTS.CHAT.MESSAGES, {
                conversationId: conversation.id,
                content: temp.content,
                senderId: conversation.guestId,
                senderType: 'GUEST',
                guestToken: conversation.guestToken,
            });
            // Response is wrapped: { success, data, message }
            const real = res.data?.data || res.data;
            // Replace temp message with real one, mark as sent to prevent WebSocket duplicate
            setMessages(prev => prev.map(m => m.id === tempId ? { ...real, _sent: true } : m));
        } catch (error) {
            console.error(error);
            toast.error('Gửi tin nhắn thất bại');
            setMessages(prev => prev.filter(m => m.id !== tempId));
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    };

    const handleZaloClick = () => {
        const cleanPhone = zaloPhoneNumber.replace(/[\s\-\(\)\+]/g, '');
        window.open(`https://zalo.me/${cleanPhone}`, '_blank', 'width=400,height=600');
    };

    const handleClose = () => {
        setIsOpen(false);
        // Reset to menu if no active conversation
        if (!conversation) {
            setMode('menu');
        }
    };

    const endConversation = () => {
        // Disconnect socket
        if (socket) {
            socket.emit('leave_conversation', { conversationId: conversation?.id });
            socket.disconnect();
            setSocket(null);
        }
        // Clear state
        setConversation(null);
        setMessages([]);
        setGuestName('');
        setGuestPhone('');
        setMessage('');
        setMode('menu');
        // Clear localStorage
        localStorage.removeItem(LOCAL_KEY);
        toast.success('Đã kết thúc cuộc trò chuyện');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (conversation) {
                sendMessage();
            } else {
                startConversation();
            }
        }
    };

    return (
        <div className={cn('fixed z-50', positionClasses[position])}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className={cn(
                            'absolute bottom-16 mb-2 w-[340px] sm:w-[380px] rounded-2xl shadow-2xl overflow-hidden',
                            'bg-background border border-border',
                            position === 'bottom-right' ? 'right-0' : 'left-0'
                        )}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary to-primary/80 p-4 text-primary-foreground">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-white/20">
                                        <Headphones className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">Audio Tài Lộc</h3>
                                        <p className="text-xs opacity-90">Hỗ trợ trực tuyến 24/7</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-primary-foreground hover:bg-white/20"
                                    onClick={handleClose}
                                    aria-label="Đóng cửa sổ chat"
                                >
                                    <X className="w-4 h-4" aria-hidden="true" />
                                </Button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="h-[400px] flex flex-col">
                            {mode === 'menu' && !conversation && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex-1 p-4 space-y-3"
                                >
                                    <p className="text-sm text-muted-foreground text-center mb-4">
                                        Chọn phương thức liên hệ
                                    </p>

                                    {/* Zalo Option */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleZaloClick}
                                        className="w-full p-4 rounded-xl border-2 border-[#0068FF]/20 bg-gradient-to-r from-[#0068FF]/5 to-[#0084FF]/5 hover:border-[#0068FF]/50 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-[#0068FF] flex items-center justify-center flex-shrink-0">
                                                <svg className="w-7 h-7" viewBox="0 0 48 48" fill="none">
                                                    <path d="M24 4C12.96 4 4 12.96 4 24c0 9.52 6.64 17.52 15.52 19.52V48l4.48-4.48c11.04 0 20-8.96 20-20S35.04 4 24 4z" fill="white" />
                                                    <path d="M17.28 27.76c-.48 0-.88-.4-.88-.88v-5.76c0-.48.4-.88.88-.88s.88.4.88.88v5.76c0 .48-.4.88-.88.88zm4.32 0c-.48 0-.88-.4-.88-.88v-5.76c0-.48.4-.88.88-.88s.88.4.88.88v5.76c0 .48-.4.88-.88.88zm4.8 0c-.48 0-.88-.4-.88-.88v-5.76c0-.48.4-.88.88-.88s.88.4.88.88v5.76c0 .48-.4.88-.88.88zm4.32 0c-.48 0-.88-.4-.88-.88v-5.76c0-.48.4-.88.88-.88s.88.4.88.88v5.76c0 .48-.4.88-.88.88z" fill="#0068FF" />
                                                </svg>
                                            </div>
                                            <div className="text-left flex-1">
                                                <div className="font-semibold text-foreground flex items-center gap-2">
                                                    Chat qua Zalo
                                                    <ExternalLink className="w-3 h-3 opacity-50" />
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-0.5">Mở ứng dụng Zalo để nhắn tin</p>
                                            </div>
                                        </div>
                                    </motion.button>

                                    {/* Direct Chat Option */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setMode('direct')}
                                        className="w-full p-4 rounded-xl border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 hover:border-primary/50 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                                                <MessageSquareMore className="w-6 h-6 text-foreground dark:text-white" />
                                            </div>
                                            <div className="text-left flex-1">
                                                <div className="font-semibold text-foreground">Chat trực tiếp</div>
                                                <p className="text-xs text-muted-foreground mt-0.5">Nhắn tin ngay trên website</p>
                                            </div>
                                        </div>
                                    </motion.button>

                                    <div className="pt-4 text-center">
                                        <p className="text-xs text-muted-foreground">
                                            Hotline: <a href={`tel:${zaloPhoneNumber}`} className="text-primary font-medium hover:underline">{zaloPhoneNumber}</a>
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {(mode === 'direct' || conversation) && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex-1 flex flex-col"
                                >
                                    {!conversation ? (
                                        // Start conversation form
                                        <div className="flex-1 p-4 space-y-3 overflow-auto">
                                            <button
                                                onClick={() => setMode('menu')}
                                                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mb-2"
                                            >
                                                ← Quay lại
                                            </button>
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-muted-foreground">Họ tên *</label>
                                                <Input
                                                    value={guestName}
                                                    onChange={(e) => { setGuestName(e.target.value); if (formErrors.includes('Họ tên')) setFormErrors(prev => prev.filter(err => err !== 'Họ tên')); }}
                                                    placeholder="Nguyễn Văn A"
                                                    className={cn("h-9 text-sm", formErrors.includes('Họ tên') && "border-red-500 focus-visible:ring-red-500")}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-muted-foreground">Số điện thoại *</label>
                                                <Input
                                                    value={guestPhone}
                                                    onChange={(e) => { setGuestPhone(e.target.value); if (formErrors.includes('Số điện thoại')) setFormErrors(prev => prev.filter(err => err !== 'Số điện thoại')); }}
                                                    placeholder="0912345678"
                                                    className={cn("h-9 text-sm", formErrors.includes('Số điện thoại') && "border-red-500 focus-visible:ring-red-500")}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-muted-foreground">Tin nhắn *</label>
                                                <Input
                                                    value={initialMessage}
                                                    onChange={(e) => { setInitialMessage(e.target.value); if (formErrors.includes('Tin nhắn')) setFormErrors(prev => prev.filter(err => err !== 'Tin nhắn')); }}
                                                    onKeyPress={handleKeyPress}
                                                    placeholder="Mình cần tư vấn..."
                                                    className={cn("h-9 text-sm", formErrors.includes('Tin nhắn') && "border-red-500 focus-visible:ring-red-500")}
                                                />
                                            </div>
                                            <Button
                                                onClick={startConversation}
                                                disabled={loading}
                                                className="w-full mt-2"
                                            >
                                                {loading ? (
                                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                ) : (
                                                    <Send className="w-4 h-4 mr-2" />
                                                )}
                                                Bắt đầu chat
                                            </Button>
                                        </div>
                                    ) : (
                                        // Chat messages
                                        <>
                                            <ScrollArea className="flex-1 p-3">
                                                <div className="space-y-3">
                                                    {loading && messages.length === 0 && (
                                                        <div className="flex justify-center py-8">
                                                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                                        </div>
                                                    )}
                                                    {messages.map((msg) => {
                                                        // GUEST messages on right, ADMIN messages on left
                                                        const isGuestMessage = msg.senderType === 'GUEST' || msg.senderType === 'USER';
                                                        return (
                                                            <motion.div
                                                                key={msg.id}
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className={cn(
                                                                    'flex',
                                                                    isGuestMessage ? 'justify-end' : 'justify-start'
                                                                )}
                                                            >
                                                                <div
                                                                    className={cn(
                                                                        'max-w-[80%] rounded-2xl px-3 py-2 text-sm',
                                                                        isGuestMessage
                                                                            ? 'bg-primary text-primary-foreground rounded-br-md'
                                                                            : 'bg-muted rounded-bl-md'
                                                                    )}
                                                                >
                                                                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                                                                    <p className={cn(
                                                                        'text-[11px] mt-1',
                                                                        isGuestMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                                                    )}>
                                                                        {format(new Date(msg.createdAt), 'HH:mm')}
                                                                    </p>
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })}
                                                    <div ref={scrollRef} />
                                                </div>
                                            </ScrollArea>

                                            {/* Message input */}
                                            <div className="p-3 border-t bg-muted/30">
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-9 w-9 text-muted-foreground hover:text-destructive"
                                                        onClick={endConversation}
                                                        title="Kết thúc chat"
                                                        aria-label="Kết thúc cuộc trò chuyện"
                                                    >
                                                        <LogOut className="w-4 h-4" aria-hidden="true" />
                                                    </Button>
                                                    <Input
                                                        ref={inputRef}
                                                        value={message}
                                                        onChange={(e) => setMessage(e.target.value)}
                                                        onKeyPress={handleKeyPress}
                                                        placeholder="Nhập tin nhắn..."
                                                        className="flex-1 h-9 text-sm"
                                                        disabled={sending}
                                                    />
                                                    <Button
                                                        size="icon"
                                                        className="h-9 w-9"
                                                        onClick={sendMessage}
                                                        disabled={sending || !message.trim()}
                                                        aria-label="Gửi tin nhắn"
                                                    >
                                                        {sending ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                                                        ) : (
                                                            <Send className="w-4 h-4" aria-hidden="true" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Chat Button */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
                className="relative"
            >
                {/* Pulse rings */}
                {showPulse && !isOpen && (
                    <>
                        <motion.div
                            className="absolute inset-0 rounded-full bg-primary/30"
                            animate={{ scale: [1, 1.5, 2], opacity: [0.4, 0.2, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                        />
                        <motion.div
                            className="absolute inset-0 rounded-full bg-primary/20"
                            animate={{ scale: [1, 1.3, 1.6], opacity: [0.3, 0.15, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.5, ease: 'easeOut' }}
                        />
                    </>
                )}

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? 'Đóng cửa sổ chat' : 'Mở cửa sổ chat hỗ trợ'}
                    aria-expanded={isOpen}
                    className={cn(
                        'relative w-14 h-14 rounded-full shadow-lg transition-all duration-300',
                        'bg-gradient-to-br from-primary via-primary to-accent',
                        'hover:shadow-xl hover:shadow-primary/30',
                        'flex items-center justify-center',
                        'border-2 border-white/20',
                        isOpen && 'rotate-0'
                    )}
                >
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X className="w-6 h-6 text-foreground dark:text-white" aria-hidden="true" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="chat"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <MessageSquareMore className="w-6 h-6 text-foreground dark:text-white" aria-hidden="true" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>

                {/* Unread badge - can be used later */}
                {/* <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-foreground dark:text-white font-bold border-2 border-white">
 1
 </div> */}
            </motion.div>
        </div>
    );
}
