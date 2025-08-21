async function fetchMe(): Promise<{ userId: string } | { user: null }> {
  const res = await fetch('/api/auth/me', { cache: 'no-store' } as RequestInit);
  return (await res.json()) as { userId: string } | { user: null };
}

export default async function AccountPage() {
  const me = await fetchMe();
  return (
    <main style={{ padding: 24 }}>
      <h1>Tài khoản</h1>
      {'userId' in me ? <p>Đăng nhập: {me.userId}</p> : <p>Chưa đăng nhập</p>}
      <form action="/api/auth/logout" method="post">
        <button type="submit">Đăng xuất</button>
      </form>
    </main>
  );
}

