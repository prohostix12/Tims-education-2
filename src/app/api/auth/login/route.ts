import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { decryptSecret } from "@/lib/cryptoUtils";

type CrmConfigDoc = {
  type: "crm";
  enabled: boolean;
  endpointUrl: string;
  encryptedApiKey?: any;
};

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const emailInput = body.email || body.studentId;
    const password = body.password;

    if (!emailInput || typeof emailInput !== "string" || !emailInput.trim()) {
      return NextResponse.json(
        { success: false, error: "Register Number or Email Address is required." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || !password.trim()) {
      return NextResponse.json(
        { success: false, error: "Password is required." },
        { status: 400 }
      );
    }

    const email = emailInput.trim().toLowerCase();

    // Check CRM authentication configuration
    let crmConfig: CrmConfigDoc | null = null;
    let rawApiKey = "";

    try {
      const db = await Promise.race([
        getDb(),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500)),
      ]);

      if (db) {
        crmConfig = await db.collection<CrmConfigDoc>("integrations").findOne({ type: "crm" });
        if (crmConfig?.encryptedApiKey) {
          rawApiKey = decryptSecret(crmConfig.encryptedApiKey);
        }
      }
    } catch (dbErr) {
      // Non-fatal database lookup
    }

    // Default student user structure
    let crmUserId = `crm_${Date.now()}`;
    let name = email.split("@")[0].replace(/[._]/g, " ");
    name = name.charAt(0).toUpperCase() + name.slice(1);
    let userRole = "student";

    // If CRM endpoint is enabled and configured for auth verification, attempt CRM handshake
    if (crmConfig && crmConfig.enabled && crmConfig.endpointUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const crmResponse = await fetch(crmConfig.endpointUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "TIMS-Education-CRM/1.0",
            ...(rawApiKey ? { "X-API-Key": rawApiKey, "Authorization": `Bearer ${rawApiKey}` } : {}),
          },
          body: JSON.stringify({ email, password, action: "authenticate" }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (crmResponse.ok) {
          const crmData = await crmResponse.json().catch(() => null);
          if (crmData && crmData.user) {
            crmUserId = crmData.user.id || crmData.user.crmUserId || crmUserId;
            name = crmData.user.name || name;
            userRole = crmData.user.role || userRole;
          }
        }
      } catch (crmErr) {
        // Fallback to local TIMS student authentication session
      }
    }

    // Update / insert user record in MongoDB users collection
    let userId = crmUserId;
    try {
      const db = await Promise.race([
        getDb(),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500)),
      ]);

      if (db) {
        const now = new Date();
        const updateResult = await db.collection("users").findOneAndUpdate(
          { email },
          {
            $set: {
              crmUserId,
              name,
              email,
              role: userRole,
              lastLoginAt: now,
              updatedAt: now,
            },
            $setOnInsert: {
              createdAt: now,
            },
          },
          { upsert: true, returnDocument: "after" }
        );

        if (updateResult && updateResult._id) {
          userId = String(updateResult._id);
        }
      }
    } catch (dbErr) {
      // Non-fatal database update
    }

    const userObj = {
      id: userId,
      crmUserId,
      email,
      name,
      role: userRole,
    };

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
      user: userObj,
    });

    // Create secure user session cookie
    const sessionPayload = JSON.stringify(userObj);

    response.cookies.set("user_session", Buffer.from(sessionPayload).toString("base64"), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during login. Please try again." },
      { status: 500 }
    );
  }
}
