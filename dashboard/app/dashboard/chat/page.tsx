"use client"

import { useCallback, useEffect, useMemo, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api-client"
import { socketManager } from "@/lib/socket"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { 
  MessageSquare, 
  Send, 
  User, 
  Phone, 
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search
} from "lucide-react"

interface Conversation {
  id: string
  guestId?: string
  guestName?: string
  guestPhone?: string
  status: string
  createdAt: string
  updatedAt?: string
  messages?: ChatMessage[]
  lastMessage?: ChatMessage
}

interface ChatMessage {
  id: string
  conversationId: string
  content: string
  senderType: string
  senderId?: string
  createdAt: string
}

export default function AdminChatPage() {
  const { toast } = useToast()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch all conversations
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true)
      const res = await apiClient.getConversations({ limit: 50 })
      const payload = res.data as { data?: Conversation[], conversations?: Conversation[] } | Conversation[]
      const data = Array.isArray(payload) 
        ? payload 
        : payload.data || payload.conversations || []
      setConversations(data)
    } catch (error) {
      console.error("Failed to fetch conversations", error)
      toast({ title: "Lỗi", description: "Không thể tải danh sách cuộc trò chuyện", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      const res = await apiClient.getAdminChatMessages(conversationId, { limit: 100 })
      const payload = res.data as { data?: ChatMessage[], messages?: ChatMessage[] } | ChatMessage[]
      const data = Array.isArray(payload) 
        ? payload 
        : payload.data || payload.messages || []
      setMessages(data)
    } catch (error) {
      console.error("Failed to fetch messages", error)
      toast({ title: "Lỗi", description: "Không thể tải tin nhắn", variant: "destructive" })
    }
  }, [toast])

  // Initial load
  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  // Load messages when conversation selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id)
    }
  }, [selectedConversation, fetchMessages])

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Socket connection for real-time updates
  useEffect(() => {
    const handleNewMessage = (data: unknown) => {
      if (!data || typeof data !== 'object') return
      
      let msg: ChatMessage | undefined
      if ('data' in data && data.data && typeof data.data === 'object') {
        msg = data.data as ChatMessage
      } else if ('id' in data) {
        msg = data as ChatMessage
      }
      
      if (!msg || !msg.id) return

      // Update messages if current conversation
      if (selectedConversation && msg.conversationId === selectedConversation.id) {
        setMessages(prev => {
          if (prev.some(m => m.id === msg!.id)) return prev
          return [...prev, msg!]
        })
      }

      // Update conversation list
      setConversations(prev => prev.map(conv => 
        conv.id === msg!.conversationId 
          ? { ...conv, lastMessage: msg, updatedAt: msg!.createdAt }
          : conv
      ))
    }

    const handleNewConversation = (data: unknown) => {
      if (!data || typeof data !== 'object') return
      
      const conv = data as Conversation
      if (!conv.id) return

      setConversations(prev => {
        if (prev.some(c => c.id === conv.id)) return prev
        return [conv, ...prev]
      })

      toast({
        title: "Cuộc trò chuyện mới",
        description: `${conv.guestName || 'Khách'} vừa bắt đầu chat`,
      })
    }

    const connectSocket = async () => {
      try {
        await socketManager.connect()
        socketManager.on('new_message', handleNewMessage)
        socketManager.on('new_conversation', handleNewConversation)
      } catch (error) {
        console.error("Socket connection failed", error)
      }
    }

    connectSocket()

    return () => {
      socketManager.off('new_message', handleNewMessage)
      socketManager.off('new_conversation', handleNewConversation)
    }
  }, [selectedConversation, toast])

  // Send message as admin
  const sendMessage = async () => {
    if (!selectedConversation || !message.trim()) return

    setSending(true)
    const temp: ChatMessage = {
      id: `temp-${Date.now()}`,
      conversationId: selectedConversation.id,
      content: message,
      senderType: "ADMIN",
      createdAt: new Date().toISOString()
    }
    setMessages(prev => [...prev, temp])
    setMessage("")

    try {
      const res = await apiClient.sendAdminChatMessage({
        conversationId: selectedConversation.id,
        content: temp.content,
        senderType: "ADMIN"
      })
      const real = res.data as ChatMessage
      setMessages(prev => prev.map(m => m.id === temp.id ? real : m))
    } catch (error) {
      console.error("Failed to send message", error)
      toast({ title: "Lỗi", description: "Gửi tin nhắn thất bại", variant: "destructive" })
      setMessages(prev => prev.filter(m => m.id !== temp.id))
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  // Close conversation
  const closeConversation = async (conversationId: string) => {
    try {
      await apiClient.closeConversation(conversationId)
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId ? { ...conv, status: 'CLOSED' } : conv
      ))
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(prev => prev ? { ...prev, status: 'CLOSED' } : null)
      }
      toast({ title: "Thành công", description: "Đã đóng cuộc trò chuyện" })
    } catch (error) {
      console.error("Failed to close conversation", error)
      toast({ title: "Lỗi", description: "Không thể đóng cuộc trò chuyện", variant: "destructive" })
    }
  }

  // Filter conversations
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations
    const query = searchQuery.toLowerCase()
    return conversations.filter(conv => 
      conv.guestName?.toLowerCase().includes(query) ||
      conv.guestPhone?.includes(query) ||
      conv.guestId?.toLowerCase().includes(query)
    )
  }, [conversations, searchQuery])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex h-[calc(100vh-120px)] gap-4">
      {/* Conversations List */}
      <Card className="w-80 flex-shrink-0 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Tin nhắn
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={fetchConversations} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full">
            <div className="space-y-1 p-2">
              {filteredConversations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {loading ? "Đang tải..." : "Chưa có cuộc trò chuyện nào"}
                </p>
              ) : (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full p-3 rounded-lg text-left transition-colors hover:bg-muted/80 ${
                      selectedConversation?.id === conv.id 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'bg-muted/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="font-medium text-sm truncate">
                            {conv.guestName || 'Khách hàng'}
                          </span>
                        </div>
                        {conv.guestPhone && (
                          <div className="flex items-center gap-2 mt-1">
                            <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs text-muted-foreground">{conv.guestPhone}</span>
                          </div>
                        )}
                      </div>
                      <Badge 
                        variant={conv.status === 'OPEN' ? 'default' : 'secondary'}
                        className="text-[10px] flex-shrink-0"
                      >
                        {conv.status === 'OPEN' ? 'Mở' : 'Đóng'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {format(new Date(conv.createdAt), "HH:mm dd/MM", { locale: vi })}
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Window */}
      <Card className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {selectedConversation.guestName || 'Khách hàng'}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-1">
                    {selectedConversation.guestPhone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {selectedConversation.guestPhone}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(selectedConversation.createdAt), "HH:mm dd/MM/yyyy", { locale: vi })}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {selectedConversation.status === 'OPEN' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => closeConversation(selectedConversation.id)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Đóng
                    </Button>
                  )}
                  <Badge variant={selectedConversation.status === 'OPEN' ? 'default' : 'secondary'}>
                    {selectedConversation.status === 'OPEN' ? (
                      <><CheckCircle2 className="h-3 w-3 mr-1" /> Đang mở</>
                    ) : (
                      <><XCircle className="h-3 w-3 mr-1" /> Đã đóng</>
                    )}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-[calc(100vh-340px)] p-4">
                <div className="space-y-3">
                  {messages.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Chưa có tin nhắn
                    </p>
                  ) : (
                    messages.map((msg) => {
                      const isAdmin = msg.senderType === 'ADMIN'
                      const isGuest = msg.senderType === 'GUEST' || msg.senderType === 'USER'
                      return (
                        <div 
                          key={msg.id} 
                          className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                            isAdmin 
                              ? 'bg-primary text-primary-foreground rounded-br-md' 
                              : 'bg-muted rounded-bl-md'
                          }`}>
                            <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                            <p className={`text-[10px] mt-1 ${
                              isAdmin ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            }`}>
                              {format(new Date(msg.createdAt), "HH:mm")}
                              {isAdmin && ' • Bạn'}
                              {isGuest && ' • Khách'}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>
            </CardContent>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={selectedConversation.status === 'OPEN' ? "Nhập tin nhắn..." : "Cuộc trò chuyện đã đóng"}
                  disabled={sending || selectedConversation.status !== 'OPEN'}
                  className="flex-1"
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={sending || !message.trim() || selectedConversation.status !== 'OPEN'}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Chọn một cuộc trò chuyện để bắt đầu</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
