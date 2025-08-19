export default function LoginPage() {
  async function action(data: FormData) {
    'use server';
    const email = String(data.get('email') || '');
    const password = String(data.get('password') || '');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ? '' : ''}/api/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      return { error: 'Đăng nhập thất bại' };
    }
    return { ok: true };
  }

  return (
    <form action={action} style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
      <h1>Đăng nhập</h1>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Mật khẩu" required />
      <button type="submit">Đăng nhập</button>
    </form>
  );
}

