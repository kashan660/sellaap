import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    // Custom logic if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Admin routes
        if (path.startsWith("/admin")) {
          console.log('Admin route access attempt - token role:', token?.role, 'path:', path);
          return token?.role === "ADMIN";
        }

        // Protected routes
        if (path.startsWith("/profile") || path.startsWith("/checkout")) {
          console.log('Protected route access attempt - token exists:', !!token, 'path:', path);
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/checkout/:path*"],
};
