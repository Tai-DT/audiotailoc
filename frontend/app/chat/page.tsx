"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { toast } from "react-hot-toast"
import { apiClient, API_ENDPOINTS } from "@/lib/api"
import { CONTACT_CONFIG } from "@/lib/contact-config"
import { io, Socket } from "socket.io-client"
import { MagicCard } from "@/components/ui/magic-card"
import { BorderBeam } from "@/components/ui/border-beam"
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { Send, MessageCircle, User, Phone as PhoneIcon, Loader2 } from "lucide-react"

interface ConversationState {
  id: string
  guestId: string
  guestToken: string
}

interface ChatMessage {
  id: string
  conversationId: string
  content: string
  senderType: string
  senderId?: string
  createdAt: string
}

interface ChatMessagesResponse {
  data?: ChatMessage[]
  messages?: ChatMessage[]
}

interface StartConversationResponse {
  id: string
  guestId: string
  guestToken: string
  messages?: ChatMessage[]
}

type SendMessageResponse = ChatMessage

const LOCAL_KEY = "guestChatSession"

export default function ChatPage() {
  const [guestName, setGuestName] = useState("")
  const [guestPhone, setGuestPhone] = useState<string>(CONTACT_CONFIG.phone.number || "")
  const [initialMessage, setInitialMessage] = useState("")
  const [message, setMessage] = useState("")
  const [conversation, setConversation] = useState<ConversationState | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Create chat socket connection
  const createChatSocket = useCallback((conv: ConversationState) => {
    let socketUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010"
    socketUrl = socketUrl.replace(/\/api\/v1\/?$/, "").replace(/\/api\/?$/, "")
    if (socketUrl.endsWith("/")) {
      socketUrl = socketUrl.slice(0, -1)
    }

    const newSocket = io(`${socketUrl}/api/v1/chat`, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      autoConnect: true,
      auth: {
        guestId: conv.guestId,
        guestToken: conv.guestToken,
      },
    })

    newSocket.on("connect", () => {
      console.log("[Chat] Socket connected")
      newSocket.emit("join_conversation", { conversationId: conv.id })
    })

    newSocket.on("disconnect", () => {
      console.log("[Chat] Socket disconnected")
    })

    newSocket.on("connect_error", (err) => {
      console.error("[Chat] Socket error:", err.message)
    })

    return newSocket
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ConversationState
        setConversation(parsed)
        fetchMessages(parsed)
        
        // Create socket for existing conversation
        const sock = createChatSocket(parsed)
        setSocket(sock)
        
        return () => {
          sock.emit("leave_conversation", { conversationId: parsed.id })
          sock.disconnect()
        }
      } catch {
        // ignore
      }
    }
  }, [createChatSocket])

  useEffect(() => {
    if (!socket || !conversation) return

    // Join conversation room
    socket.emit('join_conversation', { conversationId: conversation.id })

    // Listen for new messages
    const handleNewMessage = (payload: { id?: string; conversationId: string; content: string; senderType: string; senderId?: string; createdAt: string }) => {
      // Check if message belongs to current conversation
      if (payload.conversationId !== conversation.id) return

      const newMessage: ChatMessage = {
        id: payload.id || `msg-${Date.now()}`,
        conversationId: payload.conversationId,
        content: payload.content,
        senderType: payload.senderType,
        senderId: payload.senderId,
        createdAt: payload.createdAt || new Date().toISOString()
      }

      setMessages(prev => {
        // Prevent duplicates
        if (prev.some(m => m.id === newMessage.id)) return prev
        return [...prev, newMessage]
      })
    }

    socket.on('new_message', handleNewMessage)

    return () => {
      socket.off('new_message', handleNewMessage)
      socket.emit('leave_conversation', { conversationId: conversation.id })
    }
  }, [socket, conversation])

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const fetchMessages = async (state: ConversationState) => {
    try {
      setLoading(true)
      const res = await apiClient.get(API_ENDPOINTS.CHAT.CONVERSATION_MESSAGES(state.id), {
        params: { limit: 50, guestId: state.guestId, guestToken: state.guestToken }
      })
      const payload = res.data as ChatMessagesResponse | ChatMessage[]
      const data = Array.isArray(payload)
        ? payload
        : payload.data || payload.messages || []
      setMessages(data)
    } catch (error) {
      console.error(error)
      toast.error("Không thể tải tin nhắn")
    } finally {
      setLoading(false)
    }
  }

  const startConversation = async () => {
    if (!guestName.trim() || !guestPhone.trim() || !initialMessage.trim()) {
      toast.error("Vui lòng nhập đủ họ tên, SĐT và tin nhắn")
      return
    }
    setLoading(true)
    try {
      const res = await apiClient.post(API_ENDPOINTS.CHAT.CONVERSATIONS, {
        guestName,
        guestPhone,
        initialMessage,
      })
      const data = res.data as StartConversationResponse
      if (data.id && data.guestId && data.guestToken) {
        const state: ConversationState = { id: data.id, guestId: data.guestId, guestToken: data.guestToken }
        setConversation(state)
        localStorage.setItem(LOCAL_KEY, JSON.stringify(state))
        setMessages(data.messages || [])
        setInitialMessage("")
        
        // Create socket for new conversation
        const sock = createChatSocket(state)
        setSocket(sock)
        
        toast.success("Đã bắt đầu chat")
      } else {
        throw new Error('Thiếu thông tin hội thoại')
      }
    } catch (error) {
      console.error(error)
      toast.error("Không thể tạo cuộc trò chuyện")
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!conversation) {
      toast.error("Vui lòng bắt đầu cuộc trò chuyện trước")
      return
    }
    if (!message.trim()) return
    setSending(true)
    const temp: ChatMessage = {
      id: `temp-${Date.now()}`,
      conversationId: conversation.id,
      content: message,
      senderType: "USER",
      senderId: conversation.guestId,
      createdAt: new Date().toISOString()
    }
    setMessages(prev => [...prev, temp])
    setMessage("")
    try {
      const res = await apiClient.post(API_ENDPOINTS.CHAT.MESSAGES, {
        conversationId: conversation.id,
        content: temp.content,
        senderId: conversation.guestId,
        senderType: "USER",
        guestToken: conversation.guestToken,
      })
      const real = res.data as SendMessageResponse
      setMessages(prev => prev.map(m => m.id === temp.id ? real : m))
    } catch (error) {
      console.error(error)
      toast.error("Gửi tin nhắn thất bại")
      setMessages(prev => prev.filter(m => m.id !== temp.id))
    } finally {
      setSending(false)
    }
  }

  const isConversationReady = !!conversation

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-background to-slate-100 dark:from-slate-950 dark:via-background dark:to-slate-900 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <MagicCard
            className="overflow-hidden"
            gradientSize={400}
            gradientColor="oklch(0.58 0.28 20 / 0.1)"
            gradientFrom="oklch(0.58 0.28 20)"
            gradientTo="oklch(0.70 0.22 40)"
          >
            <Card className="relative border-0 shadow-xl">
              <BorderBeam
                size={150}
                duration={12}
                colorFrom="oklch(0.58 0.28 20)"
                colorTo="oklch(0.70 0.22 40)"
                borderWidth={2}
              />
              <CardHeader className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gradient-to-br from-primary to-accent">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      <AnimatedGradientText
                        className="text-2xl font-bold"
                        speed={1.2}
                        colorFrom="oklch(0.58 0.28 20)"
                        colorTo="oklch(0.70 0.22 40)"
                      >
                        Trò chuyện với Audio Tài Lộc
                      </AnimatedGradientText>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Chọn chat trực tiếp hoặc dùng Zalo ở góc màn hình.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-3 p-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4 md:col-span-1"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      Họ tên
                    </label>
                    <Input
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      disabled={isConversationReady}
                      className="transition-all focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4 text-primary" />
                      Số điện thoại
                    </label>
                    <Input
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="09xx"
                      disabled={isConversationReady}
                      className="transition-all focus:border-primary"
                    />
                  </div>
                  {!isConversationReady && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-2"
                    >
                      <label className="text-sm font-medium">Tin nhắn đầu tiên</label>
                      <Textarea
                        value={initialMessage}
                        onChange={(e) => setInitialMessage(e.target.value)}
                        rows={4}
                        placeholder="Mình cần tư vấn..."
                        className="transition-all focus:border-primary"
                      />
                    </motion.div>
                  )}
                  {!isConversationReady && (
                    <ShimmerButton
                      className="w-full"
                      onClick={startConversation}
                      disabled={loading}
                      shimmerColor="oklch(0.70 0.22 40)"
                      background="oklch(0.58 0.28 20)"
                      borderRadius="0.5rem"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Đang tạo...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          Bắt đầu chat
                        </span>
                      )}
                    </ShimmerButton>
                  )}
                  {isConversationReady && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-3 rounded-lg bg-primary/10 border border-primary/20"
                    >
                      <div className="text-xs text-muted-foreground">
                        Mã khách: <span className="font-semibold text-primary">{conversation?.guestId}</span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                <Separator className="md:hidden" />

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="md:col-span-2 flex flex-col h-[520px] border rounded-xl overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 shadow-lg"
                >
                  <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-[440px] p-4">
                      {loading ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center space-y-2">
                            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                            <p className="text-sm text-muted-foreground">Đang tải tin nhắn...</p>
                          </div>
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center space-y-2">
                            <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto" />
                            <p className="text-sm text-muted-foreground">Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <AnimatePresence>
                            {messages.map((m, index) => (
                              <motion.div
                                key={m.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                className={`flex ${m.senderType === 'ADMIN' ? 'justify-start' : 'justify-end'}`}
                              >
                                <div
                                  className={`max-w-[70%] p-4 rounded-2xl text-sm shadow-md ${
                                    m.senderType === 'ADMIN'
                                      ? 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-900 dark:text-slate-100 rounded-tl-none'
                                      : 'bg-gradient-to-br from-primary to-primary/80 text-white rounded-tr-none'
                                  }`}
                                >
                                  <div className="whitespace-pre-wrap break-words">{m.content}</div>
                                  <div className={`text-[10px] opacity-70 mt-2 ${m.senderType === 'ADMIN' ? 'text-left' : 'text-right'}`}>
                                    {format(new Date(m.createdAt), 'HH:mm dd/MM')}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                          <div ref={scrollRef} />
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                  <div className="p-4 border-t bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
                    <div className="flex gap-2">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={isConversationReady ? "Nhập tin nhắn..." : "Bắt đầu cuộc trò chuyện trước"}
                        disabled={!isConversationReady || sending}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            sendMessage()
                          }
                        }}
                        className="flex-1 transition-all focus:border-primary"
                      />
                      <ShimmerButton
                        onClick={sendMessage}
                        disabled={!isConversationReady || sending || !message.trim()}
                        shimmerColor="oklch(0.70 0.22 40)"
                        background="oklch(0.58 0.28 20)"
                        borderRadius="0.5rem"
                        className="px-6"
                      >
                        {sending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </ShimmerButton>
                    </div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </MagicCard>
        </motion.div>
      </div>
    </div>
  )
}