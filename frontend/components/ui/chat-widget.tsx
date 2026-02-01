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
import Image from 'next/image';

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
        <div suppressHydrationWarning className={cn('fixed z-[9999] bottom-4 right-4 flex flex-col items-end gap-3', position === 'bottom-left' && 'right-auto left-4 items-start')}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className={cn(
                            'absolute bottom-16 mb-2 w-[92vw] max-w-[380px] rounded-2xl shadow-2xl overflow-hidden',
                            'bg-background border border-border',
                            position === 'bottom-right' ? 'right-0' : 'left-0'
                        )}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 p-5 text-primary-foreground relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20">
                                        <Headphones className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm tracking-tight uppercase">Audio Tài Lộc</h3>
                                        <div className="flex items-center gap-1.5 leading-none">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                            <p className="text-[10px] uppercase font-bold tracking-[0.1em] opacity-80">Support Online</p>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 text-primary-foreground hover:bg-white/20 rounded-full transition-all"
                                    onClick={handleClose}
                                    aria-label="Đóng cửa sổ chat"
                                >
                                    <X className="w-5 h-5" aria-hidden="true" />
                                </Button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="h-[60vh] min-h-[320px] max-h-[520px] flex flex-col">
                            {mode === 'menu' && !conversation && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex-1 p-5 space-y-4"
                                >
                                    <div className="text-center space-y-1 mb-6">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Tư vấn chuyên nghiệp</p>
                                        <h4 className="text-lg font-bold tracking-tight">Chào bạn! Chúng tôi có thể giúp gì?</h4>
                                    </div>

                                    {/* Zalo Option */}
                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleZaloClick}
                                        className="w-full p-4 rounded-2xl border border-[#0068FF]/20 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md hover:border-[#0068FF]/50 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-[#0068FF] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#0068FF]/20 overflow-hidden">
                                                <Image
                                                    src="/images/logo/zalo.png"
                                                    alt="Zalo"
                                                    width={32}
                                                    height={32}
                                                    className="w-8 h-8 object-contain"
                                                />
                                            </div>
                                            <div className="text-left flex-1">
                                                <div className="font-bold text-foreground flex items-center gap-2 group-hover:text-[#0068FF] transition-colors leading-tight">
                                                    Zalo Chat
                                                    <ExternalLink className="w-3 h-3 opacity-40" />
                                                </div>
                                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-1">Kết nối nhanh qua Zalo</p>
                                            </div>
                                        </div>
                                    </motion.button>

                                    {/* Direct Chat Option */}
                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setMode('direct')}
                                        className="w-full p-4 rounded-2xl border border-primary/20 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md hover:border-primary/50 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20 text-white">
                                                <MessageSquareMore className="w-6 h-6" />
                                            </div>
                                            <div className="text-left flex-1">
                                                <div className="font-bold text-foreground group-hover:text-primary transition-colors leading-tight">Chat Trực Tiếp</div>
                                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-1">Hỗ trợ ngay trên web</p>
                                            </div>
                                        </div>
                                    </motion.button>

                                    <div className="pt-6 text-center">
                                        <a
                                            href={`tel:${zaloPhoneNumber}`}
                                            className="inline-flex flex-col items-center gap-1 group"
                                        >
                                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 group-hover:text-primary transition-colors">Hoặc gọi Hotline</span>
                                            <span className="text-lg font-black text-foreground group-hover:text-primary transition-colors tracking-tight">{zaloPhoneNumber}</span>
                                        </a>
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
                                        <div className="flex-1 p-6 space-y-4 overflow-auto">
                                            <button
                                                onClick={() => setMode('menu')}
                                                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-all mb-2"
                                            >
                                                ← Quay lại menu
                                            </button>

                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Họ tên của bạn *</label>
                                                    <Input
                                                        value={guestName}
                                                        onChange={(e) => { setGuestName(e.target.value); if (formErrors.includes('Họ tên')) setFormErrors(prev => prev.filter(err => err !== 'Họ tên')); }}
                                                        placeholder="Nguyễn Văn A"
                                                        className={cn("h-11 rounded-xl text-sm border-border/60 bg-background/50 focus:bg-background shadow-sm transition-all", formErrors.includes('Họ tên') && "border-red-500/50 focus-visible:ring-red-500/10")}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Số điện thoại *</label>
                                                    <Input
                                                        value={guestPhone}
                                                        onChange={(e) => { setGuestPhone(e.target.value); if (formErrors.includes('Số điện thoại')) setFormErrors(prev => prev.filter(err => err !== 'Số điện thoại')); }}
                                                        placeholder="0912 345 678"
                                                        className={cn("h-11 rounded-xl text-sm border-border/60 bg-background/50 focus:bg-background shadow-sm transition-all", formErrors.includes('Số điện thoại') && "border-red-500/50 focus-visible:ring-red-500/10")}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Bạn cần hỗ trợ gì? *</label>
                                                    <Input
                                                        value={initialMessage}
                                                        onChange={(e) => { setInitialMessage(e.target.value); if (formErrors.includes('Tin nhắn')) setFormErrors(prev => prev.filter(err => err !== 'Tin nhắn')); }}
                                                        onKeyPress={handleKeyPress}
                                                        placeholder="Tôi muốn tư vấn bộ dàn karaoke..."
                                                        className={cn("h-11 rounded-xl text-sm border-border/60 bg-background/50 focus:bg-background shadow-sm transition-all", formErrors.includes('Tin nhắn') && "border-red-500/50 focus-visible:ring-red-500/10")}
                                                    />
                                                </div>
                                                <Button
                                                    onClick={startConversation}
                                                    disabled={loading}
                                                    className="w-full h-11 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20 mt-4 elite-button"
                                                >
                                                    {loading ? (
                                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                    ) : (
                                                        <Send className="w-4 h-4 mr-2" />
                                                    )}
                                                    Kết nối ngay
                                                </Button>
                                            </div>
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

            {/* Zalo + Direct Chat Buttons */}
            <div className="flex flex-col gap-3 relative pointer-events-auto">
                {/* Zalo button */}
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1, translateY: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleZaloClick}
                    aria-label="Chat qua Zalo"
                    className={cn(
                        'w-14 h-14 rounded-full shadow-2xl transition-all duration-300',
                        'bg-gradient-to-br from-[#0068FF] to-[#0052CC]',
                        'hover:shadow-xl hover:shadow-[#0068FF]/30',
                        'flex items-center justify-center',
                        'border-2 border-white/30 ring-4 ring-[#0068FF]/10 relative overflow-hidden'
                    )}
                >
                    <div className="relative z-10 w-8 h-8 overflow-hidden rounded-lg shadow-sm">
                        <Image
                            src="/images/logo/zalo.png"
                            alt="Zalo"
                            width={32}
                            height={32}
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {!isOpen && (
                        <>
                            <motion.div
                                className="absolute inset-0 rounded-full border-2 border-[#0068FF]/40"
                                animate={{ scale: [1, 1.4, 1.8], opacity: [0.6, 0.2, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <motion.div
                                className="absolute inset-0 rounded-full border-2 border-[#0068FF]/20"
                                animate={{ scale: [1, 1.2, 1.4], opacity: [0.4, 0.1, 0] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                            />
                        </>
                    )}
                </motion.button>

                {/* Direct chat button */}
                <div className="relative">
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.1, translateY: -3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setMode('direct');
                            setIsOpen(!isOpen);
                        }}
                        aria-label="Chat trực tiếp"
                        aria-expanded={isOpen}
                        className={cn(
                            'w-14 h-14 rounded-full shadow-2xl transition-all duration-300',
                            'bg-gradient-to-br from-primary via-primary/95 to-primary/90',
                            'hover:shadow-xl hover:shadow-primary/30',
                            'flex items-center justify-center',
                            'border-2 border-white/30 ring-4 ring-primary/10 relative overflow-hidden'
                        )}
                    >
                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <X className="w-6 h-6 text-white" strokeWidth={3} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="chat"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <MessageSquareMore className="w-6 h-6 text-white" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>

                    {!isOpen && showPulse && (
                        <motion.div
                            className="absolute inset-0 rounded-full border-2 border-primary/40"
                            animate={{ scale: [1, 1.4, 1.8], opacity: [0.6, 0.2, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
