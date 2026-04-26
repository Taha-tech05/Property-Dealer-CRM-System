import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // If an Agent tries to access an Admin route, redirect them
    if (path.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Only allow logged-in users
    },
  }
);

export const config = { matcher: ["/admin/:path*", "/dashboard/:path*", "/leads/:path*"] };