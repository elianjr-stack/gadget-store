# GadgetStore BD – API Documentation

Base URL: `http://localhost:4000/api`

All authenticated endpoints require: `Authorization: Bearer <token>`

---

## Authentication

### Register
```
POST /auth/register
Body: { name, email, phone, password }
Response: { user, accessToken, refreshToken }
```

### Login
```
POST /auth/login
Body: { email, password }
Response: { user, accessToken, refreshToken }
```

### Refresh Token
```
POST /auth/refresh
Body: { refreshToken }
Response: { accessToken, refreshToken }
```

### Logout
```
POST /auth/logout
Headers: Authorization
```

### Get Profile
```
GET /auth/me
Headers: Authorization
Response: { user }
```

---

## Products

### List Products
```
GET /products
Query: page, limit, search, brandId, categoryId, minPrice, maxPrice,
       stockStatus, sortBy (price, name, createdAt, soldCount, avgRating),
       sortOrder (asc, desc), isFeatured, isFlashDeal, isNewArrival, tags
Response: { data: Product[], meta: { total, page, limit, totalPages } }
```

### Get Product by Slug
```
GET /products/:slug
Response: { product (with brand, category, images, variants, specs, reviews) }
```

### Search Autosuggest
```
GET /products/search/suggest?q=iphone
Response: { suggestions: [{ name, slug, image, price }] }
```

### Create Product (Admin)
```
POST /products
Headers: Authorization (OWNER, MANAGER)
Body: { name, nameBn, sku, brandId, categoryId, price, ... }
Response: { product }
```

### Update Product (Admin)
```
PATCH /products/:id
Headers: Authorization (OWNER, MANAGER)
Body: { ...fields }
Response: { product }
```

### Delete Product (Admin)
```
DELETE /products/:id
Headers: Authorization (OWNER, MANAGER)
```

### Bulk Import (Admin)
```
POST /products/import
Headers: Authorization (OWNER, MANAGER)
Body: FormData with CSV/Excel file
Response: { imported: number, errors: [] }
```

### Export Products (Admin)
```
GET /products/export?format=csv|xlsx
Headers: Authorization (OWNER, MANAGER)
Response: File download
```

---

## Categories

### List Categories (Tree)
```
GET /categories
Response: { categories: Category[] } (nested tree structure)
```

### Get Category by Slug
```
GET /categories/:slug
Response: { category (with children, productCount) }
```

### Create Category (Admin)
```
POST /categories
Headers: Authorization (OWNER, MANAGER)
Body: { name, nameBn, slug, parentId?, icon?, image? }
```

### Update Category (Admin)
```
PATCH /categories/:id
```

### Delete Category (Admin)
```
DELETE /categories/:id
```

---

## Brands

### List Brands
```
GET /brands
Query: isActive
Response: { brands: Brand[] }
```

### Get Brand by Slug
```
GET /brands/:slug
Response: { brand (with productCount) }
```

### Create/Update/Delete Brand (Admin)
```
POST /brands
PATCH /brands/:id
DELETE /brands/:id
```

---

## Cart

### Get Cart
```
GET /cart
Headers: Authorization
Response: { items: CartItem[], subtotal, itemCount }
```

### Add to Cart
```
POST /cart
Headers: Authorization
Body: { productId, variantId?, quantity }
```

### Update Cart Item
```
PATCH /cart/:id
Headers: Authorization
Body: { quantity }
```

### Remove from Cart
```
DELETE /cart/:id
Headers: Authorization
```

### Clear Cart
```
DELETE /cart
Headers: Authorization
```

---

## Wishlist

### Get Wishlist
```
GET /wishlist
Headers: Authorization
Response: { items: WishlistItem[] }
```

### Add to Wishlist
```
POST /wishlist
Headers: Authorization
Body: { productId }
```

### Remove from Wishlist
```
DELETE /wishlist/:productId
Headers: Authorization
```

---

## Orders

### Place Order
```
POST /orders
Headers: Authorization
Body: {
  addressId,
  paymentMethod,
  couponCode?,
  note?,
  items: [{ productId, variantId?, quantity }]
}
Response: { order, paymentUrl? }
```

### Get My Orders
```
GET /orders/my
Headers: Authorization
Query: page, limit, status
Response: { data: Order[], meta }
```

### Get Order Detail
```
GET /orders/:id
Headers: Authorization
Response: { order (with items, statusHistory, address, payment) }
```

### Cancel Order
```
POST /orders/:id/cancel
Headers: Authorization
Body: { reason }
```

### Update Order Status (Admin)
```
PATCH /orders/:id/status
Headers: Authorization (OWNER, MANAGER, STAFF)
Body: { status, note?, trackingNumber?, courierName? }
```

### Get All Orders (Admin)
```
GET /orders
Headers: Authorization (OWNER, MANAGER, STAFF)
Query: page, limit, status, paymentStatus, dateFrom, dateTo, search
```

---

## Payments

### Initialize SSLCommerz
```
POST /payments/sslcommerz/init
Body: { orderId }
Response: { gatewayUrl }
```

### SSLCommerz IPN (Webhook)
```
POST /payments/ipn
Body: (SSLCommerz callback data)
```

### Payment Success Callback
```
POST /payments/sslcommerz/success
```

### Verify Payment
```
GET /payments/:orderId/verify
```

---

## Reviews

### Get Product Reviews
```
GET /reviews/product/:productId
Query: page, limit, sortBy
Response: { data: Review[], meta, summary: { average, total, distribution } }
```

### Create Review
```
POST /reviews
Headers: Authorization
Body: { productId, rating, title?, comment?, images? }
```

### Vote Helpful
```
POST /reviews/:id/helpful
Headers: Authorization
```

---

## Coupons

### Validate Coupon
```
POST /coupons/validate
Headers: Authorization
Body: { code, orderAmount }
Response: { valid, discount, coupon }
```

### CRUD (Admin)
```
GET /coupons
POST /coupons
PATCH /coupons/:id
DELETE /coupons/:id
```

---

## Delivery

### Calculate Delivery Charge
```
POST /delivery/calculate
Body: { zone, weight? }
Response: { charge, freeAbove? }
```

### Get Districts
```
GET /delivery/districts
Response: { districts: District[] }
```

---

## Banners

### Get Active Banners
```
GET /banners?position=HERO
Response: { banners: Banner[] }
```

### CRUD (Admin)
```
POST /banners
PATCH /banners/:id
DELETE /banners/:id
```

---

## Upload

### Upload Image
```
POST /upload/image
Headers: Authorization
Body: FormData with file
Response: { url, publicId }
```

### Upload Multiple Images
```
POST /upload/images
Headers: Authorization
Body: FormData with files[]
Response: { images: [{ url, publicId }] }
```

---

## Analytics (Admin)

### Dashboard
```
GET /analytics/dashboard
Headers: Authorization (OWNER, MANAGER)
Response: {
  totalRevenue, ordersToday, totalProducts, totalCustomers,
  recentOrders, revenueChart, topProducts, lowStockProducts
}
```

### Sales Report
```
GET /analytics/sales
Headers: Authorization (OWNER, MANAGER)
Query: period (7d, 30d, 90d, 1y), dateFrom, dateTo
Response: { revenue, orders, avgOrderValue, chartData }
```

---

## Users (Admin)

### List Users
```
GET /users
Headers: Authorization (OWNER, MANAGER)
Query: page, limit, role, search
```

### Update User Role
```
PATCH /users/:id/role
Headers: Authorization (OWNER)
Body: { role }
```

---

## Notifications

### Get My Notifications
```
GET /notifications
Headers: Authorization
Query: isRead
Response: { notifications: Notification[] }
```

### Mark as Read
```
PATCH /notifications/:id/read
Headers: Authorization
```

### Subscribe to Stock Alert
```
POST /notifications/stock-alert
Headers: Authorization
Body: { productId }
```

---

## Common Response Format

### Success
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": { ... }
}
```

### Error
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Email is required" }]
}
```

### Paginated
```json
{
  "statusCode": 200,
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```
