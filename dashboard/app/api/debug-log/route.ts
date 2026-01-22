import { NextRequest, NextResponse } from 'next/server';
import { appendFile, mkdir } from 'fs/promises';
import path from 'path';

// Use project-relative path instead of hardcoded user path
const LOG_PATH = path.join(process.cwd(), 'logs', 'debug.log');

async function ensureDirExists(filePath: string) {
  const dir = path.dirname(filePath);
  try {
    await mkdir(dir, { recursive: true });
  } catch (err) {
    // Ignore if directory already exists
    if ((err as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw err;
    }
  }
}

export async function POST(request: NextRequest) {
  // In production or when debug logging is disabled, just return success
  if (process.env.NODE_ENV === 'production' || process.env.DISABLE_DEBUG_LOG === 'true') {
    return new NextResponse(null, { status: 204 });
  }

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
    const logEntry = {
      ...safeBody,
      timestamp: new Date().toISOString(),
    };
    await appendFile(LOG_PATH, `${JSON.stringify(logEntry)}\n`, { encoding: 'utf8' });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    // Silently fail for debug logging - don't break the app
    console.warn('[debug-log] failed to write log:', (error as Error).message);
    return new NextResponse(null, { status: 204 });
  }
}



