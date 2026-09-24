import { NextResponse } from "next/server";
import siteKnowledgeBase from "@/data/siteKnowledgeBase";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

interface ChatRequestBody {
  message?: string;
  history?: ChatMessage[];
}

// In-memory rate limiting map: ip -> { count, resetTime }
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 40;

const DEGRADED_FALLBACK_REPLY =
  "I'm having trouble reaching the assistant right now — please try again in a moment, or contact us directly for now.";

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count += 1;
  return true;
}

const SYSTEM_INSTRUCTION = `You are the official TIMS Education AI Advisor, representing TIMS Education (Tirur Institute of Management Studies).

CRITICAL GROUNDING RULE:
Ground every answer strictly in the KNOWLEDGE BASE below — do not invent facts, prices, or features that aren't in it. If something isn't covered in the knowledge base, say you're not sure and suggest contacting support directly.

FORMATTING RULES:
- Use plain text, **bold** text, and simple numbered or bulleted lists (using "1. " or "- ") ONLY.
- Do NOT use headers (# or ##), tables, code blocks, or emoji-bullet lines.
- Keep responses concise, friendly, and helpful.

KNOWLEDGE BASE:
${JSON.stringify(siteKnowledgeBase, null, 2)}`;

export async function POST(request: Request) {
  try {
    // Determine user IP for rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          reply:
            "You have reached the maximum number of messages allowed per hour (40 messages/hour). Please try again later or contact our team directly at info@timseducation.com.",
        },
        { status: 429 }
      );
    }

    let body: ChatRequestBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
    }

    const { message, history = [] } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: "Message is too long. Please limit your message to 2000 characters." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Fail immediately if API key is missing, returning degraded response
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not configured in environment variables.");
      return NextResponse.json({ reply: DEGRADED_FALLBACK_REPLY });
    }

    // Format prompt history for Gemini API REST payload
    const formattedContents = [
      ...history
        .filter((item) => item.text && item.text.trim().length > 0)
        .map((item) => ({
          role: item.role === "assistant" ? "model" : "user",
          parts: [{ text: item.text }],
        })),
      {
        role: "user",
        parts: [{ text: message.trim() }],
      },
    ];

    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;

    const payload = {
      system_instruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
      contents: formattedContents,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 800,
      },
    };

    let response: Response | null = null;
    let attempts = 0;
    const maxRetries = 3;

    // Retry loop: up to 3 attempts ONLY on HTTP 429 or 503
    while (attempts < maxRetries) {
      attempts++;
      try {
        response = await fetch(geminiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          break; // Success
        }

        // Only retry on 429 (Rate Limit) or 503 (Service Unavailable)
        if (response.status === 429 || response.status === 503) {
          if (attempts < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, 800 * attempts));
            continue;
          }
        }

        // For any other error status (e.g. 400, 401, 403, 500), stop retrying immediately
        console.error(`Gemini API returned error status: ${response.status}`);
        break;
      } catch (fetchErr) {
        console.error(`Gemini API fetch attempt ${attempts} failed:`, fetchErr);
        if (attempts < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 800 * attempts));
        } else {
          break;
        }
      }
    }

    if (!response || !response.ok) {
      return NextResponse.json({ reply: DEGRADED_FALLBACK_REPLY });
    }

    const data = await response.json();
    const replyText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || DEGRADED_FALLBACK_REPLY;

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error("Chat API endpoint error:", error);
    return NextResponse.json({ reply: DEGRADED_FALLBACK_REPLY });
  }
}
