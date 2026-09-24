import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

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

    const rawCredential = emailInput.trim();
    const email = rawCredential.toLowerCase();

    // Default ERM System Integration Configuration from .env.local
    let ermApiUrl =
      process.env.NEXT_PUBLIC_ERM_API_URL ||
      process.env.ERM_API_URL ||
      "https://pypeerm.com/api/v1/auth/external/student-login";
    let ermDashboardUrl =
      process.env.NEXT_PUBLIC_ERM_DASHBOARD_URL ||
      process.env.NEXT_PUBLIC_ERM_CLIENT_URL ||
      "https://pypeerm.com"
    let externalApiKey = process.env.EXTERNAL_API_KEY || "";

    // Fetch dynamic PypeERM configuration from database integrations collection
    try {
      const db = await Promise.race([
        getDb(),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 1000)),
      ]);
      if (db) {
        const ermDoc = await db.collection("integrations").findOne({ type: "erm" });
        if (ermDoc) {
          if (ermDoc.apiUrl) ermApiUrl = ermDoc.apiUrl;
          if (ermDoc.dashboardUrl) ermDashboardUrl = ermDoc.dashboardUrl;
          if (ermDoc.apiKey !== undefined) externalApiKey = ermDoc.apiKey;
        }
      }  
    } catch (dbErr) {
      // Non-fatal fallback to environment variables
    }

    let ermUserId = `student_${Date.now()}`;
    let name = rawCredential.includes("@")
      ? rawCredential.split("@")[0].replace(/[._]/g, " ")
      : rawCredential;
    name = name.charAt(0).toUpperCase() + name.slice(1);
    let userRole = "student";
    let isErmVerified = false;

    let token = "";
    let redirectUrl = "";

    // Call PypeERM Student Authentication API
    if (ermApiUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent": "TIMS-Student-Portal/1.0",
        };

        if (externalApiKey) {
          headers["x-api-key"] = externalApiKey;
          headers["Authorization"] = `Bearer ${externalApiKey}`;
        }

        const requestPayload = {
          studentId: rawCredential,
          email: rawCredential,
          username: rawCredential,
          registerNo: rawCredential,
          password,
          apiKey: externalApiKey,
        };

        console.log("\n==========================================");
        console.log("➡️ Outgoing Student Login Request to PypeERM:");
        console.log("   URL:", ermApiUrl);
        console.log("   Headers:", JSON.stringify(headers, null, 2));
        console.log("   Payload:", JSON.stringify(requestPayload, null, 2));

        const ermResponse = await fetch(ermApiUrl, {
          method: "POST",
          headers,
          body: JSON.stringify(requestPayload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const ermData = await ermResponse.json().catch(() => null);

        console.log("⬅️ Response Received from PypeERM:");
        console.log("   HTTP Status Code:", ermResponse.status);
        console.log("   Response Data:", JSON.stringify(ermData, null, 2));
        console.log("==========================================\n");

        if (ermResponse.ok && ermData && (ermData.success || ermData.data || ermData.user || ermData.student)) {
          const studentObj =
            ermData.user ||
            ermData.student ||
            ermData.data?.user ||
            ermData.data?.student ||
            ermData.data ||
            ermData;

          if (studentObj) {
            ermUserId = String(
              studentObj.id ||
                studentObj.studentId ||
                studentObj.enrollmentNo ||
                studentObj._id ||
                studentObj.registerNo ||
                ermUserId
            );
            name = studentObj.name || studentObj.fullName || studentObj.username || name;
            userRole = studentObj.role || userRole;
            isErmVerified = true;
          }

          // Extract JWT token returned by PypeERM externalStudentLogin
          token =
            ermData.token ||
            ermData.data?.token ||
            ermData.accessToken ||
            "";

          // Prioritize redirectUrl/ssoUrl returned directly by PypeERM
          redirectUrl =
            ermData.data?.redirectUrl ||
            ermData.data?.ssoUrl ||
            ermData.redirectUrl ||
            ermData.ssoUrl ||
            "";

          // Fallback to constructing SSO redirect URL if not explicitly returned in response
          if (!redirectUrl && token) {
            redirectUrl = `${ermDashboardUrl.replace(/\/$/, "")}/?sso_token=${token}`;
          }
        } else {
          const errorMessage =
            ermData?.error ||
            ermData?.message ||
            ermData?.msg ||
            "Invalid email/register number or password.";
          return NextResponse.json(
            { success: false, error: errorMessage },
            { status: ermResponse.status || 401 }
          );
        }
      } catch (ermErr) {
        console.error("PypeERM authentication connection failed:", ermErr);
        return NextResponse.json(
          {
            success: false,
            error: "Unable to connect to Student Portal server (PypeERM). Please make sure the ERM backend server is running on port 5579.",
          },
          { status: 503 }
        );
      }
    }

    // Require successful API verification
    if (!isErmVerified) {
      return NextResponse.json(
        { success: false, error: "Invalid email/register number or password." },
        { status: 401 }
      );
    }

    // Update / insert student user record in MongoDB users collection
    let userId = ermUserId;
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
              ermUserId,
              name,
              email,
              role: userRole,
              isErmVerified,
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
      ermUserId,
      email,
      name,
      role: userRole,
      isErmVerified,
    };

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
      user: userObj,
      token,
      redirectUrl,
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
