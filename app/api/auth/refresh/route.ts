import { NextRequest, NextResponse } from "next/server";
import { verifyJWT, generateJWT } from "@/lib/auth";
import { jwtSecret, JWT_ACCESS_TOKEN_EXPIRES, JWT_REFRESH_TOKEN_EXPIRES, cookieConfig } from "@/lib/env";

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] === REFRESH TOKEN REQUEST ===");

    // Get refresh token from cookies
    const refreshToken = request.cookies.get("refresh_token")?.value;

    if (!refreshToken) {
      console.warn("[v0] No refresh token found in cookies");
      return NextResponse.json(
        { error: "No refresh token found. Please login again." },
        { status: 401 }
      );
    }

    // Verify refresh token
    const payload = verifyJWT(refreshToken, jwtSecret);

    if (!payload || payload.type !== "refresh") {
      console.warn("[v0] Invalid or expired refresh token");
      return NextResponse.json(
        { error: "Invalid refresh token. Please login again." },
        { status: 401 }
      );
    }

    console.log("[v0] ✓ Refresh token verified for user:", payload.userId);

    // Generate new access token
    const newAccessToken = generateJWT(
      { userId: payload.userId, type: "access" },
      jwtSecret,
      JWT_ACCESS_TOKEN_EXPIRES
    );

    console.log("[v0] New access token generated");

    // Create response
    const response = NextResponse.json(
      { message: "Token refreshed successfully" },
      { status: 200 }
    );

    // Set new access token cookie
    response.cookies.set({
      name: "access_token",
      value: newAccessToken,
      ...cookieConfig,
      maxAge: JWT_ACCESS_TOKEN_EXPIRES,
    });

    console.log("[v0] New access token cookie set");
    return response;
  } catch (error) {
    console.error("[v0] ✗ Refresh token error:", error);
    return NextResponse.json(
      { error: "Token refresh failed. Please login again." },
      { status: 500 }
    );
  }
}
