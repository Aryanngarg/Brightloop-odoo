# BrightLoop – Subscription Management System

A clean, modern, and professional SaaS Subscription Management System built with pure **HTML**, **CSS**, and **JavaScript**.

---

## 🌟 Quick Start (How to Open)

No server, database, or backend installation is required! Everything runs directly inside your web browser.

1. Locate the folder:  
   `/Users/ramanandgarg/.gemini/antigravity/scratch/brightloop`
2. **Double-click `index.html`** or right-click `index.html` and choose **Open With > Google Chrome** (or Safari / Firefox / Edge).
3. The application will immediately load with realistic demo data!

---

## 🚀 Features Included

### 1. Dashboard
- **Total Customers**: Live count of all registered client accounts.
- **Active Subscriptions**: Total number of currently active recurring subscriptions.
- **Total Revenue**: Sum of all recorded payments collected.
- **Pending Payments**: Total outstanding balances on unpaid, partial, or overdue invoices.
- **Recent Subscriptions & Recent Invoices Tables**: Quick overview widgets with real-time status pills.
- **Fast Actions Bar**: Instant 1-click shortcuts to add customers, plans, subscriptions, invoices, and payments.

### 2. Customers
- Add new customers with full name, email, phone number, and company.
- Real-time instant search bar.
- Shows active subscription counts per customer.
- One-click shortcuts to quickly subscribe a customer or generate an invoice for them.
- Delete customer with safety prompt.

### 3. Products & Plans
- Create monthly or yearly subscription pricing tiers.
- Displays plans in modern SaaS pricing cards with dynamic bullet points and subscriber counters.
- Delete plans with dependency warnings if active subscribers exist.

### 4. Subscriptions
- Create subscriptions linking customers to specific plans.
- Track statuses: **Draft**, **Confirmed**, **Active**, and **Closed**.
- Automatically sets the start date and calculates next billing renewal (+1 month or +1 year).
- Checkbox option to automatically generate the initial invoice upon creation.
- Live status change dropdown directly in the subscription table.

### 5. Invoices
- Generate invoices for customers (optionally linked to a subscription).
- Tracks total amount, amount paid, and balance remaining.
- Statuses: **Paid**, **Partially Paid**, **Unpaid**, and **Overdue**.
- Filter invoices by status.
- Printable / PDF invoice template with one-click **Print / Save PDF** support.

### 6. Payments
- Record full or partial payments for pending invoices.
- "Full Balance" quick-fill button.
- Select payment methods: Credit Card, Bank Transfer (ACH), Stripe, PayPal, Cash.
- **Automatic Status Synchronization**: When a payment is recorded, the corresponding invoice is automatically updated to *Partially Paid* or *Paid*, and the Dashboard Total Revenue and Pending Payments update instantly.

### 7. Demo Data & LocalStorage
- Pre-populated with realistic customers, plans, subscriptions, invoices, and receipts.
- All actions (creating, updating, deleting) save instantly into your browser's `localStorage`.
- Includes a **"Reset Demo Data"** button in the sidebar to reset to initial factory demo state at any time.

---

## 📁 Project Structure

```
brightloop/
├── index.html     # Application layout, sidebar, pages, and modals
├── styles.css     # Professional SaaS blue & white design theme
├── app.js         # State management, LocalStorage engine, and event handlers
└── README.md      # Documentation and usage guide
```
