# Fansbook Rebuild

A creator-fan social platform rebuilt from scratch as a modern TypeScript monorepo. Fans subscribe to creators, purchase exclusive content, tip, book private sessions, and interact via real-time messaging and live streams.

## Tech Stack

| Layer       | Technology                                                         |
| ----------- | ------------------------------------------------------------------ |
| Frontend    | React 19 + Vite 7 + TypeScript 5.7 + Tailwind CSS 3.4 + shadcn/ui  |
| State       | Zustand (client) + TanStack Query v5 (server)                      |
| Routing     | React Router v6                                                    |
| Backend     | Node.js 20 + Express 4 + TypeScript                                |
| ORM         | Prisma 6 + PostgreSQL 16                                           |
| Auth        | Custom JWT (access 15 min + refresh 7 days) + TOTP 2FA (speakeasy) |
| Real-time   | Socket.IO v4                                                       |
| Cache/Queue | Redis 7 + BullMQ                                                   |
| Testing     | Vitest + React Testing Library + Playwright                        |
| CI/CD       | GitHub Actions                                                     |

## Prerequisites

- **Node.js** >= 20.0.0
- **PostgreSQL** >= 16
- **Redis** >= 7 (required for caching and job queues)
- **npm** >= 10 (ships with Node 20)

## Quick Start

### 1. Clone and install

```bash
git clone <repo-url> "Fansbook Rebuild"
cd "Fansbook Rebuild"
npm ci
```

### 2. Environment variables

Copy the example env files and edit them with your local values:

```bash
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
```

Key server variables:

| Variable             | Example                                                  |
| -------------------- | -------------------------------------------------------- |
| `DATABASE_URL`       | `postgresql://fansbook:fansbook@localhost:5432/fansbook` |
| `JWT_SECRET`         | A strong random string (min 10 chars)                    |
| `JWT_REFRESH_SECRET` | A strong random string (min 10 chars)                    |
| `CLIENT_URL`         | `http://localhost:5173`                                  |
| `PORT`               | `4000`                                                   |

### 3. Database setup

```bash
cd apps/server
npx prisma migrate deploy   # Apply migrations
npx prisma db seed           # Seed demo data
```

### 4. Start dev servers

```bash
# From project root (starts both frontend + backend)
npm run dev

# Or run individually:
# Terminal 1 - Backend (port 4000)
cd apps/server && npm run dev

# Terminal 2 - Frontend (port 5173)
cd apps/web && npm run dev
```

### 5. Login

Open `http://localhost:5173/login` and use one of the test accounts:

| Role    | Username      | Password       |
| ------- | ------------- | -------------- |
| Fan     | `testfan`     | `Test12345`    |
| Creator | `testcreator` | `Creator12345` |

## Project Structure

```
Fansbook Rebuild/
  apps/
    web/              React frontend (Vite, port 5173)
    server/           Express backend (port 4000)
  packages/
    shared/           @fansbook/shared - types, Zod schemas, constants
  load-tests/         k6 load test scripts
  docs/               Documentation (API reference, deployment guide)
  .github/workflows/  CI pipeline
```

## Available Scripts

Run from the project root:

| Script              | Description                                |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Start frontend + backend concurrently      |
| `npm run build`     | Build shared, server, and web packages     |
| `npm run lint`      | Run ESLint across the monorepo             |
| `npm run test`      | Run Vitest tests in all workspaces         |
| `npm run typecheck` | TypeScript type checking in all workspaces |
| `npm run format`    | Format code with Prettier                  |
| `npm run size`      | Check bundle size with size-limit          |

## API Documentation

The backend exposes a REST API at `/api`. See [docs/API.md](docs/API.md) for a quick endpoint reference.

Interactive Swagger docs are available at `/api/docs` when the server is running.

## Load Testing

k6 load test scripts are in the `load-tests/` directory. Install [k6](https://k6.io/) and run:

```bash
# Basic load test (ramp to 20 VUs)
k6 run load-tests/k6-basic.js

# Stress test (ramp to 50 VUs)
k6 run load-tests/k6-stress.js

# Against a remote environment
k6 run -e BASE_URL=https://fansbookrebuild.byredstone.com/api load-tests/k6-basic.js
```

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the full production deployment guide (Hetzner, Nginx, PM2, SSL).

## Contributing

1. Create a feature branch from `main`.
2. Follow the architecture rules: max 200 lines per file, no `any` types, thin controller/service/repository layers.
3. Shared Zod schemas in `packages/shared` are the single source of truth for validation.
4. Ensure `npm run lint`, `npm run typecheck`, and `npm run test` all pass before opening a PR.
5. Pre-commit hooks (Husky + lint-staged) will auto-format and lint staged files.
6. Keep commits focused and use clear commit messages.

## License

Private / Proprietary.
