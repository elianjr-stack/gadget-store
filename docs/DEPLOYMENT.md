# GadgetStore BD – Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [VPS Setup](#vps-setup)
3. [Domain & SSL](#domain--ssl)
4. [Docker Production Deployment](#docker-production-deployment)
5. [Database Management](#database-management)
6. [Monitoring](#monitoring)
7. [Backup Strategy](#backup-strategy)
8. [Scaling](#scaling)

---

## Prerequisites

- A VPS with at least 2GB RAM, 2 vCPU (recommended: 4GB RAM)
  - DigitalOcean, Vultr, AWS Lightsail, or Linode
- Ubuntu 22.04 LTS
- Domain name pointed to VPS IP
- SSH access

---

## VPS Setup

### 1. Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Create deploy user
sudo adduser deploy
sudo usermod -aG sudo deploy
su - deploy

# Setup SSH key authentication
mkdir -p ~/.ssh
chmod 700 ~/.ssh
# Add your public key to ~/.ssh/authorized_keys

# Disable password auth (after confirming key works)
sudo nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
sudo systemctl restart sshd
```

### 2. Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker deploy
newgrp docker

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Verify
docker --version
docker compose version
```

### 3. Install Nginx (Reverse Proxy)

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
```

---

## Domain & SSL

### 1. DNS Setup

Create these A records pointing to your VPS IP:
- `gadgetstore.com.bd` → VPS IP
- `admin.gadgetstore.com.bd` → VPS IP
- `api.gadgetstore.com.bd` → VPS IP

### 2. Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/gadgetstore
```

```nginx
# Storefront
server {
    server_name gadgetstore.com.bd www.gadgetstore.com.bd;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Admin Panel
server {
    server_name admin.gadgetstore.com.bd;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# API
server {
    server_name api.gadgetstore.com.bd;

    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/gadgetstore /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d gadgetstore.com.bd -d www.gadgetstore.com.bd -d admin.gadgetstore.com.bd -d api.gadgetstore.com.bd

# Auto-renewal
sudo certbot renew --dry-run
```

---

## Docker Production Deployment

### 1. Clone and Configure

```bash
cd /home/deploy
git clone <your-repo-url> gadget-store
cd gadget-store

# Create production .env
cp .env.example .env
nano .env
```

**Important `.env` changes for production:**
```env
NODE_ENV=production
DATABASE_URL=postgresql://gadgetstore:STRONG_PASSWORD@postgres:5432/gadgetstore
JWT_SECRET=generate-a-64-char-random-string
FRONTEND_URL=https://gadgetstore.com.bd
ADMIN_URL=https://admin.gadgetstore.com.bd
API_URL=https://api.gadgetstore.com.bd
SSLCOMMERZ_IS_SANDBOX=false
```

### 2. Build and Deploy

```bash
# Build and start all services
docker compose -f docker-compose.yml up -d --build

# Run migrations
docker exec gadgetstore-api npx prisma migrate deploy

# Seed initial data (first time only)
docker exec gadgetstore-api npx prisma db seed

# Check status
docker compose ps
docker compose logs -f
```

### 3. Update Deployment

```bash
cd /home/deploy/gadget-store
git pull origin main
docker compose up -d --build
docker exec gadgetstore-api npx prisma migrate deploy
```

---

## Database Management

### Prisma Migrations

```bash
# Create migration (development)
cd packages/backend
npx prisma migrate dev --name description

# Apply migrations (production)
docker exec gadgetstore-api npx prisma migrate deploy

# View database
npx prisma studio
```

### Direct Database Access

```bash
docker exec -it gadgetstore-db psql -U gadgetstore -d gadgetstore
```

---

## Monitoring

### Docker Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend

# Last 100 lines
docker compose logs --tail=100 backend
```

### Health Checks

```bash
# API health
curl https://api.gadgetstore.com.bd/api/health

# Check all containers
docker compose ps
```

### Resource Monitoring

```bash
# Docker stats
docker stats

# System resources
htop
df -h
```

---

## Backup Strategy

### Automated Daily Backups

Create `/home/deploy/backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/home/deploy/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Database backup
docker exec gadgetstore-db pg_dump -U gadgetstore gadgetstore | gzip > "$BACKUP_DIR/db_$DATE.sql.gz"

# Keep only last 30 days
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

```bash
chmod +x /home/deploy/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /home/deploy/backup.sh >> /home/deploy/backups/backup.log 2>&1
```

### Restore from Backup

```bash
gunzip < backups/db_20241201_020000.sql.gz | docker exec -i gadgetstore-db psql -U gadgetstore -d gadgetstore
```

---

## Scaling

### Horizontal Scaling (when needed)

1. **Database**: Move PostgreSQL to a managed service (DigitalOcean Managed DB, AWS RDS)
2. **Redis**: Move to managed Redis (ElastiCache, DigitalOcean Managed Redis)
3. **CDN**: Use Cloudflare for static assets and caching
4. **Load Balancer**: Add Nginx load balancer for multiple API instances
5. **Object Storage**: Use DigitalOcean Spaces or AWS S3 for uploads

### Performance Checklist

- [ ] Enable Redis caching for product listings
- [ ] Set up Cloudflare CDN
- [ ] Enable Next.js ISR for product pages
- [ ] Optimize database queries with proper indexes
- [ ] Enable gzip/brotli compression
- [ ] Set up image optimization pipeline
- [ ] Monitor with PM2 or Docker health checks

---

## Troubleshooting

### Common Issues

**Container won't start:**
```bash
docker compose logs <service>
docker compose down && docker compose up -d
```

**Database connection error:**
```bash
docker exec gadgetstore-db pg_isready -U gadgetstore
```

**Migration failed:**
```bash
docker exec gadgetstore-api npx prisma migrate reset
# WARNING: This will drop all data
```

**Out of disk space:**
```bash
docker system prune -a
docker volume prune
```
