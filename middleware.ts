import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  console.log('Middleware - Path:', pathname);
  console.log('Middleware - Token:', token);
  console.log('Middleware - User role:', token?.role);

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!token) {
      console.log('No token found for admin route, redirecting to signin');
      return NextResponse.redirect(new URL('/auth/signin?callbackUrl=/admin', request.url));
    }
    
    if (token.role !== 'ADMIN') {
      console.log('Non-admin user trying to access admin route, redirecting to profile');
      return NextResponse.redirect(new URL('/profile', request.url));
    }
    
    console.log('Admin user accessing admin route, allowing');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};