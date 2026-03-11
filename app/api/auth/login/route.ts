import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials, generateJWT } from "@/lib/auth";
import { requireDatabaseConnection } from "@/lib/db-health";
import { cookieConfig, jwtSecret, JWT_ACCESS_TOKEN_EXPIRES, JWT_REFRESH_TOKEN_EXPIRES } from "@/lib/env";
import { createRateLimiter, getClientIp, RATE_LIMITS, getRateLimitHeaders } from "@/lib/rate-limit";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] === LOGIN REQUEST ===");
    console.log("[v0] Timestamp:", new Date().toISOString());

    // Apply rate limiting
    const clientIp = getClientIp(request);
    const rateLimitKey = `login:${clientIp}`;
    const rateLimit = createRateLimiter(rateLimitKey, RATE_LIMITS.AUTH);

    if (!rateLimit.isAllowed) {
      console.warn("[v0] Rate limit exceeded for IP:", clientIp);
      const response = NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
      response.headers.set('Retry-After', Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString());
      Object.entries(getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime)).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    // Require database connection - fail fast if DB is down
    await requireDatabaseConnection();
    console.log("[v0] Database connection verified");

    const body = await request.json();
    console.log("[v0] Login attempt for email:", body.email);

    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      const errorMsg = validation.error.errors[0].message;
      console.error("[v0] Login validation error:", errorMsg);
      return NextResponse.json(
        { error: errorMsg },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;
    console.log("[v0] Input validation passed");

    // Verify credentials against database
    console.log("[v0] Verifying credentials for email:", email);
    const user = await verifyCredentials(email, password);

    if (!user) {
      console.warn("[v0] Login failed: invalid credentials for email -", email);
      return NextResponse.json(
        { error: "Invalid email or password. Please check and try again." },
        { status: 401 }
      );
    }

    console.log("[v0] ✓ Login successful - User ID:", user.id);

    // Generate JWT tokens
    const accessToken = generateJWT(
      { userId: user.id, email: user.email, role: user.role },
      jwtSecret,
      JWT_ACCESS_TOKEN_EXPIRES
    );

    const refreshToken = generateJWT(
      { userId: user.id, type: "refresh" },
      jwtSecret,
      JWT_REFRESH_TOKEN_EXPIRES
    );

    console.log("[v0] JWT tokens generated");

    // Create response with user data
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // Set secure HTTP-only cookies with JWT tokens
    response.cookies.set({
      name: "access_token",
      value: accessToken,
      ...cookieConfig,
      maxAge: JWT_ACCESS_TOKEN_EXPIRES,
    });

    response.cookies.set({
      name: "refresh_token",
      value: refreshToken,
      ...cookieConfig,
      maxAge: JWT_REFRESH_TOKEN_EXPIRES,
    });

    console.log("[v0] JWT cookies set with secure config");

    // Add rate limit headers to response
    Object.entries(getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime)).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error("[v0] ✗ Login error:", error);

    // Handle database connection errors
    if (error instanceof Error && error.message.includes("Database connection failed")) {
      console.error("[v0] Database unavailable - cannot proceed");
      return NextResponse.json(
        { error: "Authentication service is temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Login failed. Please try again later." },
      { status: 500 }
    );
  }
}
