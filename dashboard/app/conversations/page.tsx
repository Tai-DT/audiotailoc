type Session = { id: string; status: 'OPEN' | 'ESCALATED' | 'CLOSED'; source: 'WEB' | 'ZALO'; createdAt: string; updatedAt: string };

async function fetchSessions(params: { status?: string; page?: number; pageSize?: number }) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const u = new URL(`${base}/chat/sessions`);
  if (params.status) u.searchParams.set('status', params.status);
  if (params.page) u.searchParams.set('page', String(params.page));
  if (params.pageSize) u.searchParams.set('pageSize', String(params.pageSize));
  const res = await fetch(u.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error('Không thể tải danh sách phiên chat');
  return (await res.json()) as { total: number; page: number; pageSize: number; items: Session[] };
}

export default async function ConversationsPage({ searchParams }: { searchParams: Promise<{ status?: string; page?: string }> }) {
  const sp = await searchParams;
  const status = sp?.status || '';
  const page = Math.max(1, parseInt(String(sp?.page ?? '1'), 10) || 1);
  const pageSize = 20;
  const data = await fetchSessions({ status: status || undefined, page, pageSize });
  const totalPages = Math.max(1, Math.ceil(data.total / pageSize));
  return (
    <main style={{ padding: 24 }}>
      <h1>Hội thoại</h1>
      <form style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
        <select name="status" defaultValue={status}>
          <option value="">Tất cả</option>
          {['OPEN', 'ESCALATED', 'CLOSED'].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button type="submit">Lọc</button>
      </form>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>ID</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Nguồn</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Trạng thái</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Cập nhật</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((s) => (
            <tr key={s.id}>
              <td style={{ padding: 8 }}>{s.id}</td>
              <td style={{ padding: 8 }}>{s.source}</td>
              <td style={{ padding: 8 }}>{s.status}</td>
              <td style={{ padding: 8 }}>{new Date(s.updatedAt).toLocaleString('vi-VN')}</td>
              <td style={{ padding: 8 }}>
                <a href={`/conversations/${s.id}`}>Xem</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {page > 1 ? <a href={`/conversations?page=${page - 1}&status=${encodeURIComponent(status)}`}>← Trước</a> : <span />}
        <span>
          Trang {page}/{totalPages}
        </span>
        {page < totalPages ? <a href={`/conversations?page=${page + 1}&status=${encodeURIComponent(status)}`}>Sau →</a> : <span />}
      </div>
    </main>
  );
}


