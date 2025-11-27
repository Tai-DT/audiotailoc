"use client";

import { useState } from "react";
import { MessageCircle, X, MessageCircleMore, MessagesSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useZaloChat } from "@/hooks/use-zalo-chat";
import { CONTACT_CONFIG } from "@/lib/contact-config";

export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { openZaloChat } = useZaloChat();

  const toggle = () => setOpen((prev) => !prev);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="w-60 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-xl p-3 space-y-2">
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">Chọn cách chat</div>
          <Button
            variant="default"
            className="w-full justify-start gap-2"
            onClick={() => {
              router.push("/chat");
              setOpen(false);
            }}
          >
            <MessagesSquare className="h-4 w-4" />
            Chat trực tiếp
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => {
              openZaloChat(CONTACT_CONFIG.zalo.phoneNumber);
              setOpen(false);
            }}
          >
            <MessageCircleMore className="h-4 w-4" />
            Chat Zalo
          </Button>
        </div>
      )}
      <Button
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
        onClick={toggle}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </Button>
    </div>
  );
}
