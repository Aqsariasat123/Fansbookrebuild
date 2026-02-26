# Fansbook Rebuild - Deployment Guide

## STRICT RULES

- **DO NOT** touch the database (no reset, no re-seed, no migrations unless explicitly asked)
- **DO NOT** touch the .env file on the server (it has production credentials, do not overwrite)
- **DO NOT** disturb any other projects/LXCs on this Proxmox server
- **DO NOT** change Nginx configs (already set up and working)
- **DO NOT** run `npm install` unless a new package was added
- **ONLY** push changed files, rebuild frontend, and restart backend if needed

## Server Details

- **Proxmox Host**: 135.181.162.188 (root / Jash123qwe,,)
- **LXC ID**: 401 (name: fans)
- **LXC IP**: 10.10.10.41
- **App Path**: /opt/fansbook/
- **Live URL**: https://fansbookrebuild.byredstone.com
- **PM2 Process**: fansbook-api (uses tsx interpreter)
- **Database**: PostgreSQL 16 (fansbook / fansbook123) — DO NOT TOUCH

## How to Deploy (Step by Step)

### 1. Create tarball of ONLY changed files

```bash
cd "/Users/aqsa/Desktop/Fansbook Rebuild"
tar czf /tmp/fansbook-update.tar.gz path/to/changed/file1 path/to/changed/file2
```

Example:

```bash
tar czf /tmp/fansbook-update.tar.gz apps/web/src/pages/Home.tsx apps/web/src/components/layout/Navbar.tsx
```

### 2. Upload to Proxmox host

```bash
sshpass -p 'Jash123qwe,,' scp /tmp/fansbook-update.tar.gz root@135.181.162.188:/tmp/fansbook-update.tar.gz
```

### 3. Push into LXC and extract

```bash
sshpass -p 'Jash123qwe,,' ssh root@135.181.162.188 "pct push 401 /tmp/fansbook-update.tar.gz /tmp/fansbook-update.tar.gz && pct exec 401 -- bash -c 'cd /opt/fansbook && tar xzf /tmp/fansbook-update.tar.gz'"
```

### 4. Rebuild frontend (if frontend files changed)

```bash
sshpass -p 'Jash123qwe,,' ssh root@135.181.162.188 "pct exec 401 -- bash -c 'cd /opt/fansbook/apps/web && npx vite build 2>&1 | tail -5'"
```

### 5. Restart backend (ONLY if backend/server files changed)

```bash
sshpass -p 'Jash123qwe,,' ssh root@135.181.162.188 "pct exec 401 -- bash -c 'cd /opt/fansbook && npx pm2 restart all'"
```

## Quick One-Liner (frontend only changes)

```bash
cd "/Users/aqsa/Desktop/Fansbook Rebuild" && \
tar czf /tmp/fansbook-update.tar.gz <changed-files> && \
sshpass -p 'Jash123qwe,,' scp /tmp/fansbook-update.tar.gz root@135.181.162.188:/tmp/fansbook-update.tar.gz && \
sshpass -p 'Jash123qwe,,' ssh root@135.181.162.188 "pct push 401 /tmp/fansbook-update.tar.gz /tmp/fansbook-update.tar.gz && pct exec 401 -- bash -c 'cd /opt/fansbook && tar xzf /tmp/fansbook-update.tar.gz && cd apps/web && npx vite build 2>&1 | tail -5'"
```

## When to do what

| Changed files in             | Rebuild frontend? | Restart backend?        |
| ---------------------------- | ----------------- | ----------------------- |
| `apps/web/`                  | YES               | NO                      |
| `apps/server/src/`           | NO                | YES                     |
| `apps/server/prisma/seed.ts` | NO                | NO (seed only if asked) |
| Both web + server            | YES               | YES                     |

## Test Account

- Username: `testfan` / Password: `Test12345`
