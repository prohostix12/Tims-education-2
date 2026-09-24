import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

type ErmConfigDoc = {
  type: "erm";
  enabled: boolean;
  apiUrl: string;
  dashboardUrl: string;
  apiKey: string;
  updatedAt?: Date;
  createdAt?: Date;
};

export async function GET() {
  try {
    const db = await getDb();
    let config: ErmConfigDoc | null = null;

    if (db) {
      const doc = await db.collection<ErmConfigDoc>("integrations").findOne({ type: "erm" });
      if (doc) {
        config = doc;
      }
    }

    const defaultApiUrl =
      process.env.NEXT_PUBLIC_ERM_API_URL ||
      process.env.ERM_API_URL ||
      "https://pypeerm.com/api/v1/auth/external/student-login";
    const defaultDashboardUrl =
      process.env.NEXT_PUBLIC_ERM_DASHBOARD_URL ||
      process.env.NEXT_PUBLIC_ERM_CLIENT_URL ||
      "https://pypeerm.com";
    const defaultApiKey = process.env.EXTERNAL_API_KEY || "";

    return NextResponse.json({
      success: true,
      config: {
        enabled: true,
        apiUrl: config?.apiUrl || defaultApiUrl,
        dashboardUrl: config?.dashboardUrl || defaultDashboardUrl,
        apiKey: config?.apiKey || defaultApiKey,
        updatedAt: config?.updatedAt,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/integrations/erm error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load PypeERM integration config." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { apiUrl, dashboardUrl, apiKey } = body;

    const defaultApiUrl =
      process.env.NEXT_PUBLIC_ERM_API_URL ||
      process.env.ERM_API_URL ||
      "https://pypeerm.com/api/v1/auth/external/student-login";
    const defaultDashboardUrl =
      process.env.NEXT_PUBLIC_ERM_DASHBOARD_URL ||
      process.env.NEXT_PUBLIC_ERM_CLIENT_URL ||
      "https://pypeerm.com";
    const defaultApiKey = process.env.EXTERNAL_API_KEY || "";

    const finalApiUrl = typeof apiUrl === "string" && apiUrl.trim() ? apiUrl.trim() : defaultApiUrl;
    const finalDashboardUrl = typeof dashboardUrl === "string" && dashboardUrl.trim() ? dashboardUrl.trim() : defaultDashboardUrl;
    const finalApiKey = typeof apiKey === "string" ? apiKey.trim() : defaultApiKey;

    const now = new Date();
    const db = await getDb();

    if (db) {
      await db.collection("integrations").updateOne(
        { type: "erm" },
        {
          $set: {
            type: "erm",
            enabled: true,
            apiUrl: finalApiUrl,
            dashboardUrl: finalDashboardUrl,
            apiKey: finalApiKey,
            updatedAt: now,
          },
          $setOnInsert: {
            createdAt: now,
          },
        },
        { upsert: true }
      );
    }

    return NextResponse.json({
      success: true,
      message: "PypeERM integration settings saved successfully.",
      config: {
        enabled: true,
        apiUrl: finalApiUrl,
        dashboardUrl: finalDashboardUrl,
        apiKey: finalApiKey,
        updatedAt: now,
      },
    });
  } catch (error) {
    console.error("POST /api/admin/integrations/erm error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save PypeERM configuration." },
      { status: 500 }
    );
  }
}
