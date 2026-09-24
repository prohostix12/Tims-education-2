# Implementation Plan - AI-Powered Chat Assistant Widget

Build a self-contained, AI-powered chat assistant widget grounded strictly in TIMS Education site knowledge, following the exact 4-tier architecture (Knowledge Base, Backend REST Endpoint with Gemini API, Floating Frontend Widget, and Design System Integration).

## 1. Architecture Overview

- **Knowledge Base Data Layer**: `src/data/siteKnowledgeBase.ts`
- **Backend API Endpoint**: `src/app/api/chat/route.ts`
- **Frontend Widget Component**: `src/components/ChatWidget/ChatWidget.tsx` & `ChatWidget.module.css`
- **Global Layout Integration**: `src/components/SiteChrome/SiteChrome.tsx`
- **Architecture Reference**: `chat-system-architecture.md`

## 2. Environment Configuration

Set your Gemini API key in `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## 3. Key Components Created
1. `src/data/siteKnowledgeBase.ts`: Grounded knowledge object covering all courses, credit transfers, attestation, office locations, FAQs, and leadership.
2. `src/app/api/chat/route.ts`: API route handling POST requests, IP rate limiting (40 reqs/hr), system prompt instruction, Gemini REST API calls, exponential backoff retries, and graceful fallbacks.
3. `src/components/ChatWidget/ChatWidget.tsx`: Interactive floating widget with auto-scroll, lightweight inline formatting, typing indicator, and responsive layout.
4. `src/components/SiteChrome/SiteChrome.tsx`: Updated to render `<ChatWidget />` across all public pages.
