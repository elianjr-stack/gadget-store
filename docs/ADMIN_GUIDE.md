# GadgetStore BD – Admin Panel User Guide

Welcome to the **GadgetStore BD** administration manual. This guide explains how to manage brands, categories, products, inventory, prices, orders, courier shipments, and store settings from your secure dashboard.

---

## 1. Accessing the Dashboard

- **URL:** `http://localhost:3001/login` (Production: `https://admin.gadgetstore.com.bd`)
- **Default Owner Email:** `admin@gadgetstore.com.bd`
- **Default Password:** `Admin@12345`

> ⚠️ **Important:** Change your password after your first login via **Settings > Profile Security**.

---

## 2. Product Management

### Adding a New Product
1. Go to **Products** in the sidebar and click **Create Product**.
2. Fill in:
   - **Name (English & বাংলা):** e.g. `iPhone 16 Pro Max` / `আইফোন ১৬ প্রো ম্যাক্স`
   - **SKU:** Unique code e.g. `APL-IP16PM-256`
   - **Brand & Category:** Select from the dropdowns
   - **Price in BDT (৳):** Regular price and optional discount price
   - **Stock Quantity:** Initial stock number
   - **Technical Specifications:** Add rows (e.g. Display → 6.7" Super Retina XDR)
   - **Variants:** Add storage sizes (`128GB`, `256GB`, `512GB`) or regions (`Official BD`, `International`)
3. Click **Save & Publish Product**. The product goes live on the storefront immediately!

### Bulk Import via CSV
1. Go to **Products > Bulk CSV Import**.
2. Click **Download Sample CSV** to view the template.
3. Upload your spreadsheet with hundreds of products.
4. Click **Start Bulk Import**.

---

## 3. Order Processing & Courier Integration

### Order Lifecycle
When a customer places an order, it appears under **Orders** with one of these statuses:

1. **PENDING:** Customer checked out via bKash, Nagad, Card, or COD.
2. **CONFIRMED:** bKash/Nagad payment verified or phone call confirmation completed.
3. **PROCESSING:** Packaging items with invoice and warranty slip.
4. **SHIPPED:** Handed over to courier (Pathao, Steadfast, RedX).
5. **DELIVERED:** Courier delivered the package and collected payment (for COD).

### Assigning Courier & Tracking
1. Open the order by clicking **Manage**.
2. Select the courier partner: **Steadfast**, **Pathao**, **RedX**, or **Sundarban**.
3. Input the consignment tracking number (e.g. `STF-8941029`).
4. Set status to **SHIPPED** and click **Save & Notify Customer**.
5. An SMS and email with live tracking details are dispatched to the customer automatically.

---

## 4. Brand & Category Management

- **Categories:** Click **Categories** to add or edit categories. In GadgetStore, clicking a category (e.g., *Smart Watches*) aggregates products from all brands.
- **Brands:** Click **Brands** to add brands (Apple, Samsung, Xiaomi, Realme, Anker, Baseus, etc.). Clicking a brand filters its exclusive product line.

---

## 5. Coupons & Promotions

1. Go to **Coupons** and click **New Coupon**.
2. Enter:
   - **Code:** e.g. `EID2026` or `WELCOME10`
   - **Type:** Percentage (%) or Fixed Amount (৳)
   - **Value:** e.g. `10` for 10% off, or `500` for ৳500 off
   - **Min. Order:** Minimum cart amount in BDT
3. Click **Save Coupon**. Customers can apply it directly in their cart and checkout page.

---

## 6. Homepage Banners & Sliders

1. Go to **Banners & CMS**.
2. Click **New Banner**.
3. Provide:
   - Headline title & subtitle
   - Image URL (recommended 1920x800px)
   - Target Link (e.g. `/products/samsung-galaxy-s24-ultra`)
4. Click **Save Banner**. It updates the top hero carousel instantly.

---

## 7. Review Moderation

Customer reviews appear in **Reviews**. You can:
- **Approve:** Makes the review and star rating visible on the product detail page.
- **Delete:** Removes spam or inappropriate content.

---

## 8. Store Settings & Delivery Rates

Go to **Settings** to customize:
- Support hotline telephone numbers
- WhatsApp chat number
- Delivery fee inside Dhaka (`৳60` default)
- Delivery fee outside Dhaka (`৳120` default)
- Free delivery threshold (`৳2,000` default)

---

## 9. Security & Audit Trail

Every administrative change (price updates, order status modifications, coupon generation) is recorded in **Activity Logs** with the admin's operator name, timestamp, and IP address for full accountability.
