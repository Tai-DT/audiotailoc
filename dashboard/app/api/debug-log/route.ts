import { NextRequest, NextResponse } from 'next/server';
import { appendFile, mkdir } from 'fs/promises';
import path from 'path';

const LOG_PATH = '/Users/macbook/Desktop/audiotailoc/.cursor/debug.log';

async function ensureDirExists(filePath: string) {
  const dir = path.dirname(filePath);
  await mkdir(dir, { recursive: true });
}

export async function POST(request: NextRequest) {
  try {
    // Tolerate empty body or non-JSON payloads to avoid SyntaxError
    const raw = await request.text();
    let body: unknown = {};
    if (raw.trim().length > 0) {
      try {
        body = JSON.parse(raw);
      } catch {
        body = { message: raw };
      }
    }

    await ensureDirExists(LOG_PATH);
    // Append NDJSON line with minimal validation to prevent directory traversal
    const safeBody = typeof body === 'object' && body !== null ? body : { message: String(body) };
    await appendFile(LOG_PATH, `${JSON.stringify(safeBody)}\n`, { encoding: 'utf8' });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[debug-log] failed to write log', error);
    return NextResponse.json({ error: 'failed_to_write_log' }, { status: 500 });
  }
}







