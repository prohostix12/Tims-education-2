import { NextResponse } from "next/server";
import { verifyAdminPassword } from "@/lib/adminAuthDb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    const isValid = await verifyAdminPassword(password);

    if (isValid) {
      const response = NextResponse.json({ success: true });
      response.cookies.set("admin_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return response;
    }

    return NextResponse.json(
      { success: false, error: "Incorrect password. Please try again." },
      { status: 401 }
    );
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
