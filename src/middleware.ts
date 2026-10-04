import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("admin_token")?.value;

  // Dashboard page protection
  if (pathname.startsWith("/dashboard")) {
    // If user is trying to access dashboard pages other than login, and has no token, redirect to login
    if (!pathname.startsWith("/dashboard/login") && !token) {
      const loginUrl = new URL("/dashboard/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    // If user is logged in and trying to access login page, redirect to dashboard
    if (pathname.startsWith("/dashboard/login") && token) {
      const dashboardUrl = new URL("/dashboard", req.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // API protection for mutations
  if (pathname.startsWith("/api/")) {
    const isPublicGet = req.method === "GET";
    const isLogin = pathname.startsWith("/api/auth/login");
    const isLogout = pathname.startsWith("/api/auth/logout");

    // If it's a mutating api route (not GET) and not auth routes, check token presence.
    // Full JWT verification is performed inside the API route handlers since they run in Node.js
    if (!isPublicGet && !isLogin && !isLogout) {
      if (!token) {
        return NextResponse.json(
          { success: false, error: "Unauthorized: Missing authentication token" },
          { status: 401 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
