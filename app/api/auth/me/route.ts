import { NextRequest, NextResponse } from "next/server";
import { verifyJWT, getUserById } from "@/lib/auth";
import { jwtSecret } from "@/lib/env";

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] === AUTH ME REQUEST ===");

    // Get access token from cookies
    const accessToken = request.cookies.get("access_token")?.value;

    if (!accessToken) {
      console.log("[v0] No access token found - user not authenticated");
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify access token
    const payload = verifyJWT(accessToken, jwtSecret);

    if (!payload) {
      console.warn("[v0] Invalid or expired access token");
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    console.log("[v0] ✓ Access token verified for user:", payload.userId);

    // Get full user data from database
    const user = await getUserById(payload.userId);

    if (!user) {
      console.warn("[v0] User not found in database");
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    console.log("[v0] ✓ User data retrieved");

    return NextResponse.json(
      {
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[v0] ✗ Auth me error:", error);
    return NextResponse.json(
      { error: "Failed to get user data" },
      { status: 500 }
    );
  }
}
