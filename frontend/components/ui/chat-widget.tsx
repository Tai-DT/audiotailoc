"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { toast } from "react-hot-toast"
import { apiClient, API_ENDPOINTS, handleApiResponse } from "@/lib/api"
import { CONTACT_CONFIG } from "@/lib/contact-config"
import { useSocket } from "@/components/providers/socket-provider"
import { X } from "lucide-react"

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

interface ChatWidgetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChatWidget({ open, onOpenChange }: ChatWidgetProps) {
  const [guestName, setGuestName] = useState("")
  const [guestPhone, setGuestPhone] = useState<string>(CONTACT_CONFIG.phone.number || "")
  const [initialMessage, setInitialMessage] = useState("")
  const [message, setMessage] = useState("")
  const [conversation, setConversation] = useState<ConversationState | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const { socket } = useSocket()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Load saved conversation when modal opens
  useEffect(() => {
    if (open) {
      const saved = localStorage.getItem(LOCAL_KEY)
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as ConversationState
          setConversation(parsed)
          fetchMessages(parsed, true)
        } catch {
          // ignore
        }
      }
    }
  }, [open])

  useEffect(() => {
    if (!socket || !conversation || !open) return

    // Subscribe to conversation room
    socket.emit('chat:subscribe', { 
      conversationId: conversation.id,
      guestToken: conversation.guestToken 
    })

    // Listen for new messages from the conversation room
    const handleNewMessage = (payload: any) => {
      const messageData = payload.data || payload
      
      if (!messageData || messageData.conversationId !== conversation.id) return

      const newMessage: ChatMessage = {
        id: String(messageData.id || `msg-${Date.now()}-${Math.random()}`),
        conversationId: String(messageData.conversationId || conversation.id),
        content: String(messageData.content || messageData.message || ''),
        senderType: messageData.senderType || 'USER',
        senderId: messageData.senderId || null,
        createdAt: messageData.createdAt || messageData.timestamp || new Date().toISOString()
      }

      setMessages(prev => {
        if (prev.some(m => m.id === newMessage.id)) return prev
        const updated = [...prev, newMessage]
        return updated.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      })
    }

    socket.on('chat:message', handleNewMessage)
    
    const broadcastEventName = `chat:${conversation.id}:message`
    const handleBroadcastMessage = (payload: any) => {
      const messageData = payload.data || payload
      handleNewMessage(messageData)
    }
    socket.on(broadcastEventName, handleBroadcastMessage)

    return () => {
      socket.off('chat:message', handleNewMessage)
      socket.off(broadcastEventName, handleBroadcastMessage)
    }
  }, [socket, conversation, open])

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const fetchMessages = useCallback(async (state: ConversationState, showLoading = false) => {
    try {
      if (showLoading) setLoading(true)
      const res = await apiClient.get(API_ENDPOINTS.CHAT.CONVERSATION_MESSAGES(state.id), {
        params: { limit: 50, guestId: state.guestId, guestToken: state.guestToken }
      })
      const payload = handleApiResponse<ChatMessagesResponse>(res)
      const data = Array.isArray(payload)
        ? payload
        : payload.data || payload.messages || []
      
      const rawMessages = Array.isArray(data) ? data : []
      
      const normalizedMessages: ChatMessage[] = rawMessages
        .filter((msg: any) => msg && typeof msg === 'object')
        .map((msg: any) => ({
          id: String(msg.id || `msg-${Date.now()}-${Math.random()}`),
          conversationId: String(msg.conversationId || state.id),
          content: String(msg.content || msg.message || ''),
          senderType: msg.senderType || 'USER',
          senderId: msg.senderId || null,
          createdAt: msg.createdAt || new Date().toISOString()
        }))
        .filter((msg, index, self) => 
          index === self.findIndex(m => m.id === msg.id)
        )
        .sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      
      setMessages(prev => {
        const tempMessages = prev.filter(m => m.id.startsWith('temp-'))
        const allMessages = [...normalizedMessages, ...tempMessages]
        const uniqueMessages = allMessages.filter((msg, index, self) => 
          index === self.findIndex(m => m.id === msg.id)
        )
        return uniqueMessages.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      })
    } catch (error) {
      console.error('Failed to fetch messages:', error)
      if (showLoading) {
        toast.error("Không thể tải tin nhắn")
      }
    } finally {
      if (showLoading) setLoading(false)
    }
  }, [])

  // Poll for new messages periodically
  useEffect(() => {
    if (!conversation || !open) return

    fetchMessages(conversation, true)

    const pollInterval = setInterval(() => {
      fetchMessages(conversation, false)
    }, 5000)

    return () => clearInterval(pollInterval)
  }, [conversation, fetchMessages, open])

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
      const data = handleApiResponse<StartConversationResponse>(res)
      
      if (data && data.id && data.guestId && data.guestToken) {
        const state: ConversationState = { id: data.id, guestId: data.guestId, guestToken: data.guestToken }
        setConversation(state)
        localStorage.setItem(LOCAL_KEY, JSON.stringify(state))
        
        const rawMessages = Array.isArray(data.messages) ? data.messages : []
        const normalizedMessages: ChatMessage[] = rawMessages
          .filter((msg: any) => msg && typeof msg === 'object')
          .map((msg: any) => ({
            id: String(msg.id || `msg-${Date.now()}-${Math.random()}`),
            conversationId: String(msg.conversationId || data.id),
            content: String(msg.content || msg.message || ''),
            senderType: msg.senderType || 'USER',
            senderId: msg.senderId || null,
            createdAt: msg.createdAt || new Date().toISOString()
          }))
          .filter((msg, index, self) => 
            index === self.findIndex(m => m.id === msg.id)
          )
          .sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
        
        setMessages(normalizedMessages)
        setInitialMessage("")
        toast.success("Đã bắt đầu chat")
      } else {
        console.error('Invalid response structure:', { data, raw: res.data })
        throw new Error('Thiếu thông tin hội thoại. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('Error creating conversation:', error)
      const errorMessage = error instanceof Error ? error.message : 'Không thể tạo cuộc trò chuyện'
      toast.error(errorMessage)
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
      const real = handleApiResponse<SendMessageResponse>(res)
      if (real && typeof real === 'object') {
        const normalizedMessage: ChatMessage = {
          id: String(real.id || temp.id),
          conversationId: String(real.conversationId || conversation.id),
          content: String(real.content || temp.content),
          senderType: real.senderType || 'USER',
          senderId: real.senderId || conversation.guestId,
          createdAt: real.createdAt || new Date().toISOString()
        }
        setMessages(prev => {
          const updated = prev.map(m => m.id === temp.id ? normalizedMessage : m)
          const unique = updated.filter((msg, index, self) => 
            index === self.findIndex(m => m.id === msg.id)
          )
          return unique.sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
        })
      } else {
        throw new Error('Invalid response from server')
      }
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[calc(100vw-2rem)] max-h-[90vh] h-[85vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
          <DialogTitle>Trò chuyện với Audio Tài Lộc</DialogTitle>
          <DialogDescription>
            Chúng tôi sẽ phản hồi trong thời gian sớm nhất
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden grid md:grid-cols-3 gap-0 min-h-0">
          {/* Left sidebar - Form or info */}
          <div className="md:col-span-1 border-r p-4 space-y-3 overflow-y-auto">
            {!isConversationReady ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Họ tên</label>
                  <Input 
                    value={guestName} 
                    onChange={(e) => setGuestName(e.target.value)} 
                    placeholder="Nguyễn Văn A" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Số điện thoại</label>
                  <Input 
                    value={guestPhone} 
                    onChange={(e) => setGuestPhone(e.target.value)} 
                    placeholder="09xx" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tin nhắn đầu tiên</label>
                  <Textarea 
                    value={initialMessage} 
                    onChange={(e) => setInitialMessage(e.target.value)} 
                    rows={4} 
                    placeholder="Mình cần tư vấn..." 
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={startConversation} 
                  disabled={loading}
                >
                  {loading ? "Đang tạo..." : "Bắt đầu chat"}
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  <div className="font-medium mb-1">Thông tin khách hàng</div>
                  <div>Họ tên: {guestName}</div>
                  <div>SĐT: {guestPhone}</div>
                  <div className="mt-2 text-xs">
                    Mã khách: <span className="font-semibold">{conversation?.guestId}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right side - Chat messages */}
          <div className="md:col-span-2 flex flex-col h-full min-h-0">
            <div className="flex-1 overflow-hidden min-h-0">
              <ScrollArea className="h-full p-4">
                {loading ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Đang tải tin nhắn...</p>
                ) : messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!</p>
                ) : (
                  <div className="space-y-3">
                    {messages.map((m, index) => {
                      const content = typeof m.content === 'string' ? m.content : String(m.content || '')
                      const uniqueKey = `${m.id}-${index}`
                      
                      return (
                        <div key={uniqueKey} className={`flex ${m.senderType === 'ADMIN' ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[70%] p-3 rounded-lg text-sm ${m.senderType === 'ADMIN' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100' : 'bg-blue-600 text-white'}`}>
                            <div>{content}</div>
                            <div className={`text-[10px] opacity-70 mt-1 ${m.senderType === 'ADMIN' ? 'text-left' : 'text-right'}`}>
                              {format(new Date(m.createdAt), 'HH:mm dd/MM')}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={scrollRef} />
                  </div>
                )}
              </ScrollArea>
            </div>
            
            {/* Message input */}
            <div className="p-4 border-t bg-slate-50 dark:bg-slate-900 flex-shrink-0">
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
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!isConversationReady || sending || !message.trim()}
                >
                  {sending ? "Đang gửi..." : "Gửi"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

