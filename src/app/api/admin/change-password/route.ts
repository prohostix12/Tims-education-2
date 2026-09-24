import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateAdminPassword } from "@/lib/adminAuthDb";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");

    if (session?.value !== "authenticated") {
      return NextResponse.json(
        { success: false, error: "Unauthorized access. Please log in first." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: "Please fill in all password fields." },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: "New password and confirm password do not match." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const result = await updateAdminPassword(currentPassword, newPassword);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to update admin password." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Admin password updated successfully in MongoDB.",
    });
  } catch (error) {
    console.error("Change password route error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while updating password." },
      { status: 500 }
    );
  }
}
