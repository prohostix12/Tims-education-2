import { getDb } from "@/lib/mongodb";
import { decryptSecret, type EncryptedData } from "@/lib/cryptoUtils";

export type CRMConfigDoc = {
  type: "crm";
  enabled: boolean;
  endpointUrl: string;
  encryptedApiKey?: EncryptedData;
  updatedAt?: Date;
  createdAt?: Date;
};

export type CRMConfig = {
  enabled: boolean;
  endpointUrl: string;
  apiKey: string;
  hasApiKey: boolean;
  updatedAt?: Date;
};

export type TIMSEnquiryData = {
  id?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  company?: string;
  enquiry: string;
  source?: string;
  createdAt?: Date | string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
};

export type CRMResponse = {
  success: boolean;
  leadId?: string;
  error?: string;
  skipped?: boolean;
  status?: number;
};

const DEFAULT_ENDPOINT = "https://pypecrm.com/api/v1/leads";

/**
 * Validates the CRM endpoint URL to prevent SSRF vulnerabilities.
 */
export function isValidCrmEndpointUrl(urlStr: string): { valid: boolean; reason?: string } {
  if (!urlStr || typeof urlStr !== "string") {
    return { valid: false, reason: "Endpoint URL is required." };
  }

  let parsed: URL;
  try {
    parsed = new URL(urlStr.trim());
  } catch {
    return { valid: false, reason: "Invalid URL format." };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { valid: false, reason: "Endpoint URL must use HTTP or HTTPS protocol." };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Block localhost, loopback, internal IP targets in production or strictly
  const blockedHosts = ["localhost", "127.0.0.1", "0.0.0.0", "::1", "169.254.169.254"];
  if (blockedHosts.includes(hostname)) {
    return { valid: false, reason: "Internal or localhost endpoints are not permitted." };
  }

  // Block private IPv4 ranges (10.x.x.x, 192.168.x.x, 172.16.x.x-172.31.x.x)
  const ipMatch = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipMatch) {
    const p1 = parseInt(ipMatch[1], 10);
    const p2 = parseInt(ipMatch[2], 10);
    if (p1 === 10 || (p1 === 192 && p2 === 168) || (p1 === 172 && p2 >= 16 && p2 <= 31)) {
      return { valid: false, reason: "Private network IP addresses are not permitted." };
    }
  }

  return { valid: true };
}

let cachedCRMConfig: CRMConfig | null = null;

/**
 * Retrieves the CRM configuration from the database securely.
 * Caches the last valid active config in memory to prevent accidental disconnections during transient database delays.
 */
export async function getCRMConfig(): Promise<CRMConfig> {
  try {
    const db = await getDb();
    if (db) {
      const doc = await db.collection<CRMConfigDoc>("integrations").findOne({ type: "crm" });
      if (doc) {
        let rawApiKey = "";
        if (doc.encryptedApiKey) {
          rawApiKey = decryptSecret(doc.encryptedApiKey);
        }

        cachedCRMConfig = {
          enabled: Boolean(rawApiKey),
          endpointUrl: doc.endpointUrl?.trim() || DEFAULT_ENDPOINT,
          apiKey: rawApiKey,
          hasApiKey: Boolean(rawApiKey),
          updatedAt: doc.updatedAt,
        };

        return cachedCRMConfig;
      }
    }
  } catch (error) {
    console.error("Failed to load CRM config from database:", error);
  }

  // Fallback to memory cache if DB is transiently unreachable, ensuring active connection remains connected
  if (cachedCRMConfig) {
    return cachedCRMConfig;
  }

  return {
    enabled: false,
    endpointUrl: DEFAULT_ENDPOINT,
    apiKey: "",
    hasApiKey: false,
  };
}

/**
 * Maps TIMS enquiry fields to the standard PypeCRM lead payload structure.
 */
export function mapLeadPayload(enquiry: TIMSEnquiryData) {
  const firstName = (enquiry.firstName || "").trim();
  const lastName = (enquiry.lastName || "").trim();
  const fullName = `${firstName} ${lastName}`.trim() || firstName || lastName;

  return {
    firstName: firstName,
    lastName: lastName,
    name: fullName,
    email: enquiry.email ? enquiry.email.trim() : "",
    phone: enquiry.phoneNumber ? enquiry.phoneNumber.trim() : "",
    company: enquiry.company ? enquiry.company.trim() : "",
    message: enquiry.enquiry ? enquiry.enquiry.trim() : "",
    notes: enquiry.enquiry ? enquiry.enquiry.trim() : "",
    source: "Website",
    submittedAt: enquiry.createdAt
      ? new Date(enquiry.createdAt).toISOString()
      : new Date().toISOString(),
    ...(enquiry.id ? { external_id: enquiry.id } : {}),
    ...(enquiry.utm_source ? { utm_source: enquiry.utm_source } : {}),
    ...(enquiry.utm_medium ? { utm_medium: enquiry.utm_medium } : {}),
    ...(enquiry.utm_campaign ? { utm_campaign: enquiry.utm_campaign } : {}),
    ...(enquiry.utm_term ? { utm_term: enquiry.utm_term } : {}),
    ...(enquiry.utm_content ? { utm_content: enquiry.utm_content } : {}),
  };
}

/**
 * Sends a lead payload to the PypeCRM API server-to-server.
 */
export async function createLead(
  enquiry: TIMSEnquiryData,
  configOverride?: CRMConfig
): Promise<CRMResponse> {
  const config = configOverride || (await getCRMConfig());

  if (!config.apiKey) {
    return { success: false, skipped: true, error: "CRM API key is missing or not configured." };
  }

  const ssrfCheck = isValidCrmEndpointUrl(config.endpointUrl);
  if (!ssrfCheck.valid) {
    console.error("SSRF validation blocked CRM endpoint:", ssrfCheck.reason);
    return { success: false, error: ssrfCheck.reason || "Invalid CRM endpoint URL." };
  }

  const payload = mapLeadPayload(enquiry);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

  try {
    const response = await fetch(config.endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": config.apiKey,
        "X-API-Key": config.apiKey,
        "Authorization": `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const responseText = await response.text();
    let responseData: Record<string, unknown> = {};
    try {
      responseData = JSON.parse(responseText);
    } catch {
      // Malformed or non-JSON response
    }

    if (response.ok) {
      // Extract lead ID if returned in standard response structures
      const leadId =
        (typeof responseData.id === "string" && responseData.id) ||
        (typeof responseData.lead_id === "string" && responseData.lead_id) ||
        (typeof responseData.leadId === "string" && responseData.leadId) ||
        (typeof (responseData.data as Record<string, unknown>)?.id === "string" &&
          ((responseData.data as Record<string, unknown>).id as string)) ||
        undefined;

      return {
        success: true,
        leadId: leadId || undefined,
        status: response.status,
      };
    }

    // Log sanitized error server-side
    console.error(`PypeCRM submission failed (status ${response.status}) for enquiry ${enquiry.id || "new"}`);

    return {
      success: false,
      status: response.status,
      error: `PypeCRM error (${response.status}): ${
        (responseData.message as string) || (responseData.error as string) || response.statusText || "Request failed"
      }`,
    };
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      console.error("PypeCRM request timed out after 6000ms");
      return { success: false, error: "Request to PypeCRM timed out." };
    }

    const errMessage = error instanceof Error ? error.message : "Network failure while connecting to PypeCRM";
    console.error("PypeCRM connection error:", errMessage);

    return {
      success: false,
      error: errMessage,
    };
  }
}

/**
 * Tests connection to PypeCRM endpoint without creating unwanted leads.
 */
export async function testConnection(testParams: {
  endpointUrl: string;
  apiKey?: string;
}): Promise<{ success: boolean; message: string }> {
  const ssrfCheck = isValidCrmEndpointUrl(testParams.endpointUrl);
  if (!ssrfCheck.valid) {
    return { success: false, message: ssrfCheck.reason || "Invalid CRM endpoint URL." };
  }

  let apiKeyToUse = testParams.apiKey ? testParams.apiKey.trim() : "";
  if (!apiKeyToUse || apiKeyToUse.includes("••••")) {
    const savedConfig = await getCRMConfig();
    apiKeyToUse = savedConfig.apiKey;
  }

  if (!apiKeyToUse) {
    return { success: false, message: "CRM API Key is required to test the connection." };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(testParams.endpointUrl, {
      method: "OPTIONS",
      headers: {
        "Authorization": `Bearer ${apiKeyToUse}`,
        "X-API-Key": apiKeyToUse,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok || response.status === 204 || response.status === 405 || response.status === 400 || response.status === 422) {
      return { success: true, message: "CRM connection successful." };
    }

    if (response.status === 401 || response.status === 403) {
      return { success: false, message: "CRM connection failed: Invalid API key or unauthorized access (401/403)." };
    }

    if (response.status === 404) {
      return { success: false, message: "CRM connection failed: Endpoint URL not found (404)." };
    }

    return {
      success: false,
      message: `CRM connection failed with HTTP status ${response.status}.`,
    };
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      return { success: false, message: "CRM connection failed: Endpoint request timed out." };
    }

    const errMessage = error instanceof Error ? error.message : "CRM endpoint unreachable.";
    return { success: false, message: `CRM connection failed: ${errMessage}` };
  }
}
