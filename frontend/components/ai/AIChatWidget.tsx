'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Bot, 
  User, 
  Loader2,
  Sparkles,
  Heart,
  Search,
  Languages
} from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'product' | 'recommendation';
  metadata?: any;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  onMinimize: () => void;
}

export default function AIChatWidget({ isOpen, onToggle, onMinimize }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Xin chào! Tôi là AI Assistant của Audio Tài Lộc. Tôi có thể giúp bạn:\n\n• Tìm kiếm sản phẩm phù hợp\n• Tư vấn thiết bị âm thanh\n• Hỗ trợ kỹ thuật\n• Dịch thuật đa ngôn ngữ\n\nBạn cần tôi giúp gì?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { text: 'Tìm tai nghe bluetooth', icon: Search },
    { text: 'Tư vấn loa cho phòng khách', icon: Sparkles },
    { text: 'Dịch sang tiếng Anh', icon: Languages },
    { text: 'Hỗ trợ kỹ thuật', icon: Heart }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          sessionId: sessionId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = 'Xin lỗi, tôi đang gặp sự cố kỹ thuật.';

        if (response.status === 404) {
          errorMessage = 'Dịch vụ AI tạm thời không khả dụng. Vui lòng thử lại sau.';
        } else if (response.status === 429) {
          errorMessage = 'Quá nhiều yêu cầu. Vui lòng chờ một chút và thử lại.';
        } else if (response.status >= 500) {
          errorMessage = 'Máy chủ đang gặp sự cố. Vui lòng thử lại sau.';
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (!data || !data.success) {
        throw new Error('Phản hồi từ máy chủ không hợp lệ');
      }

      if (!sessionId && data.sessionId) {
        setSessionId(data.sessionId);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.answer || 'Xin lỗi, tôi không thể trả lời câu hỏi này.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text',
        metadata: {
          references: data.references || []
        }
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);

      const errorText = error instanceof Error ? error.message : 'Có lỗi không xác định xảy ra.';

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, errorMessage]);
      toast.error(errorText);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action: string) => {
    sendMessage(action);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggle}
          size="lg"
          className="rounded-full h-14 w-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 h-[500px]">
      <Card className="h-full flex flex-col shadow-xl border-0 bg-white">
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <CardTitle className="text-lg">AI Assistant</CardTitle>
              <Badge variant="secondary" className="text-xs">
                Online
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onMinimize}
                className="text-white hover:bg-white/20"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === 'bot' && (
                      <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                    {message.sender === 'user' && (
                      <User className="h-4 w-4 mt-1 flex-shrink-0" />
                    )}
                  </div>

                  {/* References */}
                  {message.metadata?.references && message.metadata.references.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs opacity-70 mb-1">Tham khảo:</p>
                      <div className="space-y-1">
                        {message.metadata.references.slice(0, 2).map((ref: any, index: number) => (
                          <div key={index} className="text-xs bg-white/20 rounded p-1">
                            {ref.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="p-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Hành động nhanh:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action.text)}
                    className="text-xs h-auto p-2"
                  >
                    <action.icon className="h-3 w-3 mr-1" />
                    {action.text}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputValue)}
                placeholder="Nhập tin nhắn..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={() => sendMessage(inputValue)}
                disabled={isTyping || !inputValue.trim()}
                size="sm"
              >
                {isTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
