"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { toast } from "react-hot-toast"
import { apiClient, API_ENDPOINTS } from "@/lib/api"
import { CONTACT_CONFIG } from "@/lib/contact-config"
import { useSocket } from "@/components/providers/socket-provider"

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
  const { socket, isConnected } = useSocket()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ConversationState
        setConversation(parsed)
        fetchMessages(parsed)
      } catch {
        // ignore
      }
    }
  }, [])

  useEffect(() => {
    if (!socket || !conversation) return

    // Join conversation room
    socket.emit('join_conversation', { conversationId: conversation.id })

    // Listen for new messages
    const handleNewMessage = (payload: any) => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Trò chuyện với Audio Tài Lộc</CardTitle>
            <CardDescription>Chọn chat trực tiếp hoặc dùng Zalo ở góc màn hình.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3 md:col-span-1">
              <div className="space-y-2">
                <label className="text-sm font-medium">Họ tên</label>
                <Input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Nguyễn Văn A" disabled={isConversationReady} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Số điện thoại</label>
                <Input value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="09xx" disabled={isConversationReady} />
              </div>
              {!isConversationReady && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tin nhắn đầu tiên</label>
                  <Textarea value={initialMessage} onChange={(e) => setInitialMessage(e.target.value)} rows={4} placeholder="Mình cần tư vấn..." />
                </div>
              )}
              {!isConversationReady && (
                <Button className="w-full" onClick={startConversation} disabled={loading}>
                  {loading ? "Đang tạo..." : "Bắt đầu chat"}
                </Button>
              )}
              {isConversationReady && (
                <div className="text-xs text-muted-foreground">
                  Mã khách: <span className="font-semibold">{conversation?.guestId}</span>
                </div>
              )}
            </div>

            <Separator className="md:hidden" />

            <div className="md:col-span-2 flex flex-col h-[520px] border rounded-lg overflow-hidden bg-white dark:bg-slate-950">
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-[440px] p-4">
                  {loading ? (
                    <p className="text-sm text-muted-foreground">Đang tải tin nhắn...</p>
                  ) : messages.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Chưa có tin nhắn.</p>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((m) => (
                        <div key={m.id} className={`flex ${m.senderType === 'ADMIN' ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[70%] p-3 rounded-lg text-sm ${m.senderType === 'ADMIN' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100' : 'bg-blue-600 text-white'}`}>
                            <div>{m.content}</div>
                            <div className="text-[10px] opacity-70 mt-1 text-right">{format(new Date(m.createdAt), 'HH:mm dd/MM')}</div>
                          </div>
                        </div>
                      ))}
                      <div ref={scrollRef} />
                    </div>
                  )}
                </ScrollArea>
              </div>
              <div className="p-4 border-t bg-slate-50 dark:bg-slate-900">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={isConversationReady ? "Nhập tin nhắn" : "Bắt đầu cuộc trò chuyện trước"}
                    disabled={!isConversationReady || sending}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                  />
                  <Button onClick={sendMessage} disabled={!isConversationReady || sending || !message.trim()}>
                    {sending ? "Đang gửi..." : "Gửi"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}