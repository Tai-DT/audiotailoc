/*
  Normalize Project array-like fields

  This script converts comma-separated strings and invalid JSON strings into
  valid JSON array strings for the following columns:
  - technologies
  - features
  - images
  - tags
  - galleryImages

  Usage:
    npx tsx src/migrate-project-array-fields.ts

  Options:
    --dry-run   Print changes without writing
    --limit=50  Process only first N projects
*/

/* eslint-disable no-console */

import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

type ProjectRow = {
  id: string;
  name: string;
  technologies: string | null;
  features: string | null;
  images: string | null;
  tags: string | null;
  galleryImages: string | null;
};

type Args = {
  dryRun: boolean;
  limit?: number;
};

function parseArgs(argv: string[]): Args {
  const args: Args = { dryRun: false };

  for (const raw of argv) {
    if (raw === '--dry-run') args.dryRun = true;
    if (raw.startsWith('--limit=')) {
      const value = Number(raw.slice('--limit='.length));
      if (Number.isFinite(value) && value > 0) args.limit = Math.floor(value);
    }
  }

  return args;
}

function normalizeStringArrayField(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;

  if (Array.isArray(value)) {
    const items = value
      .map(v => (v === null || v === undefined ? '' : String(v).trim()))
      .filter(Boolean);
    return items.length ? JSON.stringify(items) : undefined;
  }

  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  // If it looks like a JSON array, try parsing.
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        const items = parsed
          .map(v => (v === null || v === undefined ? '' : String(v).trim()))
          .filter(Boolean);
        return items.length ? JSON.stringify(items) : undefined;
      }

      if (typeof parsed === 'string') {
        const item = parsed.trim();
        return item ? JSON.stringify([item]) : undefined;
      }
    } catch {
      // fall through to comma-split
    }
  }

  // Handle comma-separated lists (or single string).
  const parts = trimmed
    .split(',')
    .map(p => p.trim())
    .filter(Boolean);

  return JSON.stringify(parts.length ? parts : [trimmed]);
}

function normalizeProjectFields(project: ProjectRow): Record<string, string> {
  const fields = ['technologies', 'features', 'images', 'tags', 'galleryImages'] as const;
  const updates: Record<string, string> = {};

  for (const field of fields) {
    const current = project[field];
    if (current === undefined || current === null) continue;

    const normalized = normalizeStringArrayField(current);
    if (normalized === undefined) continue;

    // Only update if it changes the stored value.
    if (typeof current !== 'string' || current !== normalized) {
      updates[field] = normalized;
    }
  }

  return updates;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  console.log('🔧 Normalizing project array-like fields...');
  console.log(`   dryRun: ${args.dryRun}`);
  console.log(`   limit:  ${args.limit ?? 'none'}`);

  const projects: ProjectRow[] = await prisma.projects.findMany({
    where: { isDeleted: false },
    take: args.limit,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      technologies: true,
      features: true,
      images: true,
      tags: true,
      galleryImages: true,
    },
  });

  console.log(`📦 Found ${projects.length} projects to inspect`);

  let changed = 0;
  let skipped = 0;
  let failed = 0;

  for (const project of projects) {
    const updates = normalizeProjectFields(project);

    if (Object.keys(updates).length === 0) {
      skipped++;
      continue;
    }

    changed++;
    console.log(`\n🧩 ${project.name} (${project.id})`);
    for (const [k, v] of Object.entries(updates)) {
      const before = typeof project[k] === 'string' ? project[k] : JSON.stringify(project[k]);
      console.log(`  - ${k}: ${String(before).slice(0, 120)} -> ${v.slice(0, 120)}`);
    }

    if (args.dryRun) continue;

    try {
      await prisma.projects.update({
        where: { id: project.id },
        data: {
          ...updates,
          updatedAt: new Date(),
        },
      });
    } catch (err) {
      failed++;
      console.error(`  ❌ Failed to update ${project.id}:`, err);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Migration Summary');
  console.log(`  ✅ Changed: ${changed}${args.dryRun ? ' (dry-run)' : ''}`);
  console.log(`  ⏭️  Skipped: ${skipped}`);
  console.log(`  ❌ Failed:  ${failed}`);
  console.log('='.repeat(60));
}

main()
  .catch(e => {
    console.error('❌ Migration failed:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
