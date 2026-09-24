import { NextResponse } from "next/server";
import {
  getDepartmentContacts,
  createDepartmentContact,
} from "@/lib/departmentContactsDb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const contacts = await getDepartmentContacts();
    return NextResponse.json({ contacts }, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("GET /api/department-contacts error:", error);
    return NextResponse.json({ error: "Failed to fetch department contacts." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { departmentName, description, landline, mobile, email } = body || {};

    if (!departmentName || typeof departmentName !== "string" || !departmentName.trim()) {
      return NextResponse.json(
        { error: "Department Name is required." },
        { status: 400 }
      );
    }

    const newContact = await createDepartmentContact({
      departmentName: String(departmentName).trim(),
      description: description ? String(description).trim() : "",
      landline: landline ? String(landline).trim() : "",
      mobile: mobile ? String(mobile).trim() : "",
      email: email ? String(email).trim() : "",
    });

    return NextResponse.json({ success: true, contact: newContact }, { status: 201 });
  } catch (error) {
    console.error("POST /api/department-contacts error:", error);
    return NextResponse.json(
      { error: "Failed to create department contact." },
      { status: 500 }
    );
  }
}
