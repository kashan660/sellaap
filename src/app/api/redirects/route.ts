import { NextResponse } from 'next/server';
import { getCachedRedirects } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const redirects = await getCachedRedirects();
    return NextResponse.json(redirects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch redirects' }, { status: 500 });
  }
}
