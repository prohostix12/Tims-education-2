import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { apiUrl, apiKey } = body;

    const targetUrl = typeof apiUrl === "string" && apiUrl.trim() ? apiUrl.trim() : "";
    const key = typeof apiKey === "string" ? apiKey.trim() : "";

    if (!targetUrl) {
      return NextResponse.json({
        success: false,
        message: "API URL is required for testing connection.",
      });
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "TIMS-Admin-Test/1.0",
      };

      if (key) {
        headers["x-api-key"] = key;
        headers["Authorization"] = `Bearer ${key}`;
      }

      // Ping PypeERM API server
      const response = await fetch(targetUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({ action: "ping_test", apiKey: key }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Status 200, 400, 401, or 422 means server is reachable
      if (response.ok || response.status === 400 || response.status === 401 || response.status === 422) {
        return NextResponse.json({
          success: true,
          message: `✓ Connection successful (PypeERM server responded with HTTP status ${response.status}).`,
        });
      }

      return NextResponse.json({
        success: false,
        message: `✕ PypeERM server returned HTTP status ${response.status}.`,
      });
    } catch (netErr: any) {
      return NextResponse.json({
        success: false,
        message: `✕ PypeERM connection failed: ${netErr?.message || "Server unreachable"}`,
      });
    }
  } catch (error) {
    console.error("POST /api/admin/integrations/erm/test error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error during ERM connection test." },
      { status: 500 }
    );
  }
}
