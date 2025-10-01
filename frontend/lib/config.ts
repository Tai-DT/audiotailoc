const normalizeUrl = (raw?: string | null) => {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  if (!/^https?:\/\//i.test(trimmed)) return undefined;
  return trimmed.replace(/\/+$/, '');
};

const pickFirstUrl = (candidates: Array<string | undefined | null>) => {
  for (const candidate of candidates) {
    const normalized = normalizeUrl(candidate);
    if (normalized) return normalized;
  }
  return undefined;
};

export const getBackendApiBaseUrl = () => {
  const url = pickFirstUrl([
    process.env.BACKEND_API_URL,
    process.env.NEXT_PUBLIC_BACKEND_URL,
    process.env.NEXT_PUBLIC_API_URL,
    process.env.API_BASE_URL,
  ]);
  
  if (!url) {
    throw new Error('Backend API URL is not configured. Please set NEXT_PUBLIC_API_URL environment variable.');
  }
  
  return url;
};

export const getBackendApiOrigin = () => {
  const baseUrl = getBackendApiBaseUrl();
  try {
    return new URL(baseUrl).origin;
  } catch {
    return baseUrl;
  }
};

export const getFrontendBaseUrl = () => {
  const url = pickFirstUrl([
    process.env.FRONTEND_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_BASE_URL,
  ]);
  
  if (!url) {
    throw new Error('Frontend URL is not configured. Please set FRONTEND_URL environment variable.');
  }
  
  return url;
};
