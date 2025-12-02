import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Conversation } from '@/hooks/use-chat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatSidebarProps {
    conversations: Conversation[];
    activeId?: string;
    onSelect: (conversation: Conversation) => void;
}

export function ChatSidebar({ conversations, activeId, onSelect }: ChatSidebarProps) {
    return (
        <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full bg-white dark:bg-gray-950">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="font-semibold text-lg">Tin nhắn</h2>
            </div>

            <ScrollArea className="flex-1">
                <div className="flex flex-col">
                    {conversations.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            Chưa có cuộc hội thoại nào
                        </div>
                    ) : (
                        conversations.map((conversation) => {
                            const lastMessage = conversation.messages?.[0];
                            const isActive = conversation.id === activeId;

                            return (
                                <button
                                    key={conversation.id}
                                    onClick={() => onSelect(conversation)}
                                    className={cn(
                                        "flex items-start gap-3 p-4 text-left hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors border-b border-gray-100 dark:border-gray-900",
                                        isActive && "bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                    )}
                                >
                                    <Avatar>
                                        <AvatarImage src={conversation.users?.avatar || conversation.users?.avatarUrl || undefined} />
                                        <AvatarFallback>
                                            {conversation.users?.name?.charAt(0).toUpperCase() || 'U'}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between items-center mb-1 gap-2">
                                            <span className="font-medium truncate">
                                                {conversation.users?.name || conversation.guestName || 'Khách vãng lai'}
                                            </span>
                                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                                {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true, locale: vi })}
                                            </span>
                                        </div>

                                        <p className={cn(
                                            "text-sm truncate",
                                            isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500"
                                        )}>
                                            {conversation.guestPhone ? `SĐT: ${conversation.guestPhone}` : (lastMessage?.content || 'Bắt đầu cuộc trò chuyện')}
                                        </p>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
