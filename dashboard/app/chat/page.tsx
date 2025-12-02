"use client"

import { useCallback, useEffect, useMemo, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { apiClient } from "@/lib/api-client"
import { socketManager } from "@/lib/socket"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"

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

export default function GuestChatPage() {
  const { toast } = useToast()
  const [guestName, setGuestName] = useState("")
  const [guestPhone, setGuestPhone] = useState("")
  const [initialMessage, setInitialMessage] = useState("")
  const [message, setMessage] = useState("")
  const [conversation, setConversation] = useState<ConversationState | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)

  const fetchMessages = useCallback(async (state: ConversationState) => {
    try {
      setLoading(true)
      const res = await apiClient.getChatMessages(state.id, {
        limit: 50,
        guestId: state.guestId,
        guestToken: state.guestToken,
      })

      const payload = res.data as ChatMessagesResponse | ChatMessage[]
      const messages = Array.isArray(payload)
        ? payload
        : payload.data || payload.messages || []

      setMessages(messages)
    } catch (error) {
      console.error("Failed to load messages", error)
      toast({ title: "Lỗi", description: "Không thể tải tin nhắn", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Load saved guest session
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ConversationState
        setConversation(parsed)
        fetchMessages(parsed)
      } catch (e) {
        console.warn("Failed to parse chat session", e)
      }
    }
  }, [fetchMessages])

  // Socket connection
  useEffect(() => {
    if (!conversation) return

    const handleNewMessage = (data: unknown) => {
      let message: ChatMessage | undefined
      if (data && typeof data === 'object') {
        if ('data' in data && data.data && typeof data.data === 'object') {
          message = data.data as ChatMessage
        } else if ('id' in data) {
          message = data as ChatMessage
        }
      }
      if (!message || !message.id) return
      setMessages(prev => {
        if (prev.some(m => m.id === message!.id)) return prev
        return [...prev, message!]
      })
    }

    const connectSocket = async () => {
      try {
        await socketManager.connect(conversation.guestToken)
        const eventName = `chat:${conversation.id}:message`
        socketManager.on(eventName, handleNewMessage)
      } catch (error) {
        console.error("Socket connection failed", error)
      }
    }

    connectSocket()

    return () => {
      const eventName = `chat:${conversation.id}:message`
      socketManager.off(eventName, handleNewMessage)
    }
  }, [conversation])

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const startConversation = async () => {
    if (!guestName.trim() || !guestPhone.trim() || !initialMessage.trim()) {
      toast({ title: "Thiếu thông tin", description: "Vui lòng nhập họ tên, số điện thoại và tin nhắn", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const res = await apiClient.startConversation({ guestName, guestPhone, initialMessage })
      const data = res.data as StartConversationResponse
      if (data.id && data.guestId) {
        const state: ConversationState = { id: data.id, guestId: data.guestId, guestToken: data.guestToken }
        setConversation(state)
        localStorage.setItem(LOCAL_KEY, JSON.stringify(state))
        setMessages(data.messages || [])
        setInitialMessage("")
        toast({ title: "Bắt đầu chat", description: "Đã tạo cuộc trò chuyện" })
      } else {
        throw new Error("Thiếu conversation hoặc guestId")
      }
    } catch (error) {
      console.error("Failed to start conversation", error)
      toast({ title: "Lỗi", description: "Không thể tạo cuộc trò chuyện", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!conversation) {
      toast({ title: "Chưa có cuộc trò chuyện", description: "Vui lòng bắt đầu trước" })
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
      const res = await apiClient.sendChatMessage({
        conversationId: conversation.id,
        content: temp.content,
        senderId: conversation.guestId,
        senderType: "USER",
        guestToken: conversation.guestToken
      })
      const real = res.data as SendMessageResponse
      setMessages(prev => prev.map(m => m.id === temp.id ? real : m))
    } catch (error) {
      console.error("Failed to send", error)
      toast({ title: "Lỗi", description: "Gửi tin nhắn thất bại", variant: "destructive" })
      setMessages(prev => prev.filter(m => m.id !== temp.id))
    } finally {
      setSending(false)
    }
  }

  const isConversationReady = !!conversation

  const headerTitle = useMemo(() => {
    if (isConversationReady) return "Trò chuyện với Audio Tài Lộc"
    return "Bắt đầu trò chuyện"
  }, [isConversationReady])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{headerTitle}</CardTitle>
            <CardDescription>Nhập thông tin để bắt đầu chat hoặc tiếp tục cuộc trò chuyện hiện có.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-3">
            <div className="space-y-4 md:col-span-1">
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
                <div className="text-sm text-muted-foreground">
                  Đang dùng mã khách: <span className="font-semibold">{conversation?.guestId}</span>
                </div>
              )}
            </div>

            <Separator className="md:hidden" />

            <div className="md:col-span-2 flex flex-col h-[500px] border rounded-lg overflow-hidden bg-white dark:bg-slate-950">
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-[420px] p-4">
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
                    </div>
                  )}
                  <div ref={scrollRef} />
                </ScrollArea>
              </div>
              <div className="p-4 border-t bg-slate-50 dark:bg-slate-900">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={isConversationReady ? "Nhập tin nhắn" : "Bắt đầu cuộc trò chuyện trước"}
                    disabled={!isConversationReady || sending}
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
