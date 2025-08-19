import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default function LoginPage() {
  async function action(data: FormData) {
    'use server';
    const email = String(data.get('email') || '');
    const password = String(data.get('password') || '');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const c = await cookies();
      c.set('flash', JSON.stringify({ type: 'error', message: 'Đăng nhập thất bại' }), { path: '/', httpOnly: true, maxAge: 10 });
      return;
    }
    const result = await res.json();
    const c = await cookies();
    c.set('accessToken', result.accessToken, { path: '/', httpOnly: true, maxAge: 86400 }); // 24 hours
    c.set('flash', JSON.stringify({ type: 'success', message: 'Đăng nhập thành công' }), { path: '/', httpOnly: true, maxAge: 10 });
    redirect('/products');
  }

  return (
    <form action={action} style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
      <h1>Đăng nhập (Admin)</h1>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Mật khẩu" required />
      <button type="submit">Đăng nhập</button>
    </form>
  );
}
