import { prisma } from '@/lib/prisma';

const CJ_API_BASE = 'https://developers.cjdropshipping.com/api2.0/v1';
const TOKEN_REFRESH_BUFFER_MS = 60 * 60 * 1000;

interface CjTokenPayload {
  accessToken: string;
  accessTokenExpiryDate: string;
  refreshToken: string;
  refreshTokenExpiryDate: string;
}

async function fetchNewToken(): Promise<CjTokenPayload> {
  const apiKey = process.env.CJ_API_KEY;
  if (!apiKey) throw new Error('CJ_API_KEY is not configured');

  const res = await fetch(`${CJ_API_BASE}/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey }),
  });
  const payload = await res.json().catch(() => null);
  if (!res.ok || !payload?.result) {
    throw new Error(payload?.message || 'Failed to authenticate with CJ Dropshipping');
  }
  return payload.data;
}

async function refreshExistingToken(refreshToken: string): Promise<CjTokenPayload> {
  const res = await fetch(`${CJ_API_BASE}/authentication/refreshAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  const payload = await res.json().catch(() => null);
  if (!res.ok || !payload?.result) {
    throw new Error(payload?.message || 'Failed to refresh CJ Dropshipping token');
  }
  return payload.data;
}

async function saveToken(data: CjTokenPayload) {
  const record = {
    accessToken: data.accessToken,
    accessTokenExpiresAt: new Date(data.accessTokenExpiryDate),
    refreshToken: data.refreshToken,
    refreshTokenExpiresAt: new Date(data.refreshTokenExpiryDate),
  };
  const existing = await prisma.cjAuthToken.findFirst();
  if (existing) {
    return prisma.cjAuthToken.update({ where: { id: existing.id }, data: record });
  }
  return prisma.cjAuthToken.create({ data: record });
}

async function getAccessToken(): Promise<string> {
  const existing = await prisma.cjAuthToken.findFirst();

  if (!existing) {
    const fresh = await fetchNewToken();
    await saveToken(fresh);
    return fresh.accessToken;
  }

  if (existing.accessTokenExpiresAt.getTime() - Date.now() > TOKEN_REFRESH_BUFFER_MS) {
    return existing.accessToken;
  }

  try {
    const refreshed = await refreshExistingToken(existing.refreshToken);
    await saveToken(refreshed);
    return refreshed.accessToken;
  } catch (error) {
    console.error('CJ token refresh failed, re-authenticating:', error);
    const fresh = await fetchNewToken();
    await saveToken(fresh);
    return fresh.accessToken;
  }
}

async function cjRequest(
  path: string,
  options: { method?: 'GET' | 'POST'; body?: unknown; query?: Record<string, string | number | undefined> } = {}
) {
  const accessToken = await getAccessToken();
  const url = new URL(`${CJ_API_BASE}${path}`);
  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  const res = await fetch(url.toString(), {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      'CJ-Access-Token': accessToken,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = await res.json().catch(() => null);
  if (!res.ok || payload?.result === false) {
    throw new Error(payload?.message || `CJ Dropshipping request failed: ${path}`);
  }
  return payload;
}

export function cjGet(path: string, query?: Record<string, string | number | undefined>) {
  return cjRequest(path, { method: 'GET', query });
}

export function cjPost(path: string, body: unknown) {
  return cjRequest(path, { method: 'POST', body });
}
