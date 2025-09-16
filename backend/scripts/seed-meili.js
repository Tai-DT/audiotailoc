#!/usr/bin/env node
/* Seed products into Meilisearch */
const { PrismaClient } = require('@prisma/client');
const fetch = global.fetch || require('node-fetch');

(async () => {
  const prisma = new PrismaClient();
  try {
    const MEILI_ENABLED = (process.env.MEILI_ENABLED || '').toLowerCase() === 'true';
    const MEILI_URL = process.env.MEILI_URL || 'http://localhost:7700';
    const MEILI_API_KEY = process.env.MEILI_API_KEY || '';
    if (!MEILI_URL) throw new Error('MEILI_URL is not set');

    const headers = { 'content-type': 'application/json' };
    if (MEILI_API_KEY) headers['Authorization'] = `Bearer ${MEILI_API_KEY}`;

    // Ensure index exists
    await fetch(`${MEILI_URL}/indexes/products`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ uid: 'products', primaryKey: 'id' })
    }).catch(() => {});

    console.log('Fetching products from database...');
    const products = await prisma.product.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        priceCents: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { name: true } },
      },
      take: 1000,
    });

    const docs = products.map(p => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description || '',
      priceCents: p.priceCents,
      imageUrl: p.imageUrl || '',
      category: p.category ? p.category.name : null,
      categorySlug: p.category ? p.category.slug : null,
      tags: p.tags.map(t => t.name),
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    console.log(`Indexing ${docs.length} products into Meilisearch...`);
    const res = await fetch(`${MEILI_URL}/indexes/products/documents`, {
      method: 'POST',
      headers,
      body: JSON.stringify(docs)
    });
    const out = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error('Failed to index:', out);
      process.exit(1);
    }
    console.log('Indexing task enqueued:', out);
    console.log('Done.');
  } catch (e) {
    console.error('Seed error:', e.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
