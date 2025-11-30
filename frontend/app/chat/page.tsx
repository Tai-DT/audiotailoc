"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { ChatWidget } from "@/components/ui/chat-widget"
import { useRouter } from "next/navigation"

export default function ChatPage() {
  const [chatOpen, setChatOpen] = useState(false)
  const router = useRouter()

  // Auto-open chat widget when page loads
  useEffect(() => {
    setChatOpen(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <MessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle>Chat với Audio Tài Lộc</CardTitle>
          <CardDescription>
            Cửa sổ chat đã được mở. Nếu không thấy, hãy click vào nút chat ở góc dưới bên phải màn hình.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full" 
            onClick={() => setChatOpen(true)}
            size="lg"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Mở cửa sổ chat
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => router.push('/')}
          >
            Về trang chủ
          </Button>
        </CardContent>
      </Card>
      <ChatWidget open={chatOpen} onOpenChange={setChatOpen} />
    </div>
  )
}