import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { encryptSecret, decryptSecret, maskSecret, type EncryptedData } from "@/lib/cryptoUtils";

type CrmConfigDoc = {
  type: "crm";
  enabled: boolean;
  endpointUrl: string;
  encryptedApiKey?: EncryptedData;
  updatedAt?: Date;
  createdAt?: Date;
};

let inMemoryCrmConfig: CrmConfigDoc = {
  type: "crm",
  enabled: false,
  endpointUrl: "https://pypecrm.com/api/v1/leads",
};

export async function GET() {
  try {
    const db = await getDb();
    let config: CrmConfigDoc | null = null;
    let rawApiKey = "";

    if (db) {
      const doc = await db.collection<CrmConfigDoc>("integrations").findOne({ type: "crm" });
      if (doc) {
        config = doc;
        inMemoryCrmConfig = doc;
        if (doc.encryptedApiKey) {
          rawApiKey = decryptSecret(doc.encryptedApiKey);
        }
      }
    }

    if (!config) {
      config = inMemoryCrmConfig;
      if (inMemoryCrmConfig.encryptedApiKey) {
        rawApiKey = decryptSecret(inMemoryCrmConfig.encryptedApiKey);
      }
    }

    return NextResponse.json({
      success: true,
      config: {
        enabled: config.enabled ?? false,
        endpointUrl: config.endpointUrl || "https://pypecrm.com/api/v1/leads",
        hasApiKey: Boolean(rawApiKey),
        apiKeyMasked: rawApiKey ? maskSecret(rawApiKey) : "",
        updatedAt: config.updatedAt,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/integrations/crm error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load CRM integration config." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { endpointUrl, apiKey } = body;

    const finalEndpoint = typeof endpointUrl === "string" && endpointUrl.trim()
      ? endpointUrl.trim()
      : "https://pypecrm.com/api/v1/leads";

    const db = await getDb();
    let existingDoc: CrmConfigDoc | null = null;
    if (db) {
      existingDoc = await db.collection<CrmConfigDoc>("integrations").findOne({ type: "crm" });
    }

    let encryptedApiKey: EncryptedData | undefined =
      existingDoc?.encryptedApiKey || inMemoryCrmConfig.encryptedApiKey;

    if (typeof apiKey === "string" && apiKey.trim() !== "" && !apiKey.includes("••••")) {
      encryptedApiKey = encryptSecret(apiKey.trim());
    }

    const rawApiKey = encryptedApiKey ? decryptSecret(encryptedApiKey) : "";
    const isEnabled = Boolean(rawApiKey);
    const now = new Date();

    inMemoryCrmConfig = {
      type: "crm",
      enabled: isEnabled,
      endpointUrl: finalEndpoint,
      ...(encryptedApiKey ? { encryptedApiKey } : {}),
      updatedAt: now,
      createdAt: existingDoc?.createdAt || inMemoryCrmConfig.createdAt || now,
    };

    if (db) {
      await db.collection("integrations").updateOne(
        { type: "crm" },
        {
          $set: {
            type: "crm",
            enabled: isEnabled,
            endpointUrl: finalEndpoint,
            ...(encryptedApiKey ? { encryptedApiKey } : {}),
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
      message: "CRM integration settings saved successfully.",
      config: {
        enabled: isEnabled,
        endpointUrl: finalEndpoint,
        hasApiKey: Boolean(rawApiKey),
        apiKeyMasked: rawApiKey ? maskSecret(rawApiKey) : "",
        updatedAt: now,
      },
    });
  } catch (error) {
    console.error("POST /api/admin/integrations/crm error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save CRM configuration." },
      { status: 500 }
    );
  }
}
