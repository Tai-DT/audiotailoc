'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

type Message = { role: 'user' | 'assistant'; text: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text }]);
    setLoading(true);
    try {
      const res = await fetch('/api/ai/chat/stream', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId: sessionId || undefined }),
      });
      if (!res.body) throw new Error('No stream');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      setMessages((m) => [...m, { role: 'assistant', text: '' }]);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        acc += chunk;
        // Parse SSE lines
        for (const line of chunk.split('\n')) {
          if (line.startsWith('data: ')) {
            try {
              const payload = JSON.parse(line.slice(6));
              if (payload.chunk) {
                setMessages((m) => {
                  const copy = [...m];
                  const last = copy[copy.length - 1];
                  if (last && last.role === 'assistant') last.text += payload.chunk;
                  return copy;
                });
              }
              if (payload.sessionId) setSessionId(payload.sessionId);
            } catch {}
          }
        }
      }
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', text: 'Xin lỗi, hiện không phản hồi được.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed right-4 bottom-4 z-50">
      {open && (
        <div className="w-80 h-96 bg-white border border-gray-300 rounded-lg shadow-xl flex flex-col mb-4">
          <div className="p-3 border-b border-gray-200 flex items-center bg-blue-600 text-white rounded-t-lg">
            <strong className="flex-1">🎵 Trợ lý Tài Lộc</strong>
            <button 
              onClick={() => setOpen(false)} 
              aria-label="Đóng"
              className="text-white hover:text-gray-200 text-xl leading-none"
            >
              ×
            </button>
          </div>
          <div 
            ref={boxRef} 
            className="flex-1 overflow-auto p-3 flex flex-col gap-2 bg-gray-50"
          >
            {messages.map((m, i) => (
              <div 
                key={i} 
                className={`${
                  m.role === 'user' 
                    ? 'self-end bg-blue-500 text-white' 
                    : 'self-start bg-white border border-gray-200'
                } p-2 rounded-lg max-w-[85%] shadow-sm`}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="text-gray-500 text-xs animate-pulse">Đang soạn…</div>
            )}
          </div>
          <div className="p-3 border-t border-gray-200 flex gap-2">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' ? send() : undefined} 
              placeholder="Nhập câu hỏi…" 
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              onClick={send} 
              disabled={loading} 
              className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Gửi
            </button>
            {sessionId ? (
              <button 
                onClick={async () => { 
                  await fetch('/api/ai/escalate', { 
                    method: 'POST', 
                    headers: { 'content-type':'application/json' }, 
                    body: JSON.stringify({ sessionId }) 
                  }); 
                }} 
                className="px-3 py-2 border border-red-500 text-red-500 rounded-md text-sm hover:bg-red-50 transition-colors"
              >
                Chuyển người
              </button>
            ) : null}
          </div>
        </div>
      )}
      <button 
        onClick={() => setOpen((v) => !v)} 
        className="px-4 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-lg transition-all duration-200 hover:shadow-xl transform hover:scale-105"
      >
        {open ? '💬 Ẩn chat' : '💬 Chat với Tài Lộc'}
      </button>
    </div>
  );
}


