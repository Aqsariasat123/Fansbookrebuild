# Fansbook Rebuild - Project Memory

## Project Overview

- Creator-fan social platform (like OnlyFans/Patreon) rebuilt from Laravel 8.83 monolith
- Fresh start, no data migration from old system
- Plan doc: `Fansbook_Platform_Rebuild_Plan.pdf` (74 pages, v2.1, Feb 2026)

## Tech Stack

- **Frontend**: React 19.2 + Vite 7.3 + TypeScript 5.7 + Tailwind CSS 3.4.17 + shadcn/ui
- **State**: Zustand (client) + TanStack Query v5 (server)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Backend**: Node.js + Express 4 + TypeScript
- **ORM**: Prisma 6.5 + PostgreSQL 15+
- **Auth**: Custom JWT (access 15m + refresh 7d) + speakeasy (2FA)
- **Real-time**: Socket.IO v4, mediasoup (live streaming), WebRTC (video calls)
- **Cache**: Redis 7 + BullMQ (3 workers: email, story expiry, auction close)
- **Error Monitoring**: Sentry (frontend + backend)
- **Testing**: Vitest + React Testing Library + Playwright
- **Figma MCP**: Connected and working

## Monorepo Structure

- `apps/web/` - React frontend (port 5173)
- `apps/server/` - Express backend (port 4000)
- `packages/shared/` - @fansbook/shared (types, Zod schemas, constants, utils)

## Current State: ~95% Complete (2026-03-10)

- All 6 remaining dev tasks COMPLETED and deployed (v1.2.0)
- Code review score: **88/100 — Production Ready**
- See [feature-audit.md](feature-audit.md) for full audit
- See [phase-status.md](phase-status.md) for per-phase status
- See [session-log-march.md](session-log-march.md) for detailed session history

## What's Done (All Features)

- Full fan/creator/admin dashboards (50+ pages, 121 routes)
- 266 API endpoints, 54 Prisma models, 51K+ LOC
- Auth: JWT + 2FA + email verification + password reset
- Real-time: Socket.IO chat, notifications, online status
- Live streaming (mediasoup) + 1-to-1 video calls (WebRTC)
- Marketplace with anti-sniping auctions
- Notification grouping, paid messages, story creator UI
- Bulk admin actions, admin impersonation
- Age verification popup (18+ consent before site access)
- Email system configured (SMTP working on production)

## What Remains (Production Config Only)

- **Payment gateway**: Code exists (simulated) — needs real CCBill/MirexPay/Stripe keys
- **Creator payouts**: Withdrawal requests work — needs real bank payout processor
- **i18n**: Configured for 10 languages but most pages hardcoded English
- See [payment-flows.md](payment-flows.md) for detailed payment analysis

## Test Accounts

- **Fan**: `testfan` / `Test12345` (email: `fan@test.com`)
- **Creator**: `testcreator` / `Creator12345` (email: `creator@test.com`)
- **Admin**: `admin` / `Admin@1234` (email: `admin@fansbook.com`)

## Live Deployment (Hetzner)

- **URL**: https://fansbookrebuild.byredstone.com
- **Admin**: https://fansbookrebuild.byredstone.com/admin
- **Server**: 135.181.162.188 (Proxmox 8.4), SSH password: `Jash123qwe,,`
- **LXC**: ID 401, name "fans", IP 10.10.10.41, Ubuntu 24.04
- **Stack**: Node 20, PostgreSQL 16, Nginx, PM2, SSL (Let's Encrypt)
- **Project path**: `/opt/fansbook/` inside LXC
- **PM2 process**: `fansbook-api` (tsx src/index.ts)
- **Deploy command**: `ssh → pct exec 401 → git pull → vite build → pm2 restart`

## Email (SMTP) — CONFIGURED

- **Provider**: Gmail (Google Workspace)
- **SMTP_HOST**: smtp.gmail.com
- **SMTP_USER**: catalyst@theredstone.ai
- **SMTP_FROM**: Fansbook <info@fansbook.vip>
- **EMAIL_ENABLED**: true
- Configured in `/opt/fansbook/apps/server/.env` on production

## Architecture Rules

- Max 200 lines per file, no `any` in TypeScript
- Thin Controller -> Service -> Repository pattern
- Shared Zod schemas = single source of truth
- Pre-commit hooks: ESLint + TypeScript + Vitest
- No console.log (use structured logger)

## Key File Paths

- Frontend entry: `apps/web/src/main.tsx`
- Router: `apps/web/src/App.tsx` (200 lines max, AuthBootstrap extracted)
- Age verification: `apps/web/src/components/AgeVerification.tsx`
- Auth bootstrap: `apps/web/src/components/AuthBootstrap.tsx`
- API client: `apps/web/src/lib/api.ts`
- Prisma schema: `apps/server/prisma/schema.prisma`
- Email util: `apps/server/src/utils/email.ts`
- Env config: `apps/server/src/config/env.ts`
- Footer: `apps/web/src/components/marketing/MarketingFooter.tsx`
- Creator dashboard: `apps/web/src/pages/CreatorDashboardHome.tsx`

## Important Notes

- SVG `fill="currentColor"` does NOT work in `<img>` tags — must inline SVG
- Tailwind `fill-foreground` class for theme-aware SVG fills
- App.tsx extracted AuthBootstrap to keep under 200 lines
- Age verification uses `useLocation` inside BrowserRouter for route-aware popup
- This terminal is ONLY for Fansbook work (user preference)

## How to Deploy

```bash
# From local machine:
cd "Fansbook Rebuild" && git push origin main
# Then SSH and deploy:
sshpass -p 'Jash123qwe,,' ssh root@135.181.162.188 \
  "pct exec 401 -- bash -c 'cd /opt/fansbook && git pull origin main && cd apps/web && npx vite build && pm2 restart fansbook-api'"
```

## Reports Generated

- `/Users/aqsa/Desktop/fansbook-report-v1.2.0.html` (full project report)
- `/Users/aqsa/Desktop/Fansbook Report v1.2.0.pdf` (PDF version)
