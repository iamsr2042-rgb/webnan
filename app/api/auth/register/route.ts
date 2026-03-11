import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, generateJWT } from "@/lib/auth";
import { requireDatabaseConnection } from "@/lib/db-health";
import { cookieConfig, jwtSecret, JWT_ACCESS_TOKEN_EXPIRES, JWT_REFRESH_TOKEN_EXPIRES } from "@/lib/env";
import { createRateLimiter, getClientIp, RATE_LIMITS, getRateLimitHeaders } from "@/lib/rate-limit";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] === REGISTRATION REQUEST ===");
    console.log("[v0] Timestamp:", new Date().toISOString());

    // Apply rate limiting
    const clientIp = getClientIp(request);
    const rateLimitKey = `register:${clientIp}`;
    const rateLimit = createRateLimiter(rateLimitKey, RATE_LIMITS.AUTH);

    if (!rateLimit.isAllowed) {
      console.warn("[v0] Rate limit exceeded for IP:", clientIp);
      const response = NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
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
    console.log("[v0] Registration attempt for email:", body.email);

    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      const errorMsg = validation.error.errors[0].message;
      console.error("[v0] Validation error:", errorMsg);
      return NextResponse.json(
        { error: errorMsg },
        { status: 400 }
      );
    }

    const { email, password, name } = validation.data;
    console.log("[v0] Input validation passed");

    // Check if email already exists (duplicate email prevention)
    console.log("[v0] Checking for duplicate email:", email);
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.warn("[v0] Registration failed: email already exists -", email);
      return NextResponse.json(
        { error: "This email is already registered. Please login or use a different email." },
        { status: 409 }
      );
    }

    console.log("[v0] Email is unique, proceeding with registration");

    // Hash password for security
    const hashedPassword = await hashPassword(password);
    console.log("[v0] Password hashed successfully");

    // Create user in database
    console.log("[v0] Creating user in database");
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "CUSTOMER",
      },
    });

    console.log("[v0] ✓ User registered successfully - ID:", user.id);

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
        message: "Account created successfully! You can now login with your credentials.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
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
    console.error("[v0] ✗ Registration error:", error);

    // Handle database connection errors
    if (error instanceof Error && error.message.includes("Database connection failed")) {
      console.error("[v0] Database unavailable - cannot proceed");
      return NextResponse.json(
        { error: "Registration service is temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint failed")) {
        return NextResponse.json(
          { error: "This email is already registered. Please use a different email." },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Registration failed. Please try again later or contact support." },
      { status: 500 }
    );
  }
}
