/*
 Minimal end-to-end smoke test for backend APIs used by the frontend.
 Usage: node smoke-e2e.js [baseUrl]
 Defaults to http://localhost:3010/api/v1
*/

const BASE = process.argv[2] || process.env.API_BASE || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1';

async function req(path, init) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, { ...(init || {}), headers: { 'content-type': 'application/json', ...(init?.headers || {}) } });
  const text = await res.text();
  const data = (() => { try { return JSON.parse(text); } catch { return text; } })();
  return { ok: res.ok, status: res.status, data };
}

async function main() {
  console.log('Smoke testing backend at', BASE);

  const steps = [];
  const run = async (name, fn) => {
    process.stdout.write(`- ${name} ... `);
    try {
      const out = await fn();
      console.log('ok');
      steps.push({ name, ok: true, out });
    } catch (err) {
      console.log('FAIL');
      steps.push({ name, ok: false, err: String(err) });
    }
  };

  await run('health', async () => {
    const r = await req('/health');
    if (!r.ok) throw new Error(`status ${r.status}`);
    return r.data;
  });

  await run('list categories', async () => {
    const r = await req('/catalog/categories');
    if (!r.ok) throw new Error(`status ${r.status}`);
    if (!Array.isArray(r.data)) throw new Error('invalid categories');
    return r.data.slice(0, 3);
  });

  await run('list featured products', async () => {
    const r = await req('/catalog/products?featured=true&pageSize=3');
    if (!r.ok) throw new Error(`status ${r.status}`);
    if (!r.data || !Array.isArray(r.data.items)) throw new Error('invalid products response');
    return r.data.items.map(p => ({ id: p.id, name: p.name, priceCents: p.priceCents })).slice(0, 3);
  });

  await run('search popular', async () => {
    const r = await req('/search/popular?limit=5');
    if (!r.ok) throw new Error(`status ${r.status}`);
    if (!Array.isArray(r.data)) throw new Error('invalid popular list');
    return r.data;
  });

  await run('search suggestions', async () => {
    const r = await req('/search/suggestions?q=sony&limit=5');
    if (!r.ok) throw new Error(`status ${r.status}`);
    if (!Array.isArray(r.data)) throw new Error('invalid suggestions list');
    return r.data;
  });

  await run('log search analytics', async () => {
    const r = await req('/search/analytics', {
      method: 'POST',
      body: JSON.stringify({ query: 'tai nghe', filters: { brand: 'Sony' }, resultCount: 5 })
    });
    if (!r.ok) throw new Error(`status ${r.status}`);
    return r.data;
  });

  // Auth: register -> login -> me
  const email = process.env.SMOKE_EMAIL || 'admin@audiotailoc.com';
  const password = process.env.SMOKE_PASSWORD || 'Smoke123!';
  let accessToken = null;
  let createdSlug = null;

  await run('auth register', async () => {
    const r = await req('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name: 'Smoke Admin' })
    });
    // If already registered, server may respond 400; allow it
    if (!r.ok && r.status !== 400 && r.status !== 409) throw new Error(`status ${r.status}`);
    return r.data;
  });

  await run('auth login', async () => {
    const r = await req('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (!r.ok) throw new Error(`status ${r.status}`);
    accessToken = r.data?.accessToken;
    if (!accessToken) throw new Error('missing accessToken');
    return { accessToken: accessToken.slice(0, 16) + '...' };
  });

  let me = null;
  await run('auth me', async () => {
    const r = await req('/auth/me', { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!r.ok) throw new Error(`status ${r.status}`);
    me = r.data;
    return r.data;
  });

  // Notifications basic flow (endpoints are public stubs)
  await run('notifications settings', async () => {
    const r = await req('/notifications/settings?userId=me');
    if (!r.ok) throw new Error(`status ${r.status}`);
    return r.data;
  });

  await run('notifications subscribe', async () => {
    const r = await req('/notifications/subscribe', { method: 'POST', body: JSON.stringify({ userId: 'me', type: 'system_updates', channel: 'email' }) });
    if (!r.ok) throw new Error(`status ${r.status}`);
    return r.data;
  });

  await run('notifications mark-all-read', async () => {
    const r = await req('/notifications/mark-all-read', { method: 'POST', body: JSON.stringify({ userId: me?.userId || 'me' }) });
    if (!r.ok) throw new Error(`status ${r.status}`);
    return r.data;
  });

  // List notifications (real list if userId present)
  await run('notifications list', async () => {
    const uid = me?.userId;
    const r = await req(`/notifications?userId=${encodeURIComponent(uid || 'me')}&read=false&page=1&limit=5`);
    if (!r.ok) throw new Error(`status ${r.status}`);
    return r.data?.pagination || r.data;
  });

  // Notification stats
  await run('notifications stats', async () => {
    const uid = me?.userId;
    const r = await req(`/notifications/stats?userId=${encodeURIComponent(uid || '')}`);
    if (!r.ok) throw new Error(`status ${r.status}`);
    return r.data;
  });

  // Admin-protected: create product
  await run('admin create product', async () => {
    const slug = `smoke-${Date.now()}`;
    createdSlug = slug;
    const r = await req('/catalog/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ slug, name: 'Smoke Test Product', description: 'Created by smoke test', priceCents: 123456, imageUrl: 'https://via.placeholder.com/300x200' })
    });
    if (!r.ok) {
      if (r.status === 403) {
        throw new Error('403 Forbidden. Ensure backend ENV ADMIN_EMAILS includes ' + email);
      }
      throw new Error(`status ${r.status}`);
    }
    return { id: r.data?.id, slug: r.data?.slug };
  });

  await run('admin verify product by slug', async () => {
    if (!createdSlug) return { skipped: true };
    const r = await req(`/catalog/products/slug/${encodeURIComponent(createdSlug)}`);
    if (!r.ok) throw new Error(`status ${r.status}`);
    return { id: r.data?.id, name: r.data?.name };
  });

  await run('admin delete product', async () => {
    if (!createdSlug) return { skipped: true };
    const r = await req(`/catalog/products/${encodeURIComponent(createdSlug)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!r.ok) throw new Error(`status ${r.status}`);
    return r.data;
  });

  // Summary
  const ok = steps.every(s => s.ok);
  console.log(`\nSummary: ${ok ? 'OK ✅' : 'FAILED ❌'}`);
  for (const s of steps) {
    console.log(`  - ${s.name}: ${s.ok ? 'ok' : 'fail'}`);
  }

  if (!ok) process.exit(1);
}

main().catch((e) => {
  console.error('Unexpected error:', e);
  process.exit(1);
});
