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
    <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 50 }}>
      {open && (
        <div style={{ width: 320, height: 420, background: 'white', border: '1px solid #ddd', borderRadius: 8, display: 'flex', flexDirection: 'column', boxShadow: '0 6px 24px rgba(0,0,0,0.15)' }}>
          <div style={{ padding: 8, borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
            <strong style={{ flex: 1 }}>Trợ lý Tài Lộc</strong>
            <button onClick={() => setOpen(false)} aria-label="Đóng">×</button>
          </div>
          <div ref={boxRef} style={{ flex: 1, overflow: 'auto', padding: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', background: m.role === 'user' ? '#eef' : '#f5f5f5', padding: '6px 10px', borderRadius: 8, maxWidth: '85%' }}>
                {m.text}
              </div>
            ))}
            {loading && <div style={{ color: '#666', fontSize: 12 }}>Đang soạn…</div>}
          </div>
          <div style={{ padding: 8, borderTop: '1px solid #eee', display: 'flex', gap: 8 }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' ? send() : undefined} placeholder="Nhập câu hỏi…" style={{ flex: 1, border: '1px solid #ddd', borderRadius: 6, padding: '8px 10px' }} />
            <button onClick={send} disabled={loading} style={{ padding: '8px 12px', border: '1px solid #222', borderRadius: 6 }}>Gửi</button>
            {sessionId ? <button onClick={async () => { await fetch('/api/ai/escalate', { method: 'POST', headers: { 'content-type':'application/json' }, body: JSON.stringify({ sessionId }) }); }} style={{ padding: '8px 12px', border: '1px solid #c00', borderRadius: 6, color: '#c00' }}>Chuyển người</button> : null}
          </div>
        </div>
      )}
      <button onClick={() => setOpen((v) => !v)} style={{ padding: '10px 14px', borderRadius: 999, border: '1px solid #222', background: 'white' }}>{open ? 'Ẩn chat' : 'Chat với Tài Lộc'}</button>
    </div>
  );
}


