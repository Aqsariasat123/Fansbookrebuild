# Fansbook AI Features — Full Implementation Plan

**Redstone Catalyst | March 2026 | €5,000 Fixed**

---

## SEQUENCE (DO NOT CHANGE ORDER)

```
Week 1, Days 1–4  → Feature 3: Fraud & Chargeback Prevention
Week 1, Days 3–7  → Feature 2: Content Moderation
Week 1–2, Days 5–11 → Feature 1: ID & Age Verification
Week 2–3, Days 10–18 → Feature 4: Chat AI (Smart Suggestions)
Week 3–4, Days 17–24 → Feature 5: Upsell Advisor
Week 4–5, Days 23–30 → Feature 6: Support Chatbot
```

Start with Feature 3 (fastest, mostly Stripe config). Feature 2 overlaps. Then Feature 1.
Feature 4 must REPLACE the existing auto-bot with suggestion flow.

---

## WHAT ALREADY EXISTS (DO NOT REBUILD)

| Already in codebase                                     | Used by                       |
| ------------------------------------------------------- | ----------------------------- |
| BullMQ + Redis workers in `apps/server/src/jobs/`       | F5 weekly insights job        |
| Socket.IO `emitToUser()` in `utils/notify.ts`           | F6 support chat real-time     |
| Stripe integration in `routes/payment-gateway.ts`       | F3 Radar config               |
| Full admin panel + `AdminRoutes.tsx`                    | F1,2,3,4,5,6 — add new routes |
| Notification system `routes/notifications.ts`           | F1,4,5 alerts                 |
| Email util `utils/email.ts`                             | F2,3 creator alerts           |
| File upload in `routes/posts.ts` + `utils/postMedia.ts` | F2 scan intercept             |
| `CreatorBot` Prisma model                               | F4 reuse, add fields          |
| `services/botService.ts`                                | F4 rewrite completely         |
| `ANTHROPIC_API_KEY` already in `config/env.ts`          | F4,5,6                        |
| `AdminVerification` page already exists                 | F1 reuse/extend               |
| `routes/support.ts` already exists                      | F6 reuse/extend               |
| `routes/admin/admin-reports.ts`                         | F2,3 extend                   |

---

## PACKAGES TO INSTALL (ALL AT ONCE AT START)

```bash
# Backend
cd apps/server
npm install @aws-sdk/client-rekognition @onfido/api stripe @types/stripe

# Frontend
cd apps/web
npm install @onfido/onfido-sdk-ui
```

---

## PRISMA SCHEMA ADDITIONS (all at once, then run one migration)

Add these to `apps/server/prisma/schema.prisma`:

```prisma
// ─── Feature 3: Fraud ────────────────────────────────────

enum FraudOutcome {
  BLOCKED
  CHALLENGED
  ALLOWED
}

model FraudEvent {
  id               String       @id @default(cuid())
  userId           String?
  stripePaymentId  String?
  stripeEventType  String       // e.g. radar.early_fraud_warning.created
  riskScore        Int?         // 0-100
  riskLevel        String?      // normal | elevated | highest
  outcome          FraudOutcome
  reason           String?      // e.g. "velocity_limit"
  amount           Float?
  currency         String?
  metadata         Json?
  createdAt        DateTime     @default(now())

  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([createdAt])
}

// Add to User model:
// fraudEvents FraudEvent[]

// ─── Feature 2: Content Moderation ───────────────────────

enum ModerationStatus {
  PENDING      // just uploaded, scan in progress
  APPROVED     // scan passed or admin approved
  FLAGGED      // above review threshold, human needed
  BLOCKED      // auto-blocked or admin rejected
}

// Add to PostMedia model:
// moderationStatus ModerationStatus @default(PENDING)
// moderationLabels Json?            // raw Rekognition response
// moderationScore  Float?           // highest confidence score found
// moderatedAt      DateTime?        // when scan completed

model ModerationAction {
  id         String           @id @default(cuid())
  mediaId    String
  adminId    String?
  action     ModerationStatus
  reason     String?
  notes      String?
  createdAt  DateTime         @default(now())

  media PostMedia @relation(fields: [mediaId], references: [id], onDelete: Cascade)
  admin User?     @relation(fields: [adminId], references: [id], onDelete: SetNull)

  @@index([mediaId])
}

model ModerationAppeal {
  id         String   @id @default(cuid())
  mediaId    String
  creatorId  String
  reason     String   @db.Text
  status     String   @default("PENDING") // PENDING | APPROVED | REJECTED
  adminId    String?
  adminNote  String?
  createdAt  DateTime @default(now())
  resolvedAt DateTime?

  media    PostMedia @relation(fields: [mediaId], references: [id], onDelete: Cascade)
  creator  User      @relation("CreatorAppeals", fields: [creatorId], references: [id], onDelete: Cascade)
  admin    User?     @relation("AdminAppeals", fields: [adminId], references: [id], onDelete: SetNull)

  @@index([creatorId])
  @@index([status])
}

// Add to PostMedia model:
// moderationActions ModerationAction[]
// moderationAppeals ModerationAppeal[]

// ─── Feature 1: ID Verification ──────────────────────────

enum VerificationStatus {
  UNVERIFIED
  PENDING
  APPROVED
  REJECTED
  MANUAL_REVIEW
}

enum DocumentType {
  PASSPORT
  DRIVING_LICENCE
  NATIONAL_ID
}

model IdentityVerification {
  id                 String             @id @default(cuid())
  userId             String             @unique
  onfidoApplicantId  String?
  onfidoCheckId      String?
  onfidoReportIds    Json?              // array of report IDs
  status             VerificationStatus @default(PENDING)
  documentType       DocumentType?
  submittedAt        DateTime           @default(now())
  reviewedAt         DateTime?
  reviewedByAdminId  String?
  rejectionReason    String?
  retryCount         Int                @default(0)
  rawResult          Json?              // full Onfido webhook payload

  user       User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  reviewedBy User? @relation("VerificationReviewer", fields: [reviewedByAdminId], references: [id], onDelete: SetNull)

  @@index([status])
}

// Add to User model:
// verificationStatus VerificationStatus @default(UNVERIFIED)
// identityVerification IdentityVerification?

// ─── Feature 4: Chat AI ──────────────────────────────────

// Modify CreatorBot model — ADD these fields:
// toneProfile   String?   @db.Text  // auto-learned from message history
// suggestEnabled Boolean  @default(true)
// polishEnabled  Boolean  @default(true)

model AIUsageLog {
  id          String   @id @default(cuid())
  creatorId   String
  feature     String   // suggest_reply | polish | upsell | support
  inputTokens Int      @default(0)
  outputTokens Int     @default(0)
  cost        Float    @default(0) // estimated EUR
  createdAt   DateTime @default(now())

  creator User @relation(fields: [creatorId], references: [id], onDelete: Cascade)

  @@index([creatorId])
  @@index([createdAt])
}

// Add to User model:
// aiUsageLogs AIUsageLog[]

// ─── Feature 5: Upsell Advisor ───────────────────────────

model CreatorInsight {
  id          String   @id @default(cuid())
  creatorId   String   @unique
  insights    Json     // array of { priority, title, detail, impact }
  rawStats    Json?    // the stats sent to Claude (for debugging)
  generatedAt DateTime @default(now())
  expiresAt   DateTime // generatedAt + 7 days

  creator User @relation(fields: [creatorId], references: [id], onDelete: Cascade)
}

// ─── Feature 6: Support Chatbot ──────────────────────────

enum SupportStatus {
  OPEN
  ESCALATED
  RESOLVED
  CLOSED
}

model SupportConversation {
  id           String        @id @default(cuid())
  userId       String
  status       SupportStatus @default(OPEN)
  assignedToId String?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  resolvedAt   DateTime?

  user       User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  assignedTo User?              @relation("SupportAgent", fields: [assignedToId], references: [id], onDelete: SetNull)
  messages   SupportMessage[]

  @@index([userId])
  @@index([status])
}

model SupportMessage {
  id             String   @id @default(cuid())
  conversationId String
  role           String   // user | assistant | agent
  content        String   @db.Text
  isAI           Boolean  @default(false)
  adminRating    Int?     // 1 = good, -1 = bad (for QA)
  createdAt      DateTime @default(now())

  conversation SupportConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)

  @@index([conversationId])
}

model KBCategory {
  id       String      @id @default(cuid())
  name     String
  slug     String      @unique
  order    Int         @default(0)
  articles KBArticle[]
}

model KBArticle {
  id          String     @id @default(cuid())
  categoryId  String
  title       String
  slug        String     @unique
  content     String     @db.Text
  isPublished Boolean    @default(false)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  category KBCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@index([isPublished])
}

// Add to User model:
// supportConversations SupportConversation[]
// assignedSupportConversations SupportConversation[] @relation("SupportAgent")
```

**After adding all schema changes:**

```bash
# Local
npx prisma generate
npx prisma db push

# Production (run on server)
npx prisma db push --skip-generate
```

---

## ENV VARIABLES TO ADD

In `apps/server/src/config/env.ts` add to the Zod schema:

```ts
// Feature 2
AWS_ACCESS_KEY_ID: z.string().optional().default(''),
AWS_SECRET_ACCESS_KEY: z.string().optional().default(''),
AWS_REGION: z.string().optional().default('eu-west-1'),
MODERATION_BLOCK_THRESHOLD: z.coerce.number().optional().default(85),  // %
MODERATION_REVIEW_THRESHOLD: z.coerce.number().optional().default(60), // %

// Feature 1
ONFIDO_API_TOKEN: z.string().optional().default(''),
ONFIDO_WEBHOOK_SECRET: z.string().optional().default(''),

// Feature 3 (Stripe already exists, just add)
STRIPE_RADAR_ENABLED: z.string().optional().default('false'),
STRIPE_WEBHOOK_SECRET: z.string().optional().default(''),
```

In `.env` on production (`/opt/fansbook/apps/server/.env`):

```
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=eu-west-1
MODERATION_BLOCK_THRESHOLD=85
MODERATION_REVIEW_THRESHOLD=60
ONFIDO_API_TOKEN=api_sandbox.xxx
ONFIDO_WEBHOOK_SECRET=xxx
STRIPE_RADAR_ENABLED=true
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

---

---

# FEATURE 3 — FRAUD & CHARGEBACK PREVENTION

**€700 | Days 1–4 | Week 1**

---

## F3 — Step 1: Stripe Radar Configuration (Day 1)

**In Stripe Dashboard (no code needed):**

1. Login → Radar → Rules → Enable Radar
2. Add these rules in order:
   - `Block if :risk_level: = 'highest'`
   - `Request 3DS if :risk_level: = 'elevated'`
   - `Block if :ip_country: != :card_country: and :is_new_account:`
   - `Block if :transaction_count_for_customer_hourly: > 3`
   - `Block if :amount_attempted_daily_on_card: > 20000` (€200 in cents)
3. Test mode: run with test cards listed at stripe.com/docs/radar/testing

---

## F3 — Step 2: Backend Webhook Handler

**File: `apps/server/src/routes/payment-webhooks.ts`** (already exists — add new events)

Find the switch/if block that handles Stripe events. Add handlers for:

```ts
// Add inside existing webhook handler switch:
case 'radar.early_fraud_warning.created': {
  const warning = event.data.object as Stripe.Radar.EarlyFraudWarning;
  await prisma.fraudEvent.create({
    data: {
      stripePaymentId: warning.charge as string,
      stripeEventType: event.type,
      riskLevel: 'highest',
      outcome: 'BLOCKED',
      reason: warning.fraud_type,
      amount: warning.amount / 100,
      currency: warning.currency,
      metadata: warning as unknown as Prisma.InputJsonValue,
    },
  });
  // Find user by charge and notify admin
  await sendAdminFraudAlert('early_fraud_warning', warning);
  break;
}

case 'charge.dispute.created': {
  const dispute = event.data.object as Stripe.Dispute;
  await prisma.fraudEvent.create({
    data: {
      stripePaymentId: dispute.charge as string,
      stripeEventType: event.type,
      outcome: 'BLOCKED',
      reason: dispute.reason,
      amount: dispute.amount / 100,
      currency: dispute.currency,
      metadata: dispute as unknown as Prisma.InputJsonValue,
    },
  });
  await sendAdminFraudAlert('chargeback', dispute);
  break;
}

case 'payment_intent.payment_failed': {
  const pi = event.data.object as Stripe.PaymentIntent;
  if (pi.last_payment_error?.decline_code === 'fraudulent') {
    await prisma.fraudEvent.create({
      data: {
        stripePaymentId: pi.id,
        stripeEventType: event.type,
        outcome: 'BLOCKED',
        reason: pi.last_payment_error.decline_code,
        amount: pi.amount / 100,
        currency: pi.currency,
      },
    });
  }
  break;
}
```

**File: `apps/server/src/services/fraudService.ts`** (new file, ~100 lines)

```ts
import { prisma } from '../config/database.js';
import { sendEmail } from '../utils/email.js';
import { env } from '../config/env.js';

export async function sendAdminFraudAlert(type: string, data: Record<string, unknown>) {
  // Send email to admin
  await sendEmail({
    to: 'admin@fansbook.com',
    subject: `[Fraud Alert] ${type} detected`,
    html: `<p>Type: ${type}</p><pre>${JSON.stringify(data, null, 2)}</pre>`,
  });
}

export async function getFraudStats(from: Date, to: Date) {
  const events = await prisma.fraudEvent.findMany({
    where: { createdAt: { gte: from, lte: to } },
    orderBy: { createdAt: 'desc' },
  });

  const blocked = events.filter((e) => e.outcome === 'BLOCKED').length;
  const disputed = events.filter((e) => e.stripeEventType === 'charge.dispute.created').length;
  const totalAmount = events.reduce((sum, e) => sum + (e.amount ?? 0), 0);

  return { events, blocked, disputed, totalAmount, total: events.length };
}

export async function blockUserInStripe(stripeCustomerId: string) {
  // Add customer to Stripe block list via Radar rules
  // This is done via Stripe API: create a radar value list item
  // stripe.radar.valueLists.createItem({ value_list: 'rlist_xxx', value: stripeCustomerId })
  // In v1: just suspend user in our DB
  await prisma.user.updateMany({
    where: { stripeCustomerId },
    data: { status: 'SUSPENDED' },
  });
}
```

**File: `apps/server/src/routes/admin/admin-fraud.ts`** (new file, ~120 lines)

```ts
import { Router } from 'express';
import { prisma } from '../../config/database.js';
import { getFraudStats } from '../../services/fraudService.js';
import { authenticate } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/requireRole.js';

const router = Router();
router.use(authenticate, requireRole('ADMIN'));

// GET /api/admin/fraud — list fraud events with filters
// Query params: ?from=ISO&to=ISO&outcome=BLOCKED&page=1&limit=20
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 20);
    const from = req.query.from
      ? new Date(req.query.from as string)
      : new Date(Date.now() - 30 * 86400000);
    const to = req.query.to ? new Date(req.query.to as string) : new Date();
    const outcome = req.query.outcome as string | undefined;

    const where = {
      createdAt: { gte: from, lte: to },
      ...(outcome ? { outcome: outcome as 'BLOCKED' | 'CHALLENGED' | 'ALLOWED' } : {}),
    };

    const [events, total] = await Promise.all([
      prisma.fraudEvent.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { user: { select: { id: true, username: true, email: true } } },
      }),
      prisma.fraudEvent.count({ where }),
    ]);

    const stats = await getFraudStats(from, to);
    res.json({ success: true, data: events, stats, total, page, limit });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/fraud/stats — summary stats for dashboard cards
router.get('/stats', async (req, res, next) => {
  try {
    const from = new Date(Date.now() - 30 * 86400000);
    const stats = await getFraudStats(from, new Date());
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/fraud/:id/block-user — suspend user linked to fraud event
router.post('/:id/block-user', async (req, res, next) => {
  try {
    const event = await prisma.fraudEvent.findUnique({ where: { id: req.params.id } });
    if (!event?.userId) throw new Error('No user linked to this event');
    await prisma.user.update({ where: { id: event.userId }, data: { status: 'SUSPENDED' } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
```

**Register in `apps/server/src/routes/admin/index.ts`** (find this file and add):

```ts
import adminFraudRouter from './admin-fraud.js';
// Inside the router:
router.use('/fraud', adminFraudRouter);
```

---

## F3 — Step 3: Admin Fraud Dashboard UI

**File: `apps/web/src/pages/admin/AdminFraud.tsx`** (new, ~190 lines)

Component structure:

- **Stats bar** (4 cards): Total Events | Blocked | Chargebacks | Total Amount at Risk
- **Filters bar**: Date range picker (from/to), Outcome dropdown (All/Blocked/Challenged), Search by payment ID
- **Table** columns: Date | Payment ID | User | Risk Level | Outcome | Amount | Reason | Actions
- **Actions per row**: View in Stripe (link) | Block User button
- **Pagination**: standard page controls

API calls:

- `GET /api/admin/fraud/stats` → stats cards
- `GET /api/admin/fraud?from=&to=&outcome=&page=` → table data
- `POST /api/admin/fraud/:id/block-user` → block action

**Register in `AdminRoutes.tsx`:**

```tsx
const AdminFraud = lazy(() => import('./AdminFraud'));
// Inside routes:
<Route path="/admin/fraud" element={<AdminFraud />} />;
```

**Add to admin sidebar** (find `components/admin/AdminLayout.tsx` or nav config):

- Under "Finance" section: "Fraud Monitor" → `/admin/fraud`

---

## F3 — Step 4: Testing & Deploy

- In Stripe test mode, use card `4000 0000 0000 4954` (triggers fraud warning)
- Use card `4100 0000 0000 0019` (triggers dispute)
- Verify webhook reaches server: `stripe listen --forward-to localhost:4000/api/payments/webhook`
- Check `FraudEvent` records created in DB
- Confirm admin email sent
- Deploy to production, register webhook URL in Stripe Dashboard

---

---

# FEATURE 2 — CONTENT MODERATION

**€900 | Days 3–7 | Week 1 (overlaps with F3)**

---

## F2 — Step 1: AWS Rekognition Setup (Day 3)

**AWS Console:**

1. Create IAM user: `fansbook-rekognition`
2. Attach policy: `AmazonRekognitionReadOnlyAccess` (custom inline for DetectModerationLabels)
3. Generate access keys
4. Region: `eu-west-1` (Ireland — closest to Hetzner Frankfurt)

**Install SDK:** (already listed above in batch install)

---

## F2 — Step 2: Moderation Service

**File: `apps/server/src/services/moderationService.ts`** (new, ~150 lines max — split if needed)

```ts
import { RekognitionClient, DetectModerationLabelsCommand } from '@aws-sdk/client-rekognition';
import fs from 'fs';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

const client = new RekognitionClient({
  region: env.AWS_REGION || 'eu-west-1',
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export interface ModerationResult {
  action: 'APPROVE' | 'FLAG' | 'BLOCK';
  labels: Array<{ name: string; confidence: number; parentName?: string }>;
  maxConfidence: number;
  topLabel?: string;
}

// These categories auto-BLOCK regardless of threshold
const ALWAYS_BLOCK_CATEGORIES = [
  'Explicit Nudity',
  'Violence',
  'Visually Disturbing',
  'Hate Symbols',
];

export async function scanImage(filePath: string): Promise<ModerationResult> {
  const imageBytes = fs.readFileSync(filePath);

  const command = new DetectModerationLabelsCommand({
    Image: { Bytes: imageBytes },
    MinConfidence: 50, // only return labels above 50% confidence
  });

  const response = await client.send(command);
  const labels = (response.ModerationLabels ?? []).map((l) => ({
    name: l.Name ?? '',
    confidence: l.Confidence ?? 0,
    parentName: l.ParentName,
  }));

  if (labels.length === 0) return { action: 'APPROVE', labels: [], maxConfidence: 0 };

  const maxConfidence = Math.max(...labels.map((l) => l.confidence));
  const topLabel = labels.find((l) => l.confidence === maxConfidence);

  // Check always-block categories (parent name check)
  const hasAlwaysBlock = labels.some(
    (l) =>
      ALWAYS_BLOCK_CATEGORIES.includes(l.name) ||
      ALWAYS_BLOCK_CATEGORIES.includes(l.parentName ?? ''),
  );

  if (hasAlwaysBlock && maxConfidence >= env.MODERATION_REVIEW_THRESHOLD) {
    return { action: 'BLOCK', labels, maxConfidence, topLabel: topLabel?.name };
  }

  if (maxConfidence >= env.MODERATION_BLOCK_THRESHOLD) {
    return { action: 'BLOCK', labels, maxConfidence, topLabel: topLabel?.name };
  }

  if (maxConfidence >= env.MODERATION_REVIEW_THRESHOLD) {
    return { action: 'FLAG', labels, maxConfidence, topLabel: topLabel?.name };
  }

  return { action: 'APPROVE', labels, maxConfidence, topLabel: topLabel?.name };
}

// For video: scan a frame (extract first frame via sharp or ffmpeg)
// V1 simplification: scan video thumbnail if it exists, otherwise APPROVE
// Full video scanning requires async Rekognition StartContentModeration — add in V2
export async function scanVideoThumbnail(thumbnailPath: string): Promise<ModerationResult> {
  if (!fs.existsSync(thumbnailPath)) return { action: 'APPROVE', labels: [], maxConfidence: 0 };
  return scanImage(thumbnailPath);
}
```

**File: `apps/server/src/services/moderationService-helpers.ts`** (if above exceeds 200 lines, extract here)

---

## F2 — Step 3: Upload Intercept

**Modify `apps/server/src/utils/postMedia.ts`:**

Current code does: watermark → create DB record.
New code does: watermark → scan → check result → conditionally create DB record.

```ts
import { prisma } from '../config/database.js';
import { embedWatermark } from './imageProcessing.js';
import { scanImage } from '../services/moderationService.js';
import { sendEmail } from './email.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from './logger.js';

export async function createPostMedia(
  postId: string,
  files: Express.Multer.File[],
  username: string,
  creatorEmail: string, // ADD this param — needed for creator notification
) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const isImage = file.mimetype.startsWith('image/');

    // 1. Watermark images
    if (isImage) {
      try {
        await embedWatermark(file.path, username);
      } catch {
        /* non-blocking */
      }
    }

    // 2. Moderation scan
    let moderationStatus: 'PENDING' | 'APPROVED' | 'FLAGGED' | 'BLOCKED' = 'APPROVED';
    let moderationLabels: unknown = null;
    let moderationScore: number | null = null;

    if (isImage) {
      try {
        const result = await scanImage(file.path);
        moderationLabels = result.labels;
        moderationScore = result.maxConfidence;

        if (result.action === 'BLOCK') {
          // Delete file, notify creator, skip DB insert
          try {
            fs.unlinkSync(file.path);
          } catch {
            /* ignore */
          }
          await sendCreatorBlockedEmail(
            creatorEmail,
            username,
            result.topLabel ?? 'policy violation',
          );
          logger.warn({ postId, label: result.topLabel }, 'Content auto-blocked by moderation');
          throw new AppError(
            400,
            `Content blocked: violates platform policy (${result.topLabel ?? 'explicit content'})`,
          );
        }

        if (result.action === 'FLAG') {
          moderationStatus = 'FLAGGED';
          // Don't block — save as flagged, post hidden until admin reviews
        }

        if (result.action === 'APPROVE') {
          moderationStatus = 'APPROVED';
        }
      } catch (err) {
        if (err instanceof AppError) throw err;
        // Rekognition failure: default to PENDING, admin reviews
        logger.error({ err }, 'Moderation scan failed');
        moderationStatus = 'PENDING';
      }
    }

    // 3. Save to DB
    await prisma.postMedia.create({
      data: {
        postId,
        url: `/api/posts/file/${file.filename}`,
        type: isImage ? 'IMAGE' : 'VIDEO',
        order: i,
        moderationStatus,
        moderationLabels: moderationLabels as Prisma.InputJsonValue,
        moderationScore,
        moderatedAt: new Date(),
      },
    });
  }
}

async function sendCreatorBlockedEmail(email: string, username: string, reason: string) {
  await sendEmail({
    to: email,
    subject: 'Your content was removed — Fansbook',
    html: `
      <p>Hi @${username},</p>
      <p>A file you tried to upload was automatically removed because it violates our content policy.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>If you believe this is a mistake, you can appeal from your creator dashboard.</p>
    `,
  });
}
```

**Also update `apps/server/src/routes/posts.ts`** — pass `creator.email` to `createPostMedia`:

```ts
const creator = await prisma.user.findUnique({
  where: { id: userId },
  select: { username: true, email: true }, // ADD email
});
if (files.length > 0)
  await createPostMedia(post.id, files, creator?.username ?? userId, creator?.email ?? '');
```

**Hide posts with FLAGGED media from public feed:**

In `apps/server/src/routes/feed.ts` — find the main feed query where posts are fetched.
Add to the `where` clause:

```ts
// Exclude posts that have any FLAGGED or BLOCKED media
NOT: {
  media: {
    some: { moderationStatus: { in: ['FLAGGED', 'BLOCKED'] } }
  }
}
```

---

## F2 — Step 4: Admin Moderation Queue

**File: `apps/server/src/routes/admin/admin-moderation.ts`** (new, ~180 lines)

Endpoints:

```
GET  /api/admin/moderation          → list flagged media (FLAGGED/PENDING), with post + creator info
GET  /api/admin/moderation/stats    → counts: flagged, blocked, approved, pending
PATCH /api/admin/moderation/:mediaId/approve  → set status=APPROVED, make post visible
PATCH /api/admin/moderation/:mediaId/block    → set status=BLOCKED, delete file, notify creator
GET  /api/admin/moderation/appeals           → list pending appeals
PATCH /api/admin/moderation/appeals/:id/resolve → approve or reject appeal
```

Each endpoint:

- Requires `authenticate` + `requireRole('ADMIN')`
- On approve: update `moderationStatus = 'APPROVED'`, log `ModerationAction`
- On block: update `moderationStatus = 'BLOCKED'`, log `ModerationAction`, send creator email, optionally delete file
- On appeal approve: restore post, update `ModerationAppeal.status = 'APPROVED'`
- On appeal reject: update `ModerationAppeal.status = 'REJECTED'`, notify creator

**File: `apps/web/src/pages/admin/AdminModeration.tsx`** (new, ~190 lines)

Tabs:

1. **Queue** — media items with `moderationStatus = 'FLAGGED' | 'PENDING'`
   - Each row: blurred thumbnail preview (CSS blur), creator name, post ID, AI labels list with confidence %, date
   - Actions: Approve button (green), Block button (red), View full-size button (opens modal with real image)
2. **Blocked** — history of blocked content
3. **Appeals** — pending appeals from creators
   - Each row: creator, appeal reason, original block reason, date
   - Actions: Reinstate | Confirm Block

**Register in `AdminRoutes.tsx`:**

```tsx
const AdminModeration = lazy(() => import('./AdminModeration'));
<Route path="/admin/moderation" element={<AdminModeration />} />;
```

---

## F2 — Step 5: Creator Appeal Flow

**File: `apps/server/src/routes/creator-moderation.ts`** (new, ~80 lines)

```
POST /api/creator/moderation/appeal  — body: { mediaId, reason }
  - Verify mediaId belongs to requesting creator
  - Check status is BLOCKED
  - Check no existing PENDING appeal for this mediaId
  - Create ModerationAppeal record
  - Notify admin (email or in-app notification)
  - Return 201

GET /api/creator/moderation/appeals  — list creator's own appeals
```

**Frontend (Creator Dashboard):**

- In creator's posts list, blocked posts show a red "Content Removed" badge
- Badge has "Appeal" button → opens modal with textarea for reason → submits to API
- After submit: shows "Appeal submitted, we'll review within 48 hours"

**Register in `app.ts`:**

```ts
import creatorModerationRouter from './routes/creator-moderation.js';
app.use('/api/creator/moderation', creatorModerationRouter);
```

---

## F2 — Step 6: Audit Log & Deploy

- Every `ModerationAction` record IS the audit log — admin can filter by date/action
- Add to Prisma's `@@index`: `[action]`, `[createdAt]`
- After deploy: test with AWS test images (Rekognition has public test images that trigger various labels)
- Verify FLAGGED posts don't appear in feed
- Verify creator gets email when content blocked

---

---

# FEATURE 1 — ID & AGE VERIFICATION

**€1,200 | Days 5–11 | Week 1–2**

---

## F1 — Step 1: Onfido Account Setup (Day 5)

1. Sign up: onfido.com → Developer → Create Application
2. Get `API_TOKEN` (sandbox mode first, live after testing)
3. Create webhook in Onfido dashboard:
   - URL: `https://fansbookrebuild.byredstone.com/api/verification/webhook`
   - Events: `check.completed`
   - Copy webhook secret
4. Add keys to production `.env`

---

## F1 — Step 2: Verification Service Backend

**File: `apps/server/src/services/verificationService.ts`** (new, ~160 lines)

```ts
import { Onfido, Region } from '@onfido/api';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { sendEmail } from '../utils/email.js';
import crypto from 'crypto';

let onfidoClient: Onfido | null = null;
function getClient(): Onfido {
  if (!onfidoClient) {
    onfidoClient = new Onfido({ apiToken: env.ONFIDO_API_TOKEN, region: Region.EU });
  }
  return onfidoClient;
}

export async function createApplicant(
  userId: string,
  firstName: string,
  lastName: string,
  dob: string,
) {
  const client = getClient();
  const applicant = await client.applicant.create({
    firstName,
    lastName,
    dob, // format: YYYY-MM-DD
  });

  await prisma.identityVerification.upsert({
    where: { userId },
    create: { userId, onfidoApplicantId: applicant.id, status: 'PENDING' },
    update: { onfidoApplicantId: applicant.id, status: 'PENDING', retryCount: { increment: 0 } },
  });

  return applicant.id;
}

export async function generateSDKToken(applicantId: string, referrer: string) {
  const client = getClient();
  const token = await client.sdkToken.generate({
    applicantId,
    referrer, // e.g. https://fansbookrebuild.byredstone.com/*
  });
  return token.token;
}

export async function createCheck(applicantId: string, userId: string) {
  const client = getClient();
  const check = await client.check.create({
    applicantId,
    reportNames: ['document', 'facial_similarity_photo'],
  });

  await prisma.identityVerification.update({
    where: { userId },
    data: { onfidoCheckId: check.id, submittedAt: new Date() },
  });

  return check.id;
}

export async function handleOnfidoWebhook(rawBody: Buffer, signature: string, payload: unknown) {
  // Verify webhook signature
  const expected = crypto
    .createHmac('sha256', env.ONFIDO_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');
  if (signature !== `sha256=${expected}`) throw new Error('Invalid webhook signature');

  const event = payload as {
    payload: {
      resource_type: string;
      action: string;
      object: { id: string; status: string; href: string };
    };
  };
  if (event.payload.resource_type !== 'check' || event.payload.action !== 'check.completed') return;

  const checkId = event.payload.object.id;
  const status = event.payload.object.status; // 'complete' | 'in_progress'

  // Fetch full check result
  const client = getClient();
  const check = await client.check.find(checkId);

  const verification = await prisma.identityVerification.findFirst({
    where: { onfidoCheckId: checkId },
    include: { user: { select: { id: true, email: true, username: true } } },
  });
  if (!verification) return;

  let newStatus: 'APPROVED' | 'REJECTED' | 'MANUAL_REVIEW';
  if (check.result === 'clear') newStatus = 'APPROVED';
  else if (check.result === 'consider') newStatus = 'MANUAL_REVIEW';
  else newStatus = 'REJECTED';

  await prisma.identityVerification.update({
    where: { id: verification.id },
    data: {
      status: newStatus,
      reviewedAt: new Date(),
      rawResult: check as unknown as Prisma.InputJsonValue,
    },
  });

  // Update user's verificationStatus field
  await prisma.user.update({
    where: { id: verification.userId },
    data: {
      verificationStatus:
        newStatus === 'APPROVED' ? 'APPROVED' : newStatus === 'REJECTED' ? 'REJECTED' : 'PENDING',
    },
  });

  // Notify user by email
  await sendVerificationResultEmail(verification.user.email, verification.user.username, newStatus);
}

async function sendVerificationResultEmail(email: string, username: string, status: string) {
  const messages: Record<string, string> = {
    APPROVED: 'Your identity has been verified. You now have full access to Fansbook.',
    REJECTED:
      'We were unable to verify your identity. Please try again with a clear photo of your ID.',
    MANUAL_REVIEW:
      'Your verification is being reviewed by our team. We will notify you within 24 hours.',
  };
  await sendEmail({
    to: email,
    subject: 'Fansbook Identity Verification Result',
    html: `<p>Hi @${username},</p><p>${messages[status] ?? 'Verification update.'}</p>`,
  });
}
```

---

## F1 — Step 3: Verification Routes

**File: `apps/server/src/routes/verification.ts`** (new, ~120 lines)

```ts
// POST /api/verification/start
// Body: { firstName, lastName, dob }
// Auth: authenticate (any logged-in user)
// Does: createApplicant → generateSDKToken → return { sdkToken, applicantId }
// Check retryCount < 3, else throw 403 "Max verification attempts reached"

// POST /api/verification/submit
// Body: { applicantId }
// Auth: authenticate
// Does: createCheck → return { checkId, message: "Verification in progress" }

// POST /api/verification/webhook
// NO auth (Onfido calls this directly)
// Headers: X-SHA2-Signature
// Does: verify signature → handleOnfidoWebhook(rawBody, sig, body)
// IMPORTANT: use express.raw() middleware for this route to get raw body for signature verification
```

**Register in `app.ts`:**

```ts
import verificationRouter from './routes/verification.js';
// BEFORE express.json() middleware (need raw body for webhook):
app.use(
  '/api/verification/webhook',
  express.raw({ type: 'application/json' }),
  verificationWebhookHandler,
);
// After express.json():
app.use('/api/verification', verificationRouter);
```

**File: `apps/server/src/routes/admin/admin-verifications.ts`** (new, ~120 lines)

```
GET  /api/admin/verifications          → list all, filter by status, paginated
GET  /api/admin/verifications/stats    → counts per status
GET  /api/admin/verifications/:id      → single verification details + raw Onfido result
PATCH /api/admin/verifications/:id/approve  → set APPROVED, update user.verificationStatus
PATCH /api/admin/verifications/:id/reject   → set REJECTED, body: { reason }, notify user
PATCH /api/admin/verifications/:id/request-resubmit → reset to allow retry, notify user
```

---

## F1 — Step 4: Frontend Verification Flow

**File: `apps/web/src/pages/VerifyIdentity.tsx`** (new, ~190 lines — split if needed)

Step machine with 4 states: `FORM | ONFIDO_SDK | PENDING | RESULT`

```tsx
// State: FORM
// UI: Explanation card — "We need to verify your age to continue"
// Form fields: First Name, Last Name, Date of Birth (date picker)
// Submit → POST /api/verification/start → get sdkToken → go to ONFIDO_SDK state

// State: ONFIDO_SDK
// UI: Mount Onfido Web SDK
import { init } from '@onfido/onfido-sdk-ui';
// init({ token: sdkToken, containerId: 'onfido-mount', steps: ['document', 'face'], onComplete: () => submitCheck() })
// onComplete → POST /api/verification/submit → go to PENDING state

// State: PENDING
// UI: Spinner + "Verifying your identity, usually takes 1–3 minutes"
// Poll GET /api/verification/status every 10 seconds OR wait for WebSocket push notification

// State: RESULT (APPROVED / REJECTED / MANUAL_REVIEW)
// APPROVED: Green checkmark, "You're verified! Redirecting..."  → redirect to /dashboard
// REJECTED: Red X, "Unable to verify. Please try again." + Retry button (if retryCount < 3)
// MANUAL_REVIEW: Clock icon, "Under review, we'll email you within 24 hours"
```

**Verification status API for polling:**

```
GET /api/verification/status  → { status: VerificationStatus, retryCount }
```

**Route:** Add to `App.tsx`:

```tsx
<Route path="/verify-identity" element={<VerifyIdentity />} />
```

**Block unverified users (gating):**
In `apps/server/src/middleware/requireVerified.ts` (new, ~20 lines):

```ts
export function requireVerified(req, res, next) {
  if (req.user?.verificationStatus !== 'APPROVED') {
    return res
      .status(403)
      .json({
        success: false,
        message: 'Identity verification required',
        code: 'VERIFICATION_REQUIRED',
      });
  }
  next();
}
```

Apply to: `POST /api/posts` (creating posts), `POST /api/subscriptions` (subscribing to paid tiers)

**Modify `AgeVerification.tsx`:**

- After user clicks "I'm 18+" (existing consent), check their `verificationStatus` from auth store
- If `UNVERIFIED` and user has been registered > 24 hours → redirect to `/verify-identity`
- New users get 24h grace period before gating kicks in

---

## F1 — Step 5: Admin Verification UI

**File: `apps/web/src/pages/admin/AdminIDVerification.tsx`** (new, ~190 lines)

Note: `AdminVerification.tsx` already exists — check its contents first and either extend it OR create `AdminIDVerification.tsx` as a separate page.

Tabs:

1. **Pending** — verifications with status PENDING or MANUAL_REVIEW (oldest first)
2. **Approved** — searchable list
3. **Rejected** — with rejection reasons

Table columns: User (avatar + username) | Document Type | Submitted At | Status | Onfido Check ID | Actions

Actions: Approve | Reject (modal: enter reason) | Request Resubmit

Stats bar: Total Verified | Pending Queue | Rejection Rate % | New Today

**Register in `AdminRoutes.tsx`:**

```tsx
const AdminIDVerification = lazy(() => import('./AdminIDVerification'));
<Route path="/admin/id-verification" element={<AdminIDVerification />} />;
```

---

---

# FEATURE 4 — CREATOR CHAT & ENGAGEMENT AI (SMART SUGGESTIONS)

**€1,800 | Days 10–18 | Week 2–3**

> CRITICAL: This is NOT auto-send. Creator reviews every suggestion and sends manually.
> The existing `triggerBotReply` auto-bot in `messages.ts` must be REMOVED first.

---

## F4 — Step 1: Remove Auto-Bot (Day 10)

**In `apps/server/src/routes/messages.ts`:**

- Remove the import: `import { triggerBotReply } from '../services/botService.js'`
- Remove the fire-and-forget block that calls `triggerBotReply(...)` after fan message is saved
- The `botService.ts` file stays (will be rewritten)

---

## F4 — Step 2: Rewrite botService.ts for Suggestions

**File: `apps/server/src/services/botService.ts`** (complete rewrite, ~180 lines)

Keep existing functions: `getBotConfig`, `upsertBotConfig`
Remove: `sendBotMessage`, `triggerBotReply`
Add: `generateSuggestions`, `polishMessage`, `logAIUsage`

```ts
import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

// Haiku for real-time suggestions (fast + cheap)
const SUGGEST_MODEL = 'claude-haiku-4-5-20251001';
// Sonnet for polish (better quality)
const POLISH_MODEL = 'claude-sonnet-4-6';

let anthropic: Anthropic | null = null;
function getClient(): Anthropic {
  if (!anthropic) {
    if (!env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not configured');
    anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  }
  return anthropic;
}

export async function getBotConfig(creatorId: string) {
  return prisma.creatorBot.findUnique({ where: { creatorId } });
}

export async function upsertBotConfig(
  creatorId: string,
  data: {
    enabled?: boolean;
    persona?: string;
    greeting?: string;
    suggestEnabled?: boolean;
    polishEnabled?: boolean;
  },
) {
  return prisma.creatorBot.upsert({
    where: { creatorId },
    create: { creatorId, ...data },
    update: { ...data },
  });
}

export async function generateSuggestions(
  creatorId: string,
  conversationId: string,
): Promise<string[]> {
  const bot = await getBotConfig(creatorId);
  if (!bot?.suggestEnabled) return [];

  // Fetch conversation history
  const messages = await prisma.message.findMany({
    where: { conversationId, mediaType: 'TEXT' },
    orderBy: { createdAt: 'desc' },
    take: 15,
    select: { senderId: true, text: true },
  });

  if (messages.length === 0) return [];

  const creator = await prisma.user.findUnique({
    where: { id: creatorId },
    select: { displayName: true, username: true },
  });

  const history = messages.reverse().map((m) => ({
    role: (m.senderId === creatorId ? 'assistant' : 'user') as 'user' | 'assistant',
    content: m.text ?? '',
  }));

  const toneNote = bot.toneProfile ? `\nCreator's communication style: ${bot.toneProfile}` : '';

  const system = `You are helping ${creator?.displayName ?? 'a creator'} (@${creator?.username}) draft replies to fans on Fansbook.${toneNote}
Generate exactly 3 short, natural reply options for the creator to choose from.
Keep each reply under 2 sentences. Be warm, authentic, engaging.
Return ONLY a JSON array of 3 strings, nothing else. Example: ["Reply 1", "Reply 2", "Reply 3"]`;

  try {
    const response = await getClient().messages.create({
      model: SUGGEST_MODEL,
      max_tokens: 200,
      system,
      messages: history,
    });

    const text = response.content[0]?.type === 'text' ? response.content[0].text.trim() : '[]';
    const suggestions = JSON.parse(text) as string[];

    await logAIUsage(
      creatorId,
      'suggest_reply',
      response.usage.input_tokens,
      response.usage.output_tokens,
    );
    return Array.isArray(suggestions) ? suggestions.slice(0, 3) : [];
  } catch (err) {
    logger.error({ err }, 'generateSuggestions failed');
    return [];
  }
}

export async function polishMessage(
  creatorId: string,
  roughText: string,
  conversationId: string,
): Promise<string | null> {
  const bot = await getBotConfig(creatorId);
  if (!bot?.polishEnabled) return null;

  const creator = await prisma.user.findUnique({
    where: { id: creatorId },
    select: { displayName: true, username: true },
  });

  const system = `You are helping ${creator?.displayName ?? 'a creator'} rewrite a rough message into an engaging, professional reply for a fan on Fansbook.
Keep the same meaning and intent. Make it warmer and more engaging. Keep it concise (1-3 sentences).
Return ONLY the polished message text, nothing else.`;

  try {
    const response = await getClient().messages.create({
      model: POLISH_MODEL,
      max_tokens: 300,
      system,
      messages: [
        {
          role: 'user',
          content: `Rough message: "${roughText}"\n\nConversation context from /api/messages/${conversationId}`,
        },
      ],
    });

    const polished = response.content[0]?.type === 'text' ? response.content[0].text.trim() : null;
    if (polished)
      await logAIUsage(
        creatorId,
        'polish',
        response.usage.input_tokens,
        response.usage.output_tokens,
      );
    return polished;
  } catch (err) {
    logger.error({ err }, 'polishMessage failed');
    return null;
  }
}

export async function updateToneProfile(creatorId: string) {
  // Analyze creator's last 50 sent messages to learn tone
  const sentMessages = await prisma.message.findMany({
    where: { senderId: creatorId, mediaType: 'TEXT', text: { not: null } },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: { text: true },
  });

  if (sentMessages.length < 10) return; // not enough data

  const sample = sentMessages.map((m) => m.text).join('\n---\n');
  const system = `Analyze these messages sent by a creator and describe their communication style in 2-3 sentences.
Focus on: tone (formal/casual), emoji usage, message length, warmth level, common phrases.
Be concise. This will be used to help generate consistent replies.`;

  try {
    const response = await getClient().messages.create({
      model: SUGGEST_MODEL,
      max_tokens: 150,
      system,
      messages: [{ role: 'user', content: sample }],
    });

    const profile = response.content[0]?.type === 'text' ? response.content[0].text.trim() : null;
    if (profile) {
      await prisma.creatorBot.upsert({
        where: { creatorId },
        create: { creatorId, toneProfile: profile },
        update: { toneProfile: profile },
      });
    }
  } catch (err) {
    logger.error({ err }, 'updateToneProfile failed');
  }
}

async function logAIUsage(
  creatorId: string,
  feature: string,
  inputTokens: number,
  outputTokens: number,
) {
  const cost = (inputTokens * 0.00025 + outputTokens * 0.00125) / 1000; // Haiku pricing in EUR approx
  await prisma.aIUsageLog.create({ data: { creatorId, feature, inputTokens, outputTokens, cost } });
}
```

---

## F4 — Step 3: Creator AI Routes

**File: `apps/server/src/routes/creator-ai.ts`** (new, ~120 lines)

```
POST /api/creator/ai/suggest
  Auth: authenticate + requireRole('CREATOR')
  Body: { conversationId }
  Rate limit: 20 requests per creator per hour (use existing rateLimit middleware)
  Does: generateSuggestions(userId, conversationId)
  Returns: { suggestions: string[] }
  Error: 429 if rate limited, 400 if bot not enabled

POST /api/creator/ai/polish
  Auth: authenticate + requireRole('CREATOR')
  Body: { text, conversationId }
  Validate: text.length > 0 && text.length < 1000
  Does: polishMessage(userId, text, conversationId)
  Returns: { polished: string }

GET /api/creator/ai/usage
  Auth: authenticate + requireRole('CREATOR')
  Query: ?month=2026-03
  Returns: { totalTokens, totalCost, byFeature: { suggest_reply, polish } }
```

**Register in `app.ts`:**

```ts
import creatorAIRouter from './routes/creator-ai.js';
app.use('/api/creator/ai', creatorAIRouter);
```

---

## F4 — Step 4: Message Composer UI — Smart Replies

**Find the message composer component.** It is likely in `apps/web/src/components/messages/` or similar.
Search: `grep -r "send message" apps/web/src --include="*.tsx" -l`

**New component: `apps/web/src/components/messages/SmartReplyBar.tsx`** (~80 lines)

```tsx
interface SmartReplyBarProps {
  conversationId: string;
  onSelect: (text: string) => void; // fills the composer input
}

// State: idle | loading | showing | error
// When visible (only shown to CREATOR role):
//   Show sparkle ✨ button below message input
//   On click: setLoading → POST /api/creator/ai/suggest → setShowing with 3 pills
//   Each pill: text preview (truncated to 40 chars) + click fills input
//   Dismiss X button to hide bar
//   Error: hide silently (do not show error to user)
```

**Modify the existing message composer** to:

1. Import `SmartReplyBar` and render it below the textarea (only if `user.role === 'CREATOR'`)
2. Import and add Polish button (wand icon 🪄) in the toolbar, only visible to CREATOR
3. Polish button: takes current textarea value → POST /api/creator/ai/polish → show modal "Original vs Polished" → creator picks one

---

## F4 — Step 5: Creator AI Settings Page

**File: `apps/web/src/pages/CreatorAISettings.tsx`** (rename/repurpose existing `CreatorBotSettings.tsx`, ~190 lines)

Settings:

- Toggle: "Enable AI Reply Suggestions" (suggestEnabled)
- Toggle: "Enable Polish Mode" (polishEnabled)
- Textarea: "Custom persona / writing style hints" (persona field, 500 chars max)
- Button: "Refresh Tone Profile" → POST /api/creator/ai/tone-refresh
- Usage card: "This month: X suggestions, Y polishes, ~€Z API cost"

**Register in `apps/web/src/App.tsx`** and add to creator nav:

```tsx
// In creator nav items (navItems.ts or similar):
{ label: 'AI Writing Assistant', href: '/creator/ai-settings', icon: Sparkles }

// In App.tsx routes:
<Route path="/creator/ai-settings" element={<CreatorAISettings />} />
```

**Add tone refresh endpoint:**

```
POST /api/creator/ai/tone-refresh
  Auth: authenticate + requireRole('CREATOR')
  Does: updateToneProfile(userId) (can take a few seconds)
  Returns: { toneProfile: string }
```

---

## F4 — Step 6: Tone Learning BullMQ Job

**File: `apps/server/src/jobs/tone-learning-worker.ts`** (new, ~60 lines)

```ts
// BullMQ worker: queue name 'tone-learning'
// Runs weekly (every Sunday 2am UTC) via cron
// For each active CREATOR with botService enabled:
//   await updateToneProfile(creator.id)
// Max concurrency: 3 (don't flood Claude API)
```

**Register in `apps/server/src/index.ts`** alongside existing workers.

---

## F4 — Step 7: Admin AI Usage Dashboard

**File: `apps/web/src/pages/admin/AdminAIUsage.tsx`** (new, ~150 lines)

Shows:

- Platform totals: total tokens, total cost (EUR) this month
- Per-creator table: username | tokens | cost | features used | last used
- Filter: by month, by feature
- Warning badge if any creator's monthly cost > €5

Backend:

```
GET /api/admin/ai-usage?month=2026-03
  Returns: { totals, byCreator: [...], byFeature: {...} }
```

Add this endpoint to `routes/admin/admin-ai.ts` (new, ~60 lines).

**Register in `AdminRoutes.tsx`:**

```tsx
const AdminAIUsage = lazy(() => import('./AdminAIUsage'));
<Route path="/admin/ai-usage" element={<AdminAIUsage />} />;
```

---

---

# FEATURE 5 — CREATOR UPSELL ADVISOR

**€1,600 | Days 17–24 | Week 3–4**

---

## F5 — Step 1: Stats Collection Service

**File: `apps/server/src/services/insightStatsService.ts`** (new, ~120 lines)

```ts
export interface CreatorStats {
  subscriberCount: number;
  subscribersByTier: Array<{ tierName: string; price: number; count: number }>;
  churnLast30Days: number; // subscriptions cancelled
  newSubscribersLast30Days: number;
  postsLast30Days: number;
  postsLast7Days: number;
  avgLikesPerPost: number;
  avgCommentsPerPost: number;
  engagementRate: number; // (likes+comments) / subscribers * 100
  revenueThisMonth: number;
  revenuePrevMonth: number;
  revenueGrowthPct: number;
  topPerformingPostType: string; // IMAGE | VIDEO | TEXT
  paidMessagesCount: number;
  ppvRevenue: number;
  daysSinceLastPost: number;
  messageResponseRate: number; // % of fan messages creator replied to
}

export async function gatherCreatorStats(creatorId: string): Promise<CreatorStats> {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 86400000);

  // Run all DB queries in parallel
  const [
    subscriberCount,
    churnLast30Days,
    newSubs,
    postsThisMonth,
    postsThisWeek,
    revenueThisMonth,
    revenuePrevMonth,
    lastPost,
    // ... etc
  ] = await Promise.all([
    prisma.subscription.count({ where: { creatorId, status: 'ACTIVE' } }),
    prisma.subscription.count({
      where: { creatorId, status: 'CANCELLED', updatedAt: { gte: thirtyDaysAgo } },
    }),
    prisma.subscription.count({
      where: { creatorId, status: 'ACTIVE', createdAt: { gte: thirtyDaysAgo } },
    }),
    prisma.post.count({
      where: { authorId: creatorId, createdAt: { gte: thirtyDaysAgo }, deletedAt: null },
    }),
    prisma.post.count({
      where: {
        authorId: creatorId,
        createdAt: { gte: new Date(now.getTime() - 7 * 86400000) },
        deletedAt: null,
      },
    }),
    prisma.transaction.aggregate({
      where: {
        userId: creatorId,
        type: { in: ['SUBSCRIPTION', 'TIP_RECEIVED', 'PPV_EARNING'] },
        createdAt: { gte: thirtyDaysAgo },
      },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        userId: creatorId,
        type: { in: ['SUBSCRIPTION', 'TIP_RECEIVED', 'PPV_EARNING'] },
        createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
      },
      _sum: { amount: true },
    }),
    prisma.post.findFirst({
      where: { authorId: creatorId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    }),
  ]);

  const revenueThisMonthAmt = revenueThisMonth._sum.amount ?? 0;
  const revenuePrevMonthAmt = revenuePrevMonth._sum.amount ?? 0;

  return {
    subscriberCount,
    subscribersByTier: [], // TODO: join with tiers
    churnLast30Days,
    newSubscribersLast30Days: newSubs,
    postsLast30Days: postsThisMonth,
    postsLast7Days: postsThisWeek,
    avgLikesPerPost: 0, // TODO: aggregate from PostLike
    avgCommentsPerPost: 0,
    engagementRate: 0,
    revenueThisMonth: revenueThisMonthAmt,
    revenuePrevMonth: revenuePrevMonthAmt,
    revenueGrowthPct:
      revenuePrevMonthAmt > 0
        ? ((revenueThisMonthAmt - revenuePrevMonthAmt) / revenuePrevMonthAmt) * 100
        : 0,
    topPerformingPostType: 'IMAGE',
    paidMessagesCount: 0,
    ppvRevenue: 0,
    daysSinceLastPost: lastPost
      ? Math.floor((now.getTime() - lastPost.createdAt.getTime()) / 86400000)
      : 999,
    messageResponseRate: 0,
  };
}
```

---

## F5 — Step 2: Claude Insights Generator

**File: `apps/server/src/services/insightGeneratorService.ts`** (new, ~100 lines)

```ts
import Anthropic from '@anthropic-ai/sdk';
import { CreatorStats } from './insightStatsService.js';
import { prisma } from '../config/database.js';
import { logAIUsage } from './botService.js'; // reuse

const MODEL = 'claude-sonnet-4-6'; // quality matters for business advice

export interface Insight {
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string; // short, e.g. "Post more consistently"
  detail: string; // 1-2 sentences with specific numbers
  impact: string; // expected result, e.g. "Could reduce churn by 20%"
}

const SYSTEM_PROMPT = `You are an expert creator economy consultant specializing in fan subscription platforms like OnlyFans and Patreon.
You receive a creator's performance stats and generate 3-5 specific, actionable, data-driven recommendations to grow their revenue.
Each recommendation must be:
- Based on the ACTUAL numbers provided (mention specific figures)
- Actionable (creator can do it today)
- Realistic (not generic platitudes)

Return ONLY valid JSON array. Each item must have: priority ("HIGH"|"MEDIUM"|"LOW"), title (max 10 words), detail (1-2 sentences with numbers), impact (expected result).

Example format:
[{"priority":"HIGH","title":"Post today — your fans are disengaging","detail":"You haven't posted in 8 days. Subscribers who go 7+ days without content churn at 3x the normal rate.","impact":"Posting today could prevent 5-10 cancellations this week."}]`;

export async function generateInsights(creatorId: string, stats: CreatorStats): Promise<Insight[]> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const statsText = JSON.stringify(stats, null, 2);

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: `Creator stats:\n${statsText}\n\nGenerate 3-5 insights.` }],
  });

  const text = response.content[0]?.type === 'text' ? response.content[0].text.trim() : '[]';

  await logAIUsage(creatorId, 'upsell', response.usage.input_tokens, response.usage.output_tokens);

  try {
    return JSON.parse(text) as Insight[];
  } catch {
    return [];
  }
}

export async function generateAndSaveInsights(creatorId: string) {
  const { gatherCreatorStats } = await import('./insightStatsService.js');
  const stats = await gatherCreatorStats(creatorId);
  const insights = await generateInsights(creatorId, stats);

  const expiresAt = new Date(Date.now() + 7 * 86400000); // 7 days from now

  await prisma.creatorInsight.upsert({
    where: { creatorId },
    create: { creatorId, insights, rawStats: stats as unknown as Prisma.InputJsonValue, expiresAt },
    update: {
      insights,
      rawStats: stats as unknown as Prisma.InputJsonValue,
      generatedAt: new Date(),
      expiresAt,
    },
  });

  return insights;
}
```

---

## F5 — Step 3: BullMQ Weekly Job

**File: `apps/server/src/jobs/insights-worker.ts`** (new, ~80 lines)

```ts
import { Worker, Queue } from 'bullmq';
import { redis } from '../config/redis.js';
import { generateAndSaveInsights } from '../services/insightGeneratorService.js';
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';

export const insightsQueue = new Queue('insights', { connection: redis });

// Schedule weekly: every Sunday at 3am UTC
// Add this to server startup (index.ts):
// await insightsQueue.add('weekly-refresh', {}, { repeat: { cron: '0 3 * * 0' } });

export const insightsWorker = new Worker(
  'insights',
  async (job) => {
    logger.info('Starting weekly insights generation');

    const creators = await prisma.user.findMany({
      where: { role: 'CREATOR', status: 'ACTIVE' },
      select: { id: true },
    });

    logger.info(`Generating insights for ${creators.length} creators`);

    // Process in batches of 5 to avoid overwhelming Claude API
    for (let i = 0; i < creators.length; i += 5) {
      const batch = creators.slice(i, i + 5);
      await Promise.allSettled(batch.map((c) => generateAndSaveInsights(c.id)));
      // Small delay between batches
      await new Promise((r) => setTimeout(r, 2000));
    }

    logger.info('Weekly insights generation complete');
  },
  { connection: redis, concurrency: 1 },
);
```

**Register in `apps/server/src/index.ts`** (alongside email-worker, story-expiry-worker, etc.):

```ts
import './jobs/insights-worker.js';
```

---

## F5 — Step 4: Insights API Routes

**File: `apps/server/src/routes/creator-insights.ts`** (new, ~80 lines)

```
GET /api/creator/insights
  Auth: authenticate + requireRole('CREATOR')
  Does: fetch CreatorInsight where creatorId = userId
  Returns: { insights, generatedAt, expiresAt } or null if none yet

POST /api/creator/insights/refresh
  Auth: authenticate + requireRole('CREATOR')
  Rate limit: max once per 24 hours (check generatedAt field)
  Does: generateAndSaveInsights(userId) — this takes 3-5 seconds
  Returns: { insights, generatedAt }
  Error: 429 if refreshed within last 24h
```

**Register in `app.ts`:**

```ts
import creatorInsightsRouter from './routes/creator-insights.js';
app.use('/api/creator/insights', creatorInsightsRouter);
```

---

## F5 — Step 5: Dashboard Card UI

**File: `apps/web/src/components/creator/AIAdvisorCard.tsx`** (new, ~150 lines)

```tsx
// Fetches: GET /api/creator/insights
// Loading state: skeleton card (3 placeholder rows)
// Empty state: "Your first AI insights will be ready after 7 days of activity on the platform. Check back soon."
// Has data:
//   Header: "AI Revenue Advisor" + sparkle icon + "Updated [X days ago]"
//   Each insight (map over array):
//     Priority badge: HIGH=red, MEDIUM=amber, LOW=green
//     Title (bold)
//     Detail text (smaller, muted)
//     Impact text (italic, muted)
//   Footer: "Refresh Insights" button (disabled + shows cooldown if < 24h)
// Refresh: POST /api/creator/insights/refresh → optimistic update → show new data
// On refresh success: show toast "Insights updated!"
// Error state: "Unable to load insights" with retry button
```

**Add to `apps/web/src/pages/CreatorDashboardHome.tsx`:**

```tsx
import { AIAdvisorCard } from '../components/creator/AIAdvisorCard';
// Add as first card in the right column (or top section)
```

**Push notification when new weekly insights are ready:**
In `insights-worker.ts`, after generating each creator's insights:

```ts
// Use existing notification system
await prisma.notification.create({
  data: {
    userId: creator.id,
    type: 'SYSTEM',
    title: 'New AI Insights Ready',
    message: 'Your weekly revenue advisor has new recommendations for you.',
    link: '/creator/dashboard',
  },
});
```

---

## F5 — Step 6: Admin Insights Overview

**File: `apps/web/src/pages/admin/AdminAIInsights.tsx`** (new, ~120 lines)

Shows:

- Stat cards: Creators with insights | Avg insight freshness | Most common HIGH priority issues
- Table: creator | last generated | insight count | top priority
- "Generate for all now" button → triggers manual job via `POST /api/admin/ai/insights/refresh-all`

Backend:

```
GET /api/admin/ai/insights → aggregate stats + per-creator list
POST /api/admin/ai/insights/refresh-all → add job to queue for all creators
```

Add to `routes/admin/admin-ai.ts` (same file as F4 admin endpoint).

**Register in `AdminRoutes.tsx`:**

```tsx
const AdminAIInsights = lazy(() => import('./AdminAIInsights'));
<Route path="/admin/ai-insights" element={<AdminAIInsights />} />;
```

---

---

# FEATURE 6 — AI SUPPORT CHATBOT

**€1,800 | Days 23–30 | Week 4–5**

---

## F6 — Step 1: Knowledge Base Data Layer

**File: `apps/server/src/routes/admin/admin-kb.ts`** (new, ~150 lines)

```
GET    /api/admin/kb/categories              → list all categories with article count
POST   /api/admin/kb/categories              → create category { name, slug, order }
PATCH  /api/admin/kb/categories/:id          → update category
DELETE /api/admin/kb/categories/:id          → delete (only if no articles)

GET    /api/admin/kb/articles                → list all, filter by categoryId, isPublished
POST   /api/admin/kb/articles                → create { categoryId, title, slug, content, isPublished }
GET    /api/admin/kb/articles/:id            → get single article
PATCH  /api/admin/kb/articles/:id            → update
DELETE /api/admin/kb/articles/:id            → soft delete (set isPublished=false) or hard delete
POST   /api/admin/kb/articles/:id/publish    → toggle isPublished
```

**Seed initial knowledge base articles** — write a seed script or just create them via admin UI after deploy:

- `apps/server/src/scripts/seed-kb.ts` — creates 30+ starter articles across 6 categories:
  - Account & Login (5 articles)
  - Billing & Payments (5 articles)
  - Creator Hub (8 articles)
  - Fan Guide (5 articles)
  - Safety & Privacy (4 articles)
  - Technical Help (3 articles)

---

## F6 — Step 2: Support Chat Service

**File: `apps/server/src/services/supportChatService.ts`** (new, ~160 lines)

```ts
import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';

const MODEL = 'claude-sonnet-4-6';

// Search KB articles for relevant context (keyword match for V1)
async function searchKB(query: string): Promise<string> {
  const words = query
    .toLowerCase()
    .split(' ')
    .filter((w) => w.length > 3);
  if (words.length === 0) return '';

  const articles = await prisma.kBArticle.findMany({
    where: {
      isPublished: true,
      OR: words.map((w) => ({
        OR: [
          { title: { contains: w, mode: 'insensitive' } },
          { content: { contains: w, mode: 'insensitive' } },
        ],
      })),
    },
    take: 3,
    select: { title: true, content: true },
  });

  if (articles.length === 0) return '';
  return articles.map((a) => `### ${a.title}\n${a.content}`).join('\n\n---\n\n');
}

const SYSTEM_PROMPT = `You are the Fansbook support assistant. You help users (fans and creators) with questions about the platform.
You ONLY answer questions based on the knowledge base articles provided below.
If the answer is not in the knowledge base, say: "I don't have specific information about that. Let me connect you with a human agent who can help."
Be friendly, concise, and helpful. Keep responses under 150 words.
Never make up platform policies or pricing.`;

export async function generateSupportReply(
  conversationId: string,
  userId: string,
  userMessage: string,
): Promise<{ reply: string; shouldEscalate: boolean }> {
  // Get conversation history (last 10 messages)
  const history = await prisma.supportMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    take: 10,
    select: { role: true, content: true },
  });

  // Search KB for relevant context
  const kbContext = await searchKB(userMessage);

  const systemWithKB = kbContext
    ? `${SYSTEM_PROMPT}\n\n## Knowledge Base:\n${kbContext}`
    : `${SYSTEM_PROMPT}\n\nNo specific knowledge base articles found for this query. Offer to escalate to human support.`;

  const messages = [
    ...history.map((m) => ({
      role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user' as const, content: userMessage },
  ];

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 400,
      system: systemWithKB,
      messages,
    });

    const reply =
      response.content[0]?.type === 'text'
        ? response.content[0].text.trim()
        : "I'm having trouble processing your request. Let me connect you with a human agent.";

    // Detect if AI is uncertain — trigger escalation hint
    const shouldEscalate =
      reply.includes('connect you with a human') ||
      reply.includes("don't have specific information") ||
      reply.includes('human agent');

    return { reply, shouldEscalate };
  } catch (err) {
    logger.error({ err }, 'supportChat generateReply failed');
    return {
      reply: "I'm having trouble right now. Let me connect you with a human agent.",
      shouldEscalate: true,
    };
  }
}
```

---

## F6 — Step 3: Support Chat Routes

**Modify `apps/server/src/routes/support.ts`** (already exists — extend it):

Add these endpoints:

```
POST /api/support/conversations
  Auth: authenticate
  Does: find open conversation for user OR create new SupportConversation
  Returns: { conversationId, messages: [] }

GET /api/support/conversations/:id
  Auth: authenticate (must be owner)
  Returns: { conversation, messages }

POST /api/support/conversations/:id/message
  Auth: authenticate (must be owner)
  Body: { content }
  Rate limit: 20 per hour per user
  Does:
    1. Save user message to SupportMessage (role: 'user')
    2. If conversation.status === 'ESCALATED': don't call AI, return { escalated: true }
    3. Call generateSupportReply(conversationId, userId, content)
    4. Save AI reply to SupportMessage (role: 'assistant', isAI: true)
    5. If shouldEscalate: update conversation.status = 'ESCALATED', notify admin
    6. Return { reply, shouldEscalate }

POST /api/support/conversations/:id/escalate
  Auth: authenticate (must be owner)
  Does: set status = 'ESCALATED', notify admin (email + notification)
  Returns: { message: "A human agent will respond shortly." }

GET /api/support/conversations
  Auth: authenticate
  Returns: user's support conversation history (most recent first)
```

**Admin support endpoints in `apps/server/src/routes/admin/admin-support.ts`** (new, ~120 lines):

```
GET /api/admin/support/conversations         → all conversations, filter by status
GET /api/admin/support/conversations/:id     → full conversation with messages
POST /api/admin/support/conversations/:id/reply  → admin reply (role: 'agent')
PATCH /api/admin/support/conversations/:id/resolve → set status=RESOLVED
PATCH /api/admin/support/conversations/:id/assign  → assign to admin user
PATCH /api/admin/support/messages/:msgId/rate      → thumbs up/down on AI message
GET /api/admin/support/stats → open count, escalated, resolved today, avg resolution time
```

**Register new admin route in `routes/admin/index.ts`:**

```ts
import adminSupportRouter from './admin-support.js';
import adminKBRouter from './admin-kb.js';
router.use('/support', adminSupportRouter);
router.use('/kb', adminKBRouter);
```

---

## F6 — Step 4: Support Widget UI

**File: `apps/web/src/components/support/SupportChatWidget.tsx`** (new, ~190 lines)

```tsx
// Floating button: bottom-right corner, all authenticated pages
// Z-index: 40 (below age popup z-50, above content)
// Button: circular, 56px, purple gradient (match brand), chat bubble icon
// Unread badge: red dot if there are unresolved messages

// On open: slide up panel (400px wide × 500px tall on desktop, fullscreen on mobile)
// Panel structure:
//   Header: "Fansbook Support" + minimize button + X button
//   Messages area: scrollable, auto-scroll to bottom on new message
//     User messages: right-aligned, dark bubble
//     AI messages: left-aligned, with small robot icon
//     Agent messages: left-aligned, with agent avatar
//   Escalated banner: "👤 Human agent will respond soon" (if status === ESCALATED)
//   Input area:
//     Textarea (1-3 lines auto-expand)
//     Send button
//     "Talk to a human" link below input

// State machine: closed | opening | open | escalated
// API calls:
//   On first open: POST /api/support/conversations → get conversationId
//   On send: POST /api/support/conversations/:id/message → show AI reply
//   On "Talk to a human": POST /api/support/conversations/:id/escalate
```

**Add to `apps/web/src/App.tsx`** inside the authenticated layout (not on public pages, not on admin pages):

```tsx
// Import and render inside the main authenticated outlet:
{
  isAuthenticated && !isAdminRoute && <SupportChatWidget />;
}
```

Or add to the main dashboard layout component instead.

---

## F6 — Step 5: Admin Support UI

**File: `apps/web/src/pages/admin/AdminSupport.tsx`** (new, ~190 lines)

Tabs:

1. **Escalated** — conversations needing human response (red badge count)
2. **Open** — AI is handling, monitoring
3. **Resolved** — closed tickets

Each conversation row: User (avatar + name) | First message preview | Status | Messages count | Time since last activity | Assigned to | Actions

Conversation detail view (click to expand or navigate):

- Full message thread with timestamps
- User → AI → Agent messages all visible
- Role-labeled clearly
- Reply input at bottom (admin types and sends)
- "Mark Resolved" button
- "Assign to Me" button
- AI message quality rating (👍 / 👎 per message)

Stats bar: Open | Escalated | Resolved Today | Avg Resolution Time

**Register in `AdminRoutes.tsx`:**

```tsx
const AdminSupport = lazy(() => import('./AdminSupport'));
const AdminKB = lazy(() => import('./AdminKB'));
<Route path="/admin/support" element={<AdminSupport />} />
<Route path="/admin/kb" element={<AdminKB />} />
```

---

## F6 — Step 6: Admin Knowledge Base Editor

**File: `apps/web/src/pages/admin/AdminKB.tsx`** (new, ~190 lines)

Left panel: Category list (drag to reorder)
Right panel: Article list for selected category

Article editor:

- Title input
- Slug input (auto-generated from title, editable)
- Rich text editor (use existing `shadcn` textarea or simple markdown textarea)
- Published/Draft toggle
- Save button
- Delete button (confirm modal)

Category management:

- Add/rename/delete categories
- Reorder (drag or up/down buttons)

---

## F6 — Step 7: Real-time for Escalated Tickets

When admin sends a reply to an escalated conversation, notify the user:

```ts
// In admin-support.ts POST /:id/reply handler:
emitToUser(conversation.userId, 'support:reply', {
  conversationId: conversation.id,
  content: replyContent,
  role: 'agent',
});
```

In `SupportChatWidget.tsx`, listen for `support:reply` socket event and append to messages.

---

## F6 — Step 8: Knowledge Base Seeding Script

**File: `apps/server/src/scripts/seed-kb.ts`** (new, ~120 lines)

Contains 30+ articles as TypeScript constants, then bulk-creates them via Prisma.
Run once on production after deploy:

```bash
cd /opt/fansbook/apps/server && npx tsx src/scripts/seed-kb.ts
```

---

---

## FINAL DEPLOYMENT CHECKLIST (for each feature)

### Before deploying each feature:

- [ ] Run `npx prisma generate && npx prisma db push` (local)
- [ ] Fix any TypeScript errors (`tsc --noEmit`)
- [ ] Run ESLint (`eslint --max-warnings 0`)
- [ ] Check no file exceeds 200 lines
- [ ] Check no function complexity > 10
- [ ] Run existing test suite: `npm test`

### Production deploy command:

```bash
# Local: push code
git add -A && git commit -m "feat: feature X complete" && git push origin main

# On server:
sshpass -p 'Jash123qwe,,' ssh root@135.181.162.188 \
  "pct exec 401 -- bash -c 'cd /opt/fansbook && git pull origin main && npm install && cd apps/server && npx prisma db push --skip-generate && cd ../.. && cd apps/web && npx vite build && pm2 restart fansbook-api'"
```

### After deploy — smoke test each feature:

- **F3**: Trigger test Stripe card, check FraudEvent in DB, check admin gets email
- **F2**: Upload a test image with adult content (use AWS test set), verify it's blocked
- **F1**: Go through Onfido flow in sandbox mode, verify webhook reaches server, check DB status update
- **F4**: Open creator message thread, click "Suggest replies", verify 3 options appear and NEVER auto-send
- **F5**: Trigger insight generation manually via API, check creator dashboard card
- **F6**: Open support widget, send a message, verify AI reply comes back, test escalation

---

## TOTAL NEW FILES SUMMARY

### Backend (server):

```
services/fraudService.ts             (F3)
services/moderationService.ts        (F2)
services/verificationService.ts      (F1)
services/botService.ts               (F4 — rewrite)
services/insightStatsService.ts      (F5)
services/insightGeneratorService.ts  (F5)
services/supportChatService.ts       (F6)
routes/admin/admin-fraud.ts          (F3)
routes/admin/admin-moderation.ts     (F2)
routes/admin/admin-verifications.ts  (F1)
routes/admin/admin-ai.ts             (F4+F5)
routes/admin/admin-support.ts        (F6)
routes/admin/admin-kb.ts             (F6)
routes/verification.ts               (F1)
routes/creator-moderation.ts         (F2)
routes/creator-ai.ts                 (F4)
routes/creator-insights.ts           (F5)
jobs/insights-worker.ts              (F5)
jobs/tone-learning-worker.ts         (F4)
middleware/requireVerified.ts         (F1)
scripts/seed-kb.ts                   (F6)
```

### Frontend (web):

```
pages/VerifyIdentity.tsx             (F1)
pages/CreatorAISettings.tsx          (F4 — repurpose CreatorBotSettings)
pages/admin/AdminFraud.tsx           (F3)
pages/admin/AdminModeration.tsx      (F2)
pages/admin/AdminIDVerification.tsx  (F1)
pages/admin/AdminAIUsage.tsx         (F4)
pages/admin/AdminAIInsights.tsx      (F5)
pages/admin/AdminSupport.tsx         (F6)
pages/admin/AdminKB.tsx              (F6)
components/messages/SmartReplyBar.tsx (F4)
components/creator/AIAdvisorCard.tsx  (F5)
components/support/SupportChatWidget.tsx (F6)
```

### Modified files (main ones):

```
prisma/schema.prisma                 (all features — schema additions)
config/env.ts                        (F1,F2,F3 — new env vars)
routes/payment-webhooks.ts           (F3 — new event handlers)
routes/support.ts                    (F6 — extend)
routes/messages.ts                   (F4 — remove auto-bot)
routes/admin/index.ts                (F3,F2,F1,F4,F5,F6 — register new routers)
utils/postMedia.ts                   (F2 — add scan intercept)
routes/posts.ts                      (F2 — pass email to createPostMedia)
routes/feed.ts                       (F2 — hide FLAGGED posts)
web/App.tsx                          (F1,F4,F6 — new routes + widget)
web/AdminRoutes.tsx                  (F3,F2,F1,F4,F5,F6 — new admin routes)
web/pages/CreatorDashboardHome.tsx   (F5 — add advisor card)
components/AgeVerification.tsx       (F1 — redirect to verify-identity)
```
