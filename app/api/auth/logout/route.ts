import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] === LOGOUT REQUEST ===");

    // Create response
    const response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    );

    // Clear auth cookies by setting them with maxAge: 0
    response.cookies.set({
      name: "access_token",
      value: "",
      maxAge: 0,
    });

    response.cookies.set({
      name: "refresh_token",
      value: "",
      maxAge: 0,
    });

    console.log("[v0] Auth cookies cleared");
    return response;
  } catch (error) {
    console.error("[v0] ✗ Logout error:", error);
    return NextResponse.json(
      { error: "Logout failed. Please try again." },
      { status: 500 }
    );
  }
}
