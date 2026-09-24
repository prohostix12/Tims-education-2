# AI-Powered Chat Assistant Widget - Architecture & Feature Reference

This document outlines the architecture, design, data grounding, backend REST proxy, and frontend floating widget implementation for the TIMS Education AI Assistant.

---

## 1. System Overview

The AI Assistant is a self-contained, site-grounded chat system that provides 24/7 instant answers to visitors regarding:
- **Schooling Options**: 10th (SSLC) and 12th (Plus Two) through NIOS, BOSSE, and Jamia Urdu Aligarh.
- **University Degrees & PG**: Undergraduate (BA, BCom, BSc, BBA, BCA) and Postgraduate (MA, MCom, MSc, MBA, MCA) distance & online programs from UGC-DEB approved universities (AMU, SVSU, SGVU, Mizoram, Guru Kashi, Andhra University, Annamalai, Bharathiyar).
- **Technical & Professional**: B.Tech & M.Tech for working technicians, Diploma programs, Skill courses, and Apprenticeship training.
- **Special Services**: Credit Transfer / One-Year Degree Restart for failed or discontinued students, Certificate Attestation (HRD, MEA, Embassy), and Tutor Mark Assignment (TMA) assistance.
- **Office Locations & Contact Info**: Head Office in Tirur and Edapal Office in Malappuram, Kerala.

---

## 2. Component Architecture

```
                               ┌────────────────────────────────┐
                               │       Site Visitor UI          │
                               │  <ChatWidget /> (Floating)     │
                               └───────────────┬────────────────┘
                                               │
                                       POST /api/chat
                                 { message, history }
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │     Next.js Backend Route      │
                               │   src/app/api/chat/route.ts    │
                               ├────────────────────────────────┤
                               │ • Rate Limiting (40 reqs/hr)   │
                               │ • Prompt Construction &        │
                               │   siteKnowledgeBase Injection  │
                               │ • Exponential Backoff Retry    │
                               │ • Graceful Degraded Fallbacks  │
                               └───────────────┬────────────────┘
                                               │
                                    REST API POST (Server-to-Server)
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │         Gemini API             │
                               │  gemini-3.6-flash REST API     │
                               └────────────────────────────────┘
```

---

## 3. Data Grounding Layer

**File**: `src/data/siteKnowledgeBase.ts`

- Typed TypeScript module exporting a structured default object containing:
  - `company`: Background, mission, achievements, and SVSU CDOE Best Admission Partner recognition.
  - `offerings`: Detailed course categories, durations, eligibility, boards/universities, and key features.
  - `specialServices`: Credit transfer rules, certificate attestation types, study material support.
  - `universityPartners`: List of affiliated universities & open schooling boards.
  - `offices`: Complete physical addresses, phone numbers, and emails for Tirur and Edapal centers.
  - `faqs`: Common queries and official answers.
  - `leadership`: Board of directors and academic leadership.

> **Grounding Rule**: The system prompt forces the assistant to answer ONLY from this data structure. It refuses to invent prices, unlisted courses, or generic facts outside the knowledge base.

---

## 4. Backend REST Endpoint

**File**: `src/app/api/chat/route.ts`

### Request Specification
- **Method**: `POST`
- **URL**: `/api/chat`
- **Payload**:
  ```json
  {
    "message": "What courses do you offer for 10th failed students?",
    "history": [
      { "role": "assistant", "text": "Hello! Welcome to TIMS Education..." }
    ]
  }
  ```

### Key Technical Implementations
1. **In-Memory Rate Limiting**: Tracks IP addresses via `x-forwarded-for` header, limiting clients to 40 messages per hour.
2. **Payload Validation**: Rejects empty strings and messages > 2000 characters.
3. **Gemini REST API Call**:
   - Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`
   - Request Body Structure:
     ```json
     {
       "system_instruction": { "parts": [{ "text": "<SYSTEM_PROMPT_WITH_KNOWLEDGE_BASE>" }] },
       "contents": [
         { "role": "user", "parts": [{ "text": "..." }] }
       ],
       "generationConfig": { "temperature": 0.4, "maxOutputTokens": 800 }
     }
     ```
4. **Retry & Backoff Logic**:
   - Up to 3 attempts (`800ms * attempt`) ONLY on HTTP status 429 (Rate Limit) and 503 (Service Unavailable).
5. **Graceful Degraded Fallback**:
   - If `GEMINI_API_KEY` is missing or upstream calls fail, returns a friendly 200 OK message:
     *"I'm having trouble reaching the assistant right now — please try again in a moment, or contact us directly for now."*

---

## 5. Frontend Widget Component

**Files**:
- `src/components/ChatWidget/ChatWidget.tsx`
- `src/components/ChatWidget/ChatWidget.module.css`
- Mounted in `src/components/SiteChrome/SiteChrome.tsx`

### Key UI/UX Features
- **Launcher Button**: Fixed bottom-right circular launcher (58px x 58px) styled in TIMS primary navy (`#142B72`) with a glowing "AI" badge.
- **Card Panel**: Fixed card (360px wide, 520px high, responsive to mobile screens < 440px).
- **Inline Formatter**: Custom lightweight text parser that renders `**bold**` text and bullet items (`- ` or `1. `) without loading external markdown dependencies.
- **Typing Indicator**: Animated 3 bouncing dots shown during API requests.
- **Auto-Scroll**: Automatically scrolls to the newest message upon receipt.
- **Theme Alignment**: Uses TIMS brand palette (`#142B72` primary navy, `#ED1C24` accent red, `#FCFBFA` subtle pattern background, Space Mono font stack).

---

## 6. Environment Configuration

To enable live Gemini AI responses, add the API key to `.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

If the key is omitted, the chat widget continues to function safely by displaying the degraded fallback contact message.
