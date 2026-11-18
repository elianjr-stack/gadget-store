# GadgetStore BD 🇧🇩

> A complete, production-ready gadget e-commerce platform built for the Bangladesh market.

Inspired by **Apple Gadgets BD**, **Gadget & Gear**, **Star Tech**, and **Ryans Computers**.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Storefront** | Next.js 14, React 18, TypeScript, Tailwind CSS |
| **Admin Panel** | Next.js 14, React 18, TypeScript, Tailwind CSS, Recharts |
| **Backend API** | NestJS (Node.js), TypeScript, REST API |
| **Database** | PostgreSQL 16 + Prisma ORM |
| **Cache** | Redis 7 |
| **Image Storage** | Cloudinary (or S3-compatible) |
| **Payments** | SSLCommerz, bKash, Nagad, Rocket, Upay, COD, Bank Transfer, EMI |
| **Deployment** | Docker + Docker Compose |

---

## 📁 Project Structure

```
gadget-store/
├── docker-compose.yml          # Full stack Docker setup
├── .env.example                # Environment variables template
├── package.json                # Root workspace scripts
│
├── packages/
│   ├── backend/                # NestJS REST API
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Complete database schema
│   │   │   └── seed/           # Seed data
│   │   ├── src/
│   │   │   ├── modules/        # Feature modules
│   │   │   │   ├── auth/       # JWT authentication
│   │   │   │   ├── products/   # Product CRUD + search
│   │   │   │   ├── categories/ # Category tree
│   │   │   │   ├── brands/     # Brand management
│   │   │   │   ├── orders/     # Order lifecycle
│   │   │   │   ├── cart/       # Shopping cart
│   │   │   │   ├── wishlist/   # Wishlists
│   │   │   │   ├── reviews/    # Product reviews
│   │   │   │   ├── coupons/    # Coupon system
│   │   │   │   ├── banners/    # CMS banners
│   │   │   │   ├── payments/   # Payment gateway
│   │   │   │   ├── delivery/   # Delivery & courier
│   │   │   │   ├── upload/     # Image uploads
│   │   │   │   ├── analytics/  # Sales analytics
│   │   │   │   ├── notifications/ # Alerts
│   │   │   │   └── users/      # User management
│   │   │   ├── prisma/         # Prisma service
│   │   │   ├── redis/          # Redis service
│   │   │   └── common/         # Guards, pipes, filters
│   │   └── Dockerfile
│   │
│   ├── frontend/               # Next.js Storefront
│   │   ├── src/
│   │   │   ├── app/            # App Router pages
│   │   │   ├── components/     # UI components
│   │   │   ├── hooks/          # Custom hooks
│   │   │   ├── lib/            # Utilities & API
│   │   │   └── types/          # TypeScript types
│   │   └── Dockerfile
│   │
│   └── admin/                  # Next.js Admin Panel
│       ├── src/
│       │   ├── app/            # App Router pages
│       │   ├── components/     # Admin UI components
│       │   ├── lib/            # Utilities & API
│       │   └── types/          # TypeScript types
│       └── Dockerfile
│
└── docs/                       # Documentation
    ├── API.md                  # API documentation
    ├── ADMIN_GUIDE.md          # Admin user guide
    └── DEPLOYMENT.md           # Deployment guide
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 16
- Redis 7
- Docker & Docker Compose (optional but recommended)

### Option 1: Docker (Recommended)

```bash
# 1. Clone and enter project
cd gadget-store

# 2. Copy environment file
cp .env.example .env
# Edit .env with your values

# 3. Start everything
docker-compose up -d

# 4. Run database migrations
docker exec gadgetstore-api npx prisma migrate deploy

# 5. Seed the database
docker exec gadgetstore-api npx prisma db seed

# 6. Access the apps
# Storefront: http://localhost:3000
# Admin Panel: http://localhost:3001
# API: http://localhost:4000
# API Docs: http://localhost:4000/api/docs
```

### Option 2: Local Development

```bash
# 1. Start PostgreSQL and Redis
# (use docker-compose for just these services)
docker-compose up -d postgres redis

# 2. Setup backend
cd packages/backend
cp ../../.env.example .env
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev

# 3. Setup frontend (new terminal)
cd packages/frontend
npm install
npm run dev

# 4. Setup admin (new terminal)
cd packages/admin
npm install
npm run dev
```

---

## 🔑 Default Admin Credentials

| Field | Value |
|-------|-------|
| Email | admin@gadgetstore.com.bd |
| Password | Admin@12345 |

> ⚠️ Change these immediately in production!

---

## 📦 Features

### Storefront
- ✅ Homepage with banners, flash deals, new arrivals, best sellers
- ✅ Brand pages with all products and filters
- ✅ Category pages with filters and sorting
- ✅ Product page with gallery, specs, variants, reviews, related
- ✅ Search with autosuggest
- ✅ Product comparison (up to 4)
- ✅ Cart with coupon and delivery estimation
- ✅ Multi-step checkout
- ✅ Wishlist and recently viewed
- ✅ Pre-order and stock notifications
- ✅ User accounts with order history
- ✅ Dark/light mode
- ✅ Bangla/English language toggle
- ✅ WhatsApp chat button
- ✅ Mobile-first responsive design

### Admin Panel
- ✅ Sales dashboard with analytics charts
- ✅ Product management (CRUD, bulk import/export)
- ✅ Category management (tree structure)
- ✅ Brand management
- ✅ Order management with status tracking
- ✅ Customer management
- ✅ Coupon management
- ✅ Banner/CMS management
- ✅ Review moderation
- ✅ Role-based access (Owner, Manager, Staff)
- ✅ Activity logs
- ✅ Low-stock alerts
- ✅ Store settings

### Payments
- ✅ SSLCommerz (Visa/Mastercard/AMEX)
- ✅ bKash
- ✅ Nagad
- ✅ Rocket
- ✅ Upay
- ✅ Bank Transfer
- ✅ Cash on Delivery
- ✅ EMI/Installment options

### SEO & Performance
- ✅ Server-side rendering (SSR)
- ✅ SEO meta tags and schema markup
- ✅ Sitemap generation
- ✅ Image optimization
- ✅ Redis caching

### Security
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Rate limiting
- ✅ Input validation
- ✅ Helmet (security headers)
- ✅ CORS configuration
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS protection

---

## 🗄️ Database Schema

The complete schema includes 30+ models covering:
- Users, Sessions, Addresses
- Brands, Categories (with tree structure)
- Products, Variants, Specs, Images
- Cart, Wishlist, Comparisons
- Orders, Order Items, Status History
- Payments, Coupons
- Reviews, Ratings
- Banners, Pages (CMS)
- Delivery Charges, Districts
- Notifications, Stock Alerts
- Activity Logs, Settings
- Returns, Warranty Claims

---

## 📡 API Endpoints

See [docs/API.md](docs/API.md) for complete API documentation.

Key endpoints:
- `POST /api/auth/register` – User registration
- `POST /api/auth/login` – Login
- `GET /api/products` – List products (with filters)
- `GET /api/products/:slug` – Product detail
- `GET /api/categories` – Category tree
- `GET /api/brands` – Brand list
- `POST /api/cart` – Add to cart
- `POST /api/orders` – Place order
- `POST /api/payments/sslcommerz/init` – Initialize payment
- `GET /api/analytics/dashboard` – Admin dashboard data

---

## 🌐 Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions covering:
- VPS setup (DigitalOcean / AWS / Vultr)
- Domain and SSL configuration
- Docker production deployment
- Database backups
- Monitoring and logging

---

## 📄 License

Proprietary – All rights reserved.
