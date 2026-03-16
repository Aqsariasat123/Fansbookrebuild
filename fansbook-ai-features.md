# Fansbook AI Features — Project Brief

**Deal locked:** March 2026
**Budget:** €5,000 (fixed price)
**Timeline:** 4–5 weeks
**Client:** Fansbook
**Our company:** Redstone Catalyst

---

## What Was Agreed

Client budget was €5,000. Originally scoped at $8,000 but we agreed to €5,000 because:

- We already built the entire platform — codebase is fully known to us
- All 6 features are API integrations (Onfido, AWS, Stripe, Claude) — no complex custom ML
- Estimated 120–140 hours of actual work at ~€38/hr — profitable rate from Pakistan
- Builds long-term client relationship for future phases + monthly retainer

---

## Payment Structure

- **€2,000 upfront** to begin work
- **€3,000 paid progressively** — client pays per feature as each one is delivered

---

## All 6 Features (Full Scope)

### 1. 🪪 ID & Age Verification — €1,200

**Goal:** Replace self-declaration age popup with real document-based AI verification.

**How it works:**

- User uploads government-issued ID (passport, driving licence, national ID)
- Onfido or Veriff AI validates document in under 3 seconds
- Facial liveness check — selfie matched to ID photo, anti-spoofing included
- Result (Approved / Rejected / Manual Review) sent to backend via webhook
- Admin dashboard shows verification status + manual review queue

**What to build:**

- ID upload flow in user onboarding
- Backend webhook to receive and store verification results (Prisma)
- Admin panel: view, approve, reject flagged verifications
- Verified/Unverified badge on user profiles
- Retry flow if initial attempt fails

**Tech:** Onfido API (or Veriff as alternative), Node.js webhook handler, Prisma, React UI
**Delivery:** Week 1–2
**Client monthly cost:** ~€1.50 per new verified user

---

### 2. 🔞 Content Moderation — €900

**Goal:** Auto-scan every image and video before it goes live on the platform.

**How it works:**

- Creator uploads image or video
- Before storing, backend sends file to AWS Rekognition / Google Vision AI
- AI returns confidence scores: explicit, suggestive, violence, etc.
- Above threshold = auto-blocked; borderline = flagged for human review
- Admin sees moderation queue with AI scores
- Creator notified when content is removed with reason

**What to build:**

- Upload intercept hook (scan before content stored)
- Configurable threshold rules per category
- Admin moderation queue UI
- Creator notification on removal
- Full audit log for compliance
- Appeal system for creators

**Tech:** AWS Rekognition, Google Cloud Vision AI (backup), S3 pre-processing, React admin UI
**Delivery:** Week 1
**Client monthly cost:** ~€1 per 1,000 images (near-zero cost)

---

### 3. 💳 Fraud & Chargeback Prevention — €700

**Goal:** Score every transaction in real time and block suspicious payments before they become disputes.

**How it works:**

- All payments pass through Stripe Radar (already partially in codebase)
- Radar ML model (trained on billions of transactions) scores risk
- High-risk = blocked or 3D Secure challenged
- Custom rules on top: velocity checks, geo-anomalies, new account spending limits
- Admin fraud dashboard: blocked transactions, risk scores, dispute rates
- Dispute alerts when chargebacks are filed

**What to build:**

- Stripe Radar activation + configuration
- Custom rule set (platform-specific)
- Admin fraud dashboard
- Velocity limits
- Chargeback webhook alerts
- Monthly fraud report

**Tech:** Stripe Radar, Stripe Webhooks, custom rule engine, Node.js, React admin
**Delivery:** 3–4 days (Stripe already integrated — mostly config + rules)
**Client monthly cost:** Free (Stripe Radar included) / €0.05 per transaction for premium tier

---

### 4. 💬 Creator Chat & Engagement AI — €1,800

**Goal:** Give creators an AI assistant inside their message inbox for smart replies and message drafting.

**How it works:**

- Creator opens a fan conversation
- AI suggestion bar shows 2–3 smart reply options below message input
- Creator can tap to use, or edit before sending
- AI learns creator's tone/style from their message history over time
- "Polish mode" — creator types rough idea, AI rewrites as full engaging message
- All AI usage optional — creators can ignore suggestions

**What to build:**

- Smart reply bar UI in message composer
- Context-aware reply generation (reads conversation history)
- Tone learning (based on creator's previous messages)
- Polish mode button
- Per-creator enable/disable toggle
- Token usage tracking in admin (monitor API costs)

**Tech:** Claude API (Anthropic) or OpenAI GPT-4o, React message UI, Node.js middleware, Redis context cache
**Delivery:** Week 2–4
**Client monthly cost:** ~€20–60/month shared across features 4, 5, 6

---

### 5. 📈 Creator Upsell Advisor — €1,600

**Goal:** AI advisor on creator dashboard that analyses performance and gives personalised revenue-growth recommendations.

**How it works:**

- System collects: subscriber count, tier pricing, post frequency, engagement rate, earnings history
- Data sent to Claude API with a monetisation-focused prompt
- AI generates 3–5 prioritised, specific recommendations for that creator
- Displayed as a card on creator dashboard, refreshed weekly
- Example outputs: "Your top 12 fans haven't had a new post in 8 days — post today to reduce churn", "80 subscribers on €9.99 — consider adding a €24.99 premium tier"

**What to build:**

- Insights card on creator dashboard
- Data collection pipeline (aggregate creator stats)
- Prompt engineering for monetisation advice
- Weekly BullMQ background job to regenerate insights (BullMQ already in codebase)
- Admin overview of platform-wide insights
- Push notification when new insights available

**Tech:** Claude API, BullMQ (existing), Node.js, React dashboard card, Prisma analytics queries
**Delivery:** Week 3–4
**Client monthly cost:** Included in shared Claude API usage

---

### 6. 🤖 AI Support Chatbot — €1,800

**Goal:** 24/7 automated support chat that resolves 60–80% of tickets without human involvement.

**How it works:**

- Chat widget on all pages for logged-in users (bottom-right corner)
- User asks question; AI searches knowledge base of FAQs, policies, platform guides
- Claude generates helpful plain-language response
- If AI not confident → escalate to human agent with full conversation history
- Admin can add/edit knowledge base articles
- All conversations logged; admin can review and improve AI responses

**What to build:**

- Floating chat widget UI (all pages)
- Knowledge base (structured FAQ + policy articles)
- Claude integration with knowledge base context
- Human escalation flow (route to real agent with history)
- Admin knowledge base editor
- Conversation logs + QA review

**Tech:** Claude API, React chat widget, Node.js WebSocket, knowledge base CMS, admin panel
**Delivery:** Week 3–5
**Client monthly cost:** ~€20–40/month (Claude API)

---

## Total Cost Breakdown

| #   | Feature                       | Delivery      | Cost                       |
| --- | ----------------------------- | ------------- | -------------------------- |
| 1   | ID & Age Verification         | Week 1–2      | €1,200                     |
| 2   | Content Moderation            | Week 1        | €900                       |
| 3   | Fraud & Chargeback Prevention | Week 1        | €700                       |
| 4   | Creator Chat & Engagement AI  | Week 2–4      | €1,800                     |
| 5   | Creator Upsell Advisor        | Week 3–4      | €1,600                     |
| 6   | AI Support Chatbot            | Week 3–5      | €1,800                     |
|     | **Total**                     | **4–5 Weeks** | **€8,000 → agreed €5,000** |

---

## Client Monthly Running Costs (After Launch)

| Service         | Purpose                 | Est. Monthly         |
| --------------- | ----------------------- | -------------------- |
| Onfido / Veriff | ID verification         | ~€1.50/new user      |
| AWS Rekognition | Content moderation      | ~€1 per 1,000 images |
| Stripe Radar    | Fraud prevention        | Free / €0.05/txn     |
| Claude API      | Chat + Upsell + Support | ~€50–100/month       |
| **Total**       |                         | **~€50–150/month**   |

---

## Existing Codebase Advantages

These things already exist in the platform — saves significant dev time:

- **BullMQ** job queue → use for weekly upsell advisor refresh
- **Socket.IO** → use for real-time support chat widget
- **Stripe** already integrated → Radar is mostly config
- **Admin panel** fully built → add moderation queue + fraud dashboard as new pages
- **Notification system** fully built → plug in AI alerts
- **Prisma schema** (54 models) → add verification + moderation fields
- **File upload system** → intercept for content moderation scan

---

## Tech Stack Reference

- **Frontend:** React 19.2 + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** Node.js + Express 4 + TypeScript + Prisma 6.5 + PostgreSQL
- **Queue:** BullMQ + Redis 7
- **Real-time:** Socket.IO v4
- **Auth:** Custom JWT
- **Deployment:** Hetzner (Proxmox), LXC 401, Ubuntu 24.04, PM2, Nginx
- **Project path on server:** `/opt/fansbook/`

---

## Notes

- Proposal PDF sent to client: `Fansbook AI Features Proposal - Redstone Catalyst.pdf`
- Original scoped price was $8,000 — client budget was €5,000 — we agreed
- Do NOT train custom AI from scratch — use existing APIs (Claude, AWS, Onfido, Stripe)
- Custom AI training is a future Phase 2 option only at 100k+ users (~€40,000–80,000+)
- Monthly retainer to be discussed post-delivery
