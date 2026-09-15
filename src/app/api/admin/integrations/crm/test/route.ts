import { NextResponse } from "next/server";
import { testConnection } from "@/lib/crmService";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { endpointUrl, apiKey } = body;

    const result = await testConnection({
      endpointUrl: typeof endpointUrl === "string" ? endpointUrl : "",
      apiKey: typeof apiKey === "string" ? apiKey : undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/admin/integrations/crm/test error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error during connection test." },
      { status: 500 }
    );
  }
}
