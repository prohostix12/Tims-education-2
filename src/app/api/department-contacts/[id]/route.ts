import { NextResponse } from "next/server";
import {
  updateDepartmentContact,
  deleteDepartmentContact,
} from "@/lib/departmentContactsDb";

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Contact ID is required." }, { status: 400 });
    }

    const body = await request.json();
    const { departmentName, description, landline, mobile, email, order } = body || {};

    const updated = await updateDepartmentContact(id, {
      departmentName: departmentName !== undefined ? String(departmentName) : undefined,
      description: description !== undefined ? String(description) : undefined,
      landline: landline !== undefined ? String(landline) : undefined,
      mobile: mobile !== undefined ? String(mobile) : undefined,
      email: email !== undefined ? String(email) : undefined,
      order: typeof order === "number" ? order : undefined,
    });

    if (!updated) {
      return NextResponse.json({ error: "Contact not found or not updated." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/department-contacts/[id] error:", error);
    return NextResponse.json({ error: "Failed to update department contact." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Contact ID is required." }, { status: 400 });
    }

    const deleted = await deleteDepartmentContact(id);

    if (!deleted) {
      return NextResponse.json({ error: "Contact not found or already deleted." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/department-contacts/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete department contact." }, { status: 500 });
  }
}
