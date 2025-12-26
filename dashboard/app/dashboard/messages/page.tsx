"use client"

import { useChat } from "@/hooks/use-chat"
import { ChatSidebar } from "@/components/chat/ChatSidebar"
import { ChatWindow } from "@/components/chat/ChatWindow"

export default function MessagesPage() {
  const {
    conversations,
    activeConversation,
    messages,
    loading,
    sending,
    messagesEndRef,
    selectConversation,
    sendMessage
  } = useChat()

  return (
    <div className="p-4 h-[calc(100vh-80px)]">
      <div className="flex h-full overflow-hidden bg-background rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <ChatSidebar
          conversations={conversations}
          activeId={activeConversation?.id}
          onSelect={selectConversation}
        />

        <ChatWindow
          conversation={activeConversation}
          messages={messages}
          loading={loading}
          sending={sending}
          messagesEndRef={messagesEndRef}
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  )
}
