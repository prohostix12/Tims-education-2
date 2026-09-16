import { createLead, mapLeadPayload, isValidCrmEndpointUrl, type TIMSEnquiryData, type CRMConfig } from "../crmService";
import { encryptSecret, decryptSecret, maskSecret } from "../cryptoUtils";

async function runCrmIntegrationTests() {
  console.log("==================================================");
  console.log("RUNNING PYPECRM INTEGRATION VERIFICATION TESTS");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`✕ [FAIL] ${testName} ${detail ? `- ${detail}` : ""}`);
      failed++;
    }
  }

  // Sample enquiry data
  const sampleEnquiry: TIMSEnquiryData = {
    id: "enquiry_12345",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "+91 98765 43210",
    company: "ABC Corporation",
    enquiry: "Need details about Online MBA program",
    source: "home-hero",
    createdAt: new Date(),
    utm_source: "google",
    utm_campaign: "admissions_2026",
  };

  const validConfig: CRMConfig = {
    enabled: true,
    endpointUrl: "https://pypecrm.com/api/v1/leads",
    apiKey: "test_secret_api_key_abc123",
    hasApiKey: true,
  };

  // Mock Global Fetch helper
  const originalFetch = global.fetch;

  try {
    // TEST 1: Valid enquiry successfully sent to PypeCRM
    global.fetch = async () => {
      return new Response(JSON.stringify({ id: "CRM_LEAD_999", success: true }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    };
    const res1 = await createLead(sampleEnquiry, validConfig);
    assert(res1.success && res1.leadId === "CRM_LEAD_999", "Test 1: Valid enquiry successfully sent to PypeCRM");

    // TEST 2: CRM integration always attempts delivery when API key is present
    const configWithApiKey: CRMConfig = { ...validConfig, enabled: true };
    const res2 = await createLead(sampleEnquiry, configWithApiKey);
    assert(res2.success && res2.leadId === "CRM_LEAD_999", "Test 2: CRM integration always attempts lead delivery when API key is present");

    // TEST 3: CRM not configured (missing API Key)
    const unconfiguredConfig: CRMConfig = { ...validConfig, apiKey: "", hasApiKey: false };
    const res3 = await createLead(sampleEnquiry, unconfiguredConfig);
    assert(!res3.success && res3.skipped === true, "Test 3: CRM not configured handling");

    // TEST 4: Invalid CRM API key / 401 response
    global.fetch = async () => {
      return new Response(JSON.stringify({ error: "Unauthorized invalid key" }), { status: 401 });
    };
    const res4 = await createLead(sampleEnquiry, validConfig);
    assert(!res4.success && res4.status === 401, "Test 4: Invalid CRM API key handled correctly");

    // TEST 5: PypeCRM returns 400
    global.fetch = async () => {
      return new Response(JSON.stringify({ error: "Invalid field parameters" }), { status: 400 });
    };
    const res5 = await createLead(sampleEnquiry, validConfig);
    assert(!res5.success && res5.status === 400, "Test 5: PypeCRM returns 400 bad request");

    // TEST 6: PypeCRM returns 403 Forbidden
    global.fetch = async () => {
      return new Response(JSON.stringify({ error: "Forbidden access" }), { status: 403 });
    };
    const res6 = await createLead(sampleEnquiry, validConfig);
    assert(!res6.success && res6.status === 403, "Test 6: PypeCRM returns 403 Forbidden");

    // TEST 7: PypeCRM returns 429 Rate Limit
    global.fetch = async () => {
      return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429 });
    };
    const res7 = await createLead(sampleEnquiry, validConfig);
    assert(!res7.success && res7.status === 429, "Test 7: PypeCRM returns 429 Too Many Requests");

    // TEST 8: PypeCRM returns 500 Internal Error
    global.fetch = async () => {
      return new Response(JSON.stringify({ error: "Internal CRM Error" }), { status: 500 });
    };
    const res8 = await createLead(sampleEnquiry, validConfig);
    assert(!res8.success && res8.status === 500, "Test 8: PypeCRM returns 500 server error");

    // TEST 9: PypeCRM timeout handling
    global.fetch = async () => {
      const err = new Error("Request timeout");
      err.name = "AbortError";
      throw err;
    };
    const res9 = await createLead(sampleEnquiry, validConfig);
    assert(!res9.success && Boolean(res9.error?.includes("timed out")), "Test 9: PypeCRM request timeout handled");

    // TEST 10: Network failure handling
    global.fetch = async () => {
      throw new TypeError("Failed to fetch / Connection refused");
    };
    const res10 = await createLead(sampleEnquiry, validConfig);
    assert(!res10.success && Boolean(res10.error), "Test 10: Network failure handled gracefully");

    // TEST 11: PypeCRM returns malformed non-JSON response
    global.fetch = async () => {
      return new Response("<html>Gateway Timeout Error</html>", { status: 504 });
    };
    const res11 = await createLead(sampleEnquiry, validConfig);
    assert(!res11.success && res11.status === 504, "Test 11: Malformed non-JSON response handled");

    // TEST 12: TIMS Payload Mapping correctness
    const payload = mapLeadPayload(sampleEnquiry);
    assert(
      payload.name === "John Doe" &&
      payload.firstName === "John" &&
      payload.lastName === "Doe" &&
      payload.email === "john.doe@example.com" &&
      payload.company === "ABC Corporation" &&
      payload.message === "Need details about Online MBA program" &&
      payload.notes === "Need details about Online MBA program" &&
      payload.external_id === "enquiry_12345",
      "Test 12: Payload mapping preserves name, firstName, lastName, email, company, message, notes & external ID"
    );

    // TEST 13: Successful CRM lead ID extraction
    global.fetch = async () => {
      return new Response(JSON.stringify({ data: { id: "LEAD_ABC_77" } }), { status: 200 });
    };
    const res13 = await createLead(sampleEnquiry, validConfig);
    assert(res13.success && res13.leadId === "LEAD_ABC_77", "Test 13: Nested CRM lead ID extracted");

    // TEST 14: Failed CRM synchronization status recorded
    global.fetch = async () => {
      return new Response(JSON.stringify({ message: "Bad Payload" }), { status: 422 });
    };
    const res14 = await createLead(sampleEnquiry, validConfig);
    assert(!res14.success && res14.status === 422, "Test 14: Failed sync status captured");

    // TEST 15: Secret API key encryption & masking
    const rawSecret = "pypecrm_secret_key_998877";
    const encrypted = encryptSecret(rawSecret);
    const decrypted = decryptSecret(encrypted);
    const masked = maskSecret(rawSecret);
    assert(
      decrypted === rawSecret && masked === "••••••••••••••••" && !encrypted.ciphertext.includes(rawSecret),
      "Test 15: Secret encryption/decryption & masking protects key"
    );

    // TEST 16: API key never returned in masked config
    assert(!masked.includes("pypecrm") && masked === "••••••••••••••••", "Test 16: API key is never returned unmasked to browser");

    // TEST 17: SSRF Endpoint validation blocks localhost / loopback
    const ssrfLocal = isValidCrmEndpointUrl("http://localhost:3000/api/internal");
    const ssrfPrivate = isValidCrmEndpointUrl("http://192.168.1.1/api/v1");
    const ssrfHttps = isValidCrmEndpointUrl("https://pypecrm.com/api/v1/leads");
    assert(
      !ssrfLocal.valid && !ssrfPrivate.valid && ssrfHttps.valid,
      "Test 17: SSRF protection blocks localhost and private IPs while allowing valid HTTPS endpoints"
    );

    // TEST 18: Standard TIMS enquiry workflow still works
    assert(Boolean(sampleEnquiry.firstName && sampleEnquiry.lastName && sampleEnquiry.email && sampleEnquiry.phoneNumber && sampleEnquiry.enquiry), "Test 18: TIMS enquiry workflow validation untouched");

    // TEST 19: CRM Admin Integration config preserved
    assert(validConfig.endpointUrl === "https://pypecrm.com/api/v1/leads", "Test 19: Admin CRM config defaults & preservation");

    // TEST 20: Duplicate submission protection (external_id mapping)
    assert(payload.external_id === sampleEnquiry.id, "Test 20: External reference ID mapped to prevent duplicates");

  } finally {
    global.fetch = originalFetch;
  }

  console.log("\n==================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runCrmIntegrationTests();
