import { useState } from 'react';
import { Send, MoreVertical, Phone, Video, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Conversation, Message } from '@/hooks/use-chat';
import { ChatMessage } from './ChatMessage';

interface ChatWindowProps {
    conversation: Conversation | null;
    messages: Message[];
    onSendMessage: (content: string) => void;
    loading: boolean;
    sending: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function ChatWindow({
    conversation,
    messages,
    onSendMessage,
    loading,
    sending,
    messagesEndRef
}: ChatWindowProps) {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() && !sending) {
            onSendMessage(inputValue);
            setInputValue('');
        }
    };

    if (!conversation) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500">
                <div className="text-center">
                    <div className="text-6xl mb-4">💬</div>
                    <p>Chọn một cuộc hội thoại để bắt đầu</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={conversation.users?.avatar || conversation.users?.avatarUrl || undefined} />
                        <AvatarFallback>
                            {(conversation.users?.name || conversation.guestName || 'U').charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold">{conversation.users?.name || conversation.guestName || 'Khách vãng lai'}</h3>
                        {conversation.guestPhone && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <PhoneCall className="w-3 h-3" />
                                {conversation.guestPhone}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <Phone className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Video className="w-5 h-5" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="w-5 h-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Xem hồ sơ</DropdownMenuItem>
                            <DropdownMenuItem>Đánh dấu chưa đọc</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Lưu trữ</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
                <div className="flex flex-col gap-2 max-w-3xl mx-auto">
                    {loading ? (
                        <div className="text-center py-4 text-gray-500">Đang tải tin nhắn...</div>
                    ) : messages.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <ChatMessage
                                key={msg.id}
                                message={msg}
                                isOwn={msg.senderType === 'ADMIN'}
                            />
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
                <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl mx-auto">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                        className="flex-1"
                        disabled={sending}
                    />
                    <Button type="submit" disabled={!inputValue.trim() || sending}>
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
