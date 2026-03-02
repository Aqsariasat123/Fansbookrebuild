# Deployment Guide

Production deployment for Fansbook Rebuild on Hetzner infrastructure.

---

## Infrastructure Overview

| Component     | Detail                                 |
| ------------- | -------------------------------------- |
| Provider      | Hetzner                                |
| Host IP       | 135.181.162.188                        |
| Hypervisor    | Proxmox 8.4                            |
| LXC Container | ID 401, name "fans", IP 10.10.10.41    |
| OS            | Ubuntu 24.04 LTS                       |
| Domain        | fansbookrebuild.byredstone.com         |
| SSL           | Let's Encrypt (auto-renew via certbot) |

---

## 1. LXC Container Setup (Proxmox)

Create an Ubuntu 24.04 unprivileged LXC container on the Proxmox host:

```bash
# On the Proxmox host
pct create 401 local:vztmpl/ubuntu-24.04-standard_24.04-1_amd64.tar.zst \
  --hostname fans \
  --memory 4096 \
  --cores 2 \
  --net0 name=eth0,bridge=vmbr1,ip=10.10.10.41/24,gw=10.10.10.1 \
  --storage local-lvm \
  --rootfs local-lvm:20 \
  --unprivileged 1

pct start 401
pct enter 401
```

---

## 2. Node.js 20 Installation

```bash
apt update && apt upgrade -y
apt install -y curl git build-essential

# Install Node.js 20 via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify
node -v   # v20.x.x
npm -v    # 10.x.x
```

---

## 3. PostgreSQL 16 Installation

```bash
apt install -y postgresql-16 postgresql-client-16

# Start and enable
systemctl enable --now postgresql

# Create database and user
sudo -u postgres psql <<SQL
CREATE USER fansbook WITH PASSWORD '<strong-password>';
CREATE DATABASE fansbook OWNER fansbook;
GRANT ALL PRIVILEGES ON DATABASE fansbook TO fansbook;
SQL
```

---

## 4. Redis 7 Installation

```bash
apt install -y redis-server

# Configure
sed -i 's/^supervised no/supervised systemd/' /etc/redis/redis.conf
sed -i 's/^# requirepass .*/requirepass <strong-redis-password>/' /etc/redis/redis.conf

systemctl enable --now redis-server
redis-cli -a '<strong-redis-password>' ping   # PONG
```

---

## 5. Application Deployment

```bash
# Clone the repository
mkdir -p /opt/fansbook
cd /opt/fansbook
git clone <repo-url> .

# Install dependencies
npm ci --production=false

# Build
npm run build

# Create the .env file for the server
cat > apps/server/.env <<'ENV'
DATABASE_URL=postgresql://fansbook:<db-password>@localhost:5432/fansbook
JWT_SECRET=<generate-a-strong-random-string>
JWT_REFRESH_SECRET=<generate-another-strong-random-string>
CLIENT_URL=https://fansbookrebuild.byredstone.com
PORT=4000
NODE_ENV=production
REDIS_URL=redis://:<redis-password>@localhost:6379
ENV

# Run migrations
cd apps/server
npx prisma migrate deploy

# Seed (optional, for demo data)
npx prisma db seed
```

---

## 6. PM2 Process Management

```bash
npm install -g pm2

# Start the API server
cd /opt/fansbook
pm2 start apps/server/src/index.ts \
  --name fansbook-api \
  --interpreter ./node_modules/.bin/tsx \
  --max-memory-restart 512M

# Save PM2 process list and enable startup on boot
pm2 save
pm2 startup systemd
```

Useful PM2 commands:

```bash
pm2 status              # Check process status
pm2 logs fansbook-api   # View logs
pm2 restart fansbook-api
pm2 stop fansbook-api
pm2 monit               # Real-time monitoring dashboard
```

---

## 7. Nginx Reverse Proxy

### Inside the LXC container

Install Nginx and configure it to serve the frontend static files and proxy API requests to the Node.js server.

```bash
apt install -y nginx
```

Create `/etc/nginx/sites-available/fansbook`:

```nginx
server {
    listen 80;
    server_name fansbookrebuild.byredstone.com;

    # Frontend static files
    root /opt/fansbook/apps/web/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 256;

    # Static asset caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # API proxy
    location /api {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.IO WebSocket support
    location /socket.io {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Uploaded files
    location /uploads {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable the site:

```bash
ln -s /etc/nginx/sites-available/fansbook /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

### On the Proxmox host

The host Nginx proxies the subdomain from the public internet to the LXC internal IP:

```nginx
server {
    listen 443 ssl http2;
    server_name fansbookrebuild.byredstone.com;

    ssl_certificate     /etc/letsencrypt/live/fansbookrebuild.byredstone.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fansbookrebuild.byredstone.com/privkey.pem;

    location / {
        proxy_pass http://10.10.10.41:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name fansbookrebuild.byredstone.com;
    return 301 https://$host$request_uri;
}
```

---

## 8. SSL with Let's Encrypt

On the Proxmox host (the one with the public IP):

```bash
apt install -y certbot python3-certbot-nginx

certbot --nginx -d fansbookrebuild.byredstone.com

# Verify auto-renewal
certbot renew --dry-run
```

Certbot auto-renewal runs via a systemd timer. Certificates renew automatically before expiry.

---

## 9. Environment Variables Reference

| Variable                | Required | Description                                 |
| ----------------------- | -------- | ------------------------------------------- |
| `DATABASE_URL`          | Yes      | PostgreSQL connection string                |
| `JWT_SECRET`            | Yes      | Access token signing secret (min 10 chars)  |
| `JWT_REFRESH_SECRET`    | Yes      | Refresh token signing secret (min 10 chars) |
| `CLIENT_URL`            | Yes      | Frontend URL for CORS                       |
| `PORT`                  | No       | Server port (default: 4000)                 |
| `NODE_ENV`              | Yes      | `production` or `development`               |
| `REDIS_URL`             | No       | Redis connection string                     |
| `SMTP_HOST`             | No       | Email SMTP host                             |
| `SMTP_PORT`             | No       | Email SMTP port                             |
| `SMTP_USER`             | No       | Email SMTP username                         |
| `SMTP_PASS`             | No       | Email SMTP password                         |
| `STRIPE_SECRET_KEY`     | No       | Stripe API secret key                       |
| `STRIPE_WEBHOOK_SECRET` | No       | Stripe webhook signing secret               |
| `SENTRY_DSN`            | No       | Sentry error monitoring DSN                 |

---

## 10. Updating the Application

```bash
cd /opt/fansbook

# Pull latest code
git pull origin main

# Install any new dependencies
npm ci

# Build
npm run build

# Run database migrations
cd apps/server && npx prisma migrate deploy

# Restart the server
pm2 restart fansbook-api
```

---

## 11. Monitoring and Logs

```bash
# PM2 logs
pm2 logs fansbook-api --lines 100

# Nginx access/error logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# PostgreSQL logs
tail -f /var/log/postgresql/postgresql-16-main.log

# System resources
htop
```

---

## 12. Backups

### Database

```bash
# Daily backup via cron
pg_dump -U fansbook fansbook | gzip > /backups/fansbook-$(date +%Y%m%d).sql.gz
```

Add to crontab (`crontab -e`):

```cron
0 3 * * * pg_dump -U fansbook fansbook | gzip > /backups/fansbook-$(date +\%Y\%m\%d).sql.gz
```

### Uploaded files

```bash
# Sync uploads to backup location
rsync -avz /opt/fansbook/uploads/ /backups/uploads/
```

---

## 13. Troubleshooting

| Symptom                  | Check                                                             |
| ------------------------ | ----------------------------------------------------------------- |
| 502 Bad Gateway          | `pm2 status` -- is fansbook-api online? Check `pm2 logs`.         |
| Cannot connect to DB     | `systemctl status postgresql` and verify `DATABASE_URL`.          |
| WebSocket not connecting | Ensure Nginx proxy passes `Upgrade` headers (see config above).   |
| SSL certificate expired  | Run `certbot renew` on the Proxmox host.                          |
| Out of memory            | Check `pm2 monit`, consider increasing LXC memory or adding swap. |
