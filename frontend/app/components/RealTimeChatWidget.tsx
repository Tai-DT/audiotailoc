"use client"

import { useState, useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useSocket';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RealTimeChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [sessionId] = useState(`session_${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Use real-time chat hook
  const { messages, isTyping, sendMessage, startTyping, stopTyping, connected } = useChat('user-id-placeholder');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    sendMessage(input, sessionId);
    setInput('');
    stopTyping();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (e.target.value.length > 0) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center z-50"
        aria-label="Mở chat real-time"
      >
        <span className="text-2xl">💬</span>
        {!connected && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        )}
      </button>
    );
  }

  return (
    <Card className="fixed bottom-20 right-4 w-80 h-96 shadow-xl z-50 flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Chat Real-time</CardTitle>
            <CardDescription className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>{connected ? 'Đang kết nối' : 'Mất kết nối'}</span>
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 p-0"
          >
            ✕
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <span className="text-4xl mb-2 block">👋</span>
              <p className="text-sm">Xin chào! Chat real-time với nhân viên hỗ trợ</p>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg px-3 py-2 ${
                msg.type === 'user' 
                  ? 'bg-green-600 text-white' 
                  : msg.type === 'admin'
                  ? 'bg-blue-100 text-blue-900'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm">{msg.message}</p>
                <p className={`text-xs mt-1 ${
                  msg.type === 'user' ? 'text-green-100' : 'text-gray-500'
                }`}>
                  {formatTime(msg.timestamp)}
                  {msg.type === 'admin' && <span className="ml-1 font-medium">• Nhân viên</span>}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-3 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Nhập tin nhắn..."
              disabled={!connected}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!input.trim() || !connected}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              Gửi
            </Button>
          </div>
          {!connected && (
            <p className="text-xs text-red-500 mt-2">
              Mất kết nối. Đang thử kết nối lại...
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
