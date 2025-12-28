"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Bot, 
  Send, 
  Sparkles, 
  MessageSquare, 
  TrendingUp, 
  Search, 
  RefreshCw,
  CheckCircle2,
  XCircle,
  Loader2,
  Package,
  Copy,
  Check,
  Wand2
} from "lucide-react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"
import { cn } from "@/lib/utils"

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestedProducts?: any[]
}

interface AIStatus {
  geminiAvailable: boolean
  timestamp: string
}

interface ProductRecommendation {
  id: string
  name: string
  slug: string
  price: number
  image?: string
  reason: string
  relevanceScore: number
}

export default function AIPage() {
  const [status, setStatus] = useState<AIStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [sendingMessage, setSendingMessage] = useState(false)
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([])
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [generatedDescription, setGeneratedDescription] = useState("")
  const [productName, setProductName] = useState("")
  const [productSpecs, setProductSpecs] = useState("")
  const [generatingDescription, setGeneratingDescription] = useState(false)
  const [copied, setCopied] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fetchStatus = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/ai/status')
      setStatus(response.data.data)
    } catch (error) {
      console.error('Failed to fetch AI status:', error)
      toast.error('Không thể kiểm tra trạng thái AI')
    } finally {
      setLoading(false)
    }
  }

  const fetchRecommendations = async () => {
    try {
      setLoadingRecommendations(true)
      const response = await apiClient.get('/ai/recommendations?limit=6')
      setRecommendations(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch recommendations:', error)
    } finally {
      setLoadingRecommendations(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    fetchRecommendations()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || sendingMessage) return

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setSendingMessage(true)

    try {
      const response = await apiClient.post('/ai/chat', {
        message: inputMessage,
        conversationHistory: messages.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content
        }))
      })

      const aiResponse: Message = {
        role: 'assistant',
        content: response.data.data.message,
        timestamp: new Date(),
        suggestedProducts: response.data.data.suggestedProducts
      }

      setMessages(prev => [...prev, aiResponse])
    } catch (error: any) {
      console.error('Chat error:', error)
      const errorMsg = error.message || 'Không thể gửi tin nhắn'
      toast.error(errorMsg)
      
      const isQuotaError = errorMsg.toLowerCase().includes('quota') || error.status === 429
      
      const errorMessage: Message = {
        role: 'assistant',
        content: isQuotaError 
          ? '⚠️ Hệ thống AI hiện đang hết hạn mức (Quota). Vui lòng đợi 1-2 phút hoặc kiểm tra tài khoản Gemini của bạn.' 
          : 'Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setSendingMessage(false)
    }
  }

  const fetchSuggestions = async () => {
    if (!searchQuery.trim()) return

    try {
      setLoadingSuggestions(true)
      const response = await apiClient.get(`/ai/suggestions?q=${encodeURIComponent(searchQuery)}&limit=10`)
      setSearchSuggestions(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch suggestions:', error)
    } finally {
      setLoadingSuggestions(false)
    }
  }

  const generateProductDescription = async () => {
    if (!productName.trim()) {
      toast.error('Vui lòng nhập tên sản phẩm')
      return
    }

    try {
      setGeneratingDescription(true)
      const response = await apiClient.post('/ai/chat', {
        message: `Viết mô tả sản phẩm chuyên nghiệp cho thiết bị âm thanh: "${productName}". ${productSpecs ? `Thông số kỹ thuật: ${productSpecs}` : ''} Viết bằng tiếng Việt, tối đa 200 từ, nêu bật tính năng và lợi ích.`
      })
      
      setGeneratedDescription(response.data.data.message)
    } catch (error: any) {
      console.error('Failed to generate description:', error)
      const errorMsg = error.message || ''
      if (errorMsg.toLowerCase().includes('quota') || error.status === 429) {
        toast.error('Hệ thống AI hiện đang hết hạn mức (Quota). Vui lòng thử lại sau 1 phút.')
      } else {
        toast.error('Không thể tạo mô tả. Vui lòng thử lại.')
      }
    } finally {
      setGeneratingDescription(false)
    }
  }

  const copyDescription = () => {
    navigator.clipboard.writeText(generatedDescription)
    setCopied(true)
    toast.success('Đã sao chép mô tả')
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="p-4 md:p-8 pt-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            AI Assistant
          </h2>
          <p className="text-muted-foreground">
            Trợ lý AI thông minh cho cửa hàng Audio Tài Lộc
          </p>
        </div>
        <Button variant="outline" onClick={fetchStatus}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Làm mới
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Trạng thái Gemini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {status?.geminiAvailable ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-lg font-bold text-green-600">Hoạt động</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="text-lg font-bold text-red-600">Không khả dụng</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {status?.geminiAvailable 
                ? "AI đã sẵn sàng xử lý yêu cầu" 
                : "Kiểm tra cấu hình API key"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Model đang dùng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold">Gemini 2.5 Flash</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Thinking model với khả năng suy luận
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tính năng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary">Chatbot</Badge>
              <Badge variant="secondary">Gợi ý SP</Badge>
              <Badge variant="secondary">Tìm kiếm AI</Badge>
              <Badge variant="secondary">Tạo mô tả</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat">
            <MessageSquare className="mr-2 h-4 w-4" />
            Chatbot
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            <TrendingUp className="mr-2 h-4 w-4" />
            Gợi ý SP
          </TabsTrigger>
          <TabsTrigger value="search">
            <Search className="mr-2 h-4 w-4" />
            Tìm kiếm AI
          </TabsTrigger>
          <TabsTrigger value="generator">
            <Wand2 className="mr-2 h-4 w-4" />
            Tạo mô tả
          </TabsTrigger>
        </TabsList>

        {/* Chatbot Tab */}
        <TabsContent value="chat">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>AI Chatbot</CardTitle>
              <CardDescription>
                Trò chuyện với AI để được hỗ trợ về sản phẩm và dịch vụ
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Bắt đầu cuộc trò chuyện với AI Assistant</p>
                    <p className="text-sm mt-2">Hỏi về sản phẩm, giá cả, hoặc yêu cầu tư vấn!</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex",
                        msg.role === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg px-4 py-2",
                          msg.role === 'user'
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs font-medium border-t pt-2">Sản phẩm gợi ý:</p>
                            {msg.suggestedProducts.map((p: any) => (
                              <div key={p.id} className="text-xs bg-background/50 rounded p-2">
                                <p className="font-medium">{p.name}</p>
                                <p className="text-muted-foreground">{p.price?.toLocaleString('vi-VN')}đ</p>
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="text-xs opacity-50 mt-1">
                          {msg.timestamp.toLocaleTimeString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  disabled={sendingMessage || !status?.geminiAvailable}
                />
                <Button onClick={sendMessage} disabled={sendingMessage || !status?.geminiAvailable}>
                  {sendingMessage ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Gợi ý sản phẩm AI</CardTitle>
                <CardDescription>
                  Sản phẩm được đề xuất dựa trên xu hướng và độ phổ biến
                </CardDescription>
              </div>
              <Button variant="outline" onClick={fetchRecommendations}>
                <RefreshCw className={cn("mr-2 h-4 w-4", loadingRecommendations && "animate-spin")} />
                Làm mới
              </Button>
            </CardHeader>
            <CardContent>
              {loadingRecommendations ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-32" />
                  ))}
                </div>
              ) : recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.map((product) => (
                    <Card key={product.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="h-16 w-16 rounded bg-muted flex items-center justify-center flex-shrink-0">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="h-full w-full object-cover rounded" />
                            ) : (
                              <Package className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{product.name}</h4>
                            <p className="text-primary font-bold">
                              {product.price.toLocaleString('vi-VN')}đ
                            </p>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {product.reason}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Chưa có gợi ý sản phẩm</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Search Tab */}
        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>Tìm kiếm AI</CardTitle>
              <CardDescription>
                AI gợi ý từ khóa tìm kiếm thông minh
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nhập từ khóa tìm kiếm..."
                  onKeyDown={(e) => e.key === 'Enter' && fetchSuggestions()}
                />
                <Button onClick={fetchSuggestions} disabled={loadingSuggestions}>
                  {loadingSuggestions ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {searchSuggestions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Gợi ý từ AI:</p>
                  <div className="flex flex-wrap gap-2">
                    {searchSuggestions.map((suggestion, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => setSearchQuery(suggestion.query)}
                      >
                        {suggestion.query}
                        {suggestion.confidence && (
                          <span className="ml-1 opacity-50">
                            ({Math.round(suggestion.confidence * 100)}%)
                          </span>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Generator Tab */}
        <TabsContent value="generator">
          <Card>
            <CardHeader>
              <CardTitle>Tạo mô tả sản phẩm AI</CardTitle>
              <CardDescription>
                AI tự động viết mô tả sản phẩm chuyên nghiệp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tên sản phẩm *</Label>
                  <Input
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="VD: Loa JBL Partybox 310"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Thông số kỹ thuật (tùy chọn)</Label>
                  <Input
                    value={productSpecs}
                    onChange={(e) => setProductSpecs(e.target.value)}
                    placeholder="VD: 240W, Bluetooth 5.1, Pin 18h"
                  />
                </div>
              </div>

              <Button 
                onClick={generateProductDescription} 
                disabled={generatingDescription || !status?.geminiAvailable}
                className="w-full"
              >
                {generatingDescription ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo mô tả...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Tạo mô tả AI
                  </>
                )}
              </Button>

              {generatedDescription && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Mô tả được tạo</Label>
                    <Button variant="ghost" size="sm" onClick={copyDescription}>
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <Textarea
                    value={generatedDescription}
                    onChange={(e) => setGeneratedDescription(e.target.value)}
                    rows={8}
                    className="resize-none"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
