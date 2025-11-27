"use client"


import { useChat } from '@/hooks/use-chat';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';

export default function MessagesPage() {
  const {
    conversations,
    activeConversation,
    messages,
    loading,
    sending,
    messagesEndRef,
    selectConversation,
    sendMessage,
  } = useChat();

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <ChatSidebar
        conversations={conversations}
        activeId={activeConversation?.id}
        onSelect={selectConversation}
      />
      <ChatWindow
        conversation={activeConversation}
        messages={messages}
        onSendMessage={sendMessage}
        loading={loading}
        sending={sending}
        messagesEndRef={messagesEndRef}
      />
    </div>
  );
}
