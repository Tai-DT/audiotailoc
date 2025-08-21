type Message = { id: string; role: 'USER' | 'STAFF' | 'ASSISTANT' | 'SYSTEM'; text: string; createdAt: string };
type Session = { id: string; status: 'OPEN' | 'ESCALATED' | 'CLOSED'; messages: Message[] };

async function fetchSession(id: string): Promise<Session> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const res = await fetch(`${base}/chat/sessions/${encodeURIComponent(id)}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Không thể tải hội thoại');
  return (await res.json()) as Session;
}

export default async function ConversationDetail({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const session = await fetchSession(p.id);

  async function send(form: FormData) {
    'use server';
    const text = String(form.get('text') || '');
    const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
    await fetch(`${base}/chat/sessions/${encodeURIComponent(session.id)}/messages`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text }),
    });
  }

  async function escalate() {
    'use server';
    const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
    await fetch(`${base}/chat/sessions/${encodeURIComponent(session.id)}/escalate`, { method: 'PATCH' });
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Hội thoại {session.id}</h1>
      <p>Trạng thái: {session.status}</p>
      <form action={escalate as any}>
        <button type="submit">Escalate</button>
      </form>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
        {session.messages.map((m) => (
          <div key={m.id} style={{ alignSelf: m.role === 'USER' ? 'flex-start' : 'flex-end', background: '#f6f6f6', padding: '6px 10px', borderRadius: 6, maxWidth: 640 }}>
            <div style={{ fontSize: 12, color: '#666' }}>{m.role} — {new Date(m.createdAt).toLocaleString('vi-VN')}</div>
            <div>{m.text}</div>
          </div>
        ))}
      </div>
      <form action={send as any} style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <input name="text" placeholder="Nhập tin nhắn..." style={{ flex: 1, border: '1px solid #ddd', padding: '8px 10px', borderRadius: 6 }} />
        <button type="submit">Gửi</button>
      </form>
    </main>
  );
}


