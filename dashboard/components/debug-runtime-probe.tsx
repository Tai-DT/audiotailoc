/* Runtime probe for debug mode: emits a log line on client mount */
"use client";

import { useEffect } from "react";

/**
 * Optional external ingest endpoint (e.g. a local debug agent).
 *
 * If not set, we only use the internal fallback route to avoid noisy
 * `net::ERR_CONNECTION_REFUSED` errors when nothing is listening locally.
 */
const EXTERNAL_INGEST_ENDPOINT = process.env.NEXT_PUBLIC_DEBUG_INGEST_ENDPOINT;
const FALLBACK = "/api/debug-log";
const PORT_HINT = process.env.NEXT_PUBLIC_DASHBOARD_PORT || "3001";

export function DebugRuntimeProbe() {
  useEffect(() => {
    const payload = {
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H0",
      location: "components/debug-runtime-probe.tsx:14",
      message: "probe.client.mount",
      data: {
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "n/a",
        portHint: PORT_HINT,
        timestamp: Date.now(),
      },
      timestamp: Date.now(),
    };

    const requestInit: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Best-effort; don't block navigation/unload.
      keepalive: true,
    };

    // Prefer external ingest only if explicitly configured.
    const primary = typeof EXTERNAL_INGEST_ENDPOINT === "string" && EXTERNAL_INGEST_ENDPOINT.length > 0
      ? EXTERNAL_INGEST_ENDPOINT
      : null;

    if (primary) {
      fetch(primary, requestInit).catch(() => {
        fetch(FALLBACK, requestInit).catch(() => {});
      });
      return;
    }

    // Default: internal route only (no noisy localhost connection attempts).
    fetch(FALLBACK, requestInit).catch(() => {});
  }, []);

  return null;
}







