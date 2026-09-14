import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("user_session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const payloadStr = Buffer.from(sessionCookie, "base64").toString("utf8");
    const user = JSON.parse(payloadStr);

    return NextResponse.json({ authenticated: true, user });
  } catch (error) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }
}
