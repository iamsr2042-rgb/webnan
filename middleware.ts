import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";

// Get JWT secret from env (note: in middleware, we can use process.env directly)
const jwtSecret = process.env.JWT_SECRET || "dev-jwt-secret-change-in-production";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Routes that require authentication
  const protectedRoutes = ["/dashboard", "/admin"];
  const adminRoutes = ["/admin"];
  const authRoutes = ["/login", "/register"];

  // Check if current route needs protection
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Get access token from cookies
  const accessToken = request.cookies.get("access_token")?.value;

  // If no token and route is protected, redirect to login
  if (isProtected && !accessToken) {
    console.log(`[v0] Middleware: Redirecting unauthenticated user from ${pathname} to /login`);
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If token exists, verify it
  if (accessToken) {
    const payload = verifyJWT(accessToken, jwtSecret);

    // If token is invalid/expired and route is protected, redirect to login
    if (!payload && isProtected) {
      console.log(`[v0] Middleware: Redirected user with invalid token from ${pathname} to /login`);
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check admin access for admin routes
    if (isAdminRoute && payload && payload.role !== "ADMIN") {
      console.log(
        `[v0] Middleware: Non-admin user attempted to access ${pathname}`
      );
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // If authenticated user tries to access auth routes, redirect to dashboard
  if (isAuthRoute && accessToken) {
    const payload = verifyJWT(accessToken, jwtSecret);
    if (payload) {
      console.log(
        `[v0] Middleware: Authenticated user redirected from ${pathname} to /dashboard`
      );
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    // API routes for protected resources
    "/api/orders/:path*",
    "/api/products/:path*",
    "/api/users/:path*",
  ],
};
