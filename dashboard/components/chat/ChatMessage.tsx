import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Message } from '@/hooks/use-chat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatMessageProps {
    message: Message;
    isOwn: boolean;
}

export function ChatMessage({ message, isOwn }: ChatMessageProps) {
    return (
        <div className={cn("flex w-full mb-4", isOwn ? "justify-end" : "justify-start")}>
            <div className={cn("flex max-w-[70%] gap-2", isOwn ? "flex-row-reverse" : "flex-row")}>
                {!isOwn && (
                    <Avatar className="w-8 h-8 mt-1">
                        <AvatarImage src={message.senderType === 'AI' ? '/ai-avatar.png' : undefined} />
                        <AvatarFallback>
                            {message.senderType === 'AI' ? 'AI' : 'U'}
                        </AvatarFallback>
                    </Avatar>
                )}

                <div className={cn(
                    "flex flex-col",
                    isOwn ? "items-end" : "items-start"
                )}>
                    <div className={cn(
                        "p-3 rounded-lg text-sm",
                        isOwn
                            ? "bg-blue-600 text-white rounded-tr-none"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none"
                    )}>
                        {message.content}
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                        {format(new Date(message.createdAt), 'HH:mm', { locale: vi })}
                    </span>
                </div>
            </div>
        </div>
    );
}
