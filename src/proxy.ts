import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(request) {
    const { pathname } = request.nextUrl;

    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/static') ||
      pathname.includes('.')
    ) {
      return NextResponse.next();
    }

    try {
      const response = await fetch(`${request.nextUrl.origin}/api/redirects`, {
        next: { revalidate: 60 },
      });

      if (response.ok) {
        const redirects = await response.json();
        const match = redirects.find((r: any) => r.source === pathname);
        if (match) {
          return NextResponse.redirect(new URL(match.destination, request.url), match.permanent ? 308 : 307);
        }
      }
    } catch (error) {
      console.error('Middleware redirect check failed:', error);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        if (path.startsWith("/admin")) {
          return token?.role === "ADMIN";
        }

        if (path.startsWith("/profile") || path.startsWith("/checkout")) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

