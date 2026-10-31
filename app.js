/**
 * BrightLoop – Subscription Management System
 * Pure Vanilla JavaScript Frontend Engine
 * Powered by browser LocalStorage
 */

// ==========================================
// 1. INITIAL DEMO DATA
// ==========================================

const DEFAULT_CUSTOMERS = [
  {
    id: "CUST-101",
    name: "Sarah Jenkins",
    email: "sarah.j@nexustech.io",
    phone: "+1 (555) 234-8901",
    company: "Nexus Technologies",
    createdAt: "2026-08-14"
  },
  {
    id: "CUST-102",
    name: "Alex Rivera",
    email: "alex@riveradesign.co",
    phone: "+1 (555) 876-4321",
    company: "Rivera Creative Studio",
    createdAt: "2026-09-02"
  },
  {
    id: "CUST-103",
    name: "Emily Chen",
    email: "echen@biovision.org",
    phone: "+1 (555) 345-6789",
    company: "BioVision Analytics",
    createdAt: "2026-09-18"
  },
  {
    id: "CUST-104",
    name: "Marcus Brody",
    email: "marcus@brodylaw.com",
    phone: "+1 (555) 908-1122",
    company: "Brody & Partners Legal",
    createdAt: "2026-10-05"
  },
  {
    id: "CUST-105",
    name: "Sophia Martinez",
    email: "sophia@cloudscale.net",
    phone: "+1 (555) 654-9870",
    company: "CloudScale Systems",
    createdAt: "2026-10-22"
  }
];

const DEFAULT_PLANS = [
  {
    id: "PLAN-STARTER",
    name: "Starter Essential",
    billingCycle: "monthly",
    price: 29.00,
    description: "Best for early freelancers and single creators",
    features: "Up to 3 Team Members, 15GB Cloud Storage, Email Support, Standard Analytics"
  },
  {
    id: "PLAN-PRO-MO",
    name: "Professional Growth",
    billingCycle: "monthly",
    price: 79.00,
    description: "Ideal for fast scaling product and marketing teams",
    features: "Up to 15 Team Members, 100GB Storage, Priority Support, Advanced Reports, API Access"
  },
  {
    id: "PLAN-PRO-YR",
    name: "Professional Annual",
    billingCycle: "yearly",
    price: 790.00,
    description: "Full professional power with 2 months free per year",
    features: "Up to 15 Team Members, Unlimited Storage, 24/7 Priority Support, Custom Domain, Dedicated Account"
  },
  {
    id: "PLAN-ENTERPRISE",
    name: "Enterprise Global",
    billingCycle: "yearly",
    price: 1990.00,
    description: "Tailored for large organizations with custom compliance",
    features: "Unlimited Seats, Dedicated Cloud Cluster, SLA 99.99%, Dedicated Manager, Custom Security Audit"
  }
];

const DEFAULT_SUBSCRIPTIONS = [
  {
    id: "SUB-801",
    customerId: "CUST-101",
    planId: "PLAN-PRO-MO",
    status: "Active",
    startDate: "2026-09-01",
    nextBillingDate: "2026-11-01",
    billingCycle: "monthly",
    amount: 79.00
  },
  {
    id: "SUB-802",
    customerId: "CUST-102",
    planId: "PLAN-STARTER",
    status: "Active",
    startDate: "2026-09-15",
    nextBillingDate: "2026-11-15",
    billingCycle: "monthly",
    amount: 29.00
  },
  {
    id: "SUB-803",
    customerId: "CUST-103",
    planId: "PLAN-PRO-YR",
    status: "Active",
    startDate: "2026-09-20",
    nextBillingDate: "2027-09-20",
    billingCycle: "yearly",
    amount: 790.00
  },
  {
    id: "SUB-804",
    customerId: "CUST-104",
    planId: "PLAN-PRO-MO",
    status: "Confirmed",
    startDate: "2026-10-10",
    nextBillingDate: "2026-11-10",
    billingCycle: "monthly",
    amount: 79.00
  },
  {
    id: "SUB-805",
    customerId: "CUST-105",
    planId: "PLAN-STARTER",
    status: "Draft",
    startDate: "2026-10-25",
    nextBillingDate: "2026-11-25",
    billingCycle: "monthly",
    amount: 29.00
  }
];

const DEFAULT_INVOICES = [
  {
    id: "INV-2001",
    subscriptionId: "SUB-803",
    customerId: "CUST-103",
    amount: 790.00,
    amountPaid: 790.00,
    issueDate: "2026-09-20",
    dueDate: "2026-10-04",
    status: "Paid",
    notes: "Professional Annual Plan subscription"
  },
  {
    id: "INV-2002",
    subscriptionId: "SUB-801",
    customerId: "CUST-101",
    amount: 79.00,
    amountPaid: 79.00,
    issueDate: "2026-10-01",
    dueDate: "2026-10-15",
    status: "Paid",
    notes: "Monthly SaaS Pro billing"
  },
  {
    id: "INV-2003",
    subscriptionId: "SUB-802",
    customerId: "CUST-102",
    amount: 29.00,
    amountPaid: 15.00,
    issueDate: "2026-10-15",
    dueDate: "2026-10-29",
    status: "Partially Paid",
    notes: "Monthly Starter renewal (Partial received)"
  },
  {
    id: "INV-2004",
    subscriptionId: "SUB-804",
    customerId: "CUST-104",
    amount: 79.00,
    amountPaid: 0.00,
    issueDate: "2026-10-10",
    dueDate: "2026-10-24",
    status: "Overdue",
    notes: "Professional plan initial invoice"
  },
  {
    id: "INV-2005",
    subscriptionId: "SUB-801",
    customerId: "CUST-101",
    amount: 79.00,
    amountPaid: 0.00,
    issueDate: "2026-10-30",
    dueDate: "2026-11-14",
    status: "Unpaid",
    notes: "Upcoming cycle renewal invoice"
  }
];

const DEFAULT_PAYMENTS = [
  {
    id: "PAY-3001",
    invoiceId: "INV-2001",
    customerId: "CUST-103",
    amount: 790.00,
    paymentMethod: "Credit Card",
    date: "2026-09-21",
    notes: "Stripe auto-charge ref: ch_39x91k"
  },
  {
    id: "PAY-3002",
    invoiceId: "INV-2002",
    customerId: "CUST-101",
    amount: 79.00,
    paymentMethod: "Bank Transfer",
    date: "2026-10-03",
    notes: "ACH Transfer Nexus Tech"
  },
  {
    id: "PAY-3003",
    invoiceId: "INV-2003",
    customerId: "CUST-102",
    amount: 15.00,
    paymentMethod: "Credit Card",
    date: "2026-10-18",
    notes: "Partial payment via card"
  }
];


// ==========================================
// 2. STORAGE ENGINE
// ==========================================

const STORAGE_KEYS = {
  CUSTOMERS: "brightloop_customers",
  PLANS: "brightloop_plans",
  SUBSCRIPTIONS: "brightloop_subscriptions",
  INVOICES: "brightloop_invoices",
  PAYMENTS: "brightloop_payments"
};

function getStorage(key, defaultData) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Storage read error:", err);
    return defaultData;
  }
}

function setStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error("Storage write error:", err);
  }
}

// Global State
let state = {
  customers: [],
  plans: [],
  subscriptions: [],
  invoices: [],
  payments: [],
  activePage: "dashboard"
};

function loadState() {
  state.customers = getStorage(STORAGE_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
  state.plans = getStorage(STORAGE_KEYS.PLANS, DEFAULT_PLANS);
  state.subscriptions = getStorage(STORAGE_KEYS.SUBSCRIPTIONS, DEFAULT_SUBSCRIPTIONS);
  state.invoices = getStorage(STORAGE_KEYS.INVOICES, DEFAULT_INVOICES);
  state.payments = getStorage(STORAGE_KEYS.PAYMENTS, DEFAULT_PAYMENTS);
}

function resetDemoData() {
  if (confirm("Reset all BrightLoop demo data to factory defaults? Any custom records will be replaced.")) {
    setStorage(STORAGE_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
    setStorage(STORAGE_KEYS.PLANS, DEFAULT_PLANS);
    setStorage(STORAGE_KEYS.SUBSCRIPTIONS, DEFAULT_SUBSCRIPTIONS);
    setStorage(STORAGE_KEYS.INVOICES, DEFAULT_INVOICES);
    setStorage(STORAGE_KEYS.PAYMENTS, DEFAULT_PAYMENTS);
    loadState();
    renderAll();
    showToast("Demo data restored to defaults!", "success");
  }
}


// ==========================================
// 3. UTILITY HELPERS
// ==========================================

function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return "$" + num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function getTodayString() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function addDaysToDate(dateStr, days) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function addMonthsToDate(dateStr, months) {
  const d = new Date(dateStr + "T00:00:00");
  d.setMonth(d.getMonth() + months);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function generateId(prefix) {
  return prefix + "-" + Math.floor(1000 + Math.random() * 9000);
}

function getCustomerById(id) {
  return state.customers.find(c => c.id === id) || { name: "Unknown Customer", email: "-", company: "-" };
}

function getPlanById(id) {
  return state.plans.find(p => p.id === id) || { name: "Custom Plan", price: 0, billingCycle: "monthly" };
}

function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type === "success" ? "toast-success" : type === "danger" ? "toast-danger" : ""}`;
  
  let iconSvg = `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  if (type === "success") {
    iconSvg = `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  } else if (type === "danger") {
    iconSvg = `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
  }

  toast.innerHTML = `${iconSvg} <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.25s ease";
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}


// ==========================================
// 4. MODAL MANAGEMENT
// ==========================================

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  // Specific preparation when opening modals
  if (modalId === "customerModal") {
    document.getElementById("customerForm").reset();
    document.getElementById("customerIdField").value = "";
    document.getElementById("customerModalTitle").textContent = "Add New Customer";
  }

  if (modalId === "subModal") {
    populateSubscriptionModalDropdowns();
    document.getElementById("subStartDate").value = getTodayString();
  }

  if (modalId === "invoiceModal") {
    populateInvoiceModalDropdowns();
    document.getElementById("invDueDate").value = addDaysToDate(getTodayString(), 14);
  }

  if (modalId === "paymentModal") {
    populatePaymentModalInvoices();
    document.getElementById("payDate").value = getTodayString();
  }

  modal.classList.add("open");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("open");
  }
}

// Click backdrop to close
window.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-backdrop")) {
    e.target.classList.remove("open");
  }
});


// ==========================================
// 5. NAVIGATION CONTROLLER
// ==========================================

const PAGE_METADATA = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Real-time overview of your subscription business",
    actionLabel: "New Customer",
    actionTarget: () => openModal("customerModal")
  },
  customers: {
    title: "Customers",
    subtitle: "Manage your client accounts and relationships",
    actionLabel: "Add Customer",
    actionTarget: () => openModal("customerModal")
  },
  plans: {
    title: "Products & Plans",
    subtitle: "Subscription pricing tiers and billing schedules",
    actionLabel: "Add New Plan",
    actionTarget: () => openModal("planModal")
  },
  subscriptions: {
    title: "Subscriptions",
    subtitle: "Customer plans, recurring statuses, and billing dates",
    actionLabel: "Create Subscription",
    actionTarget: () => openModal("subModal")
  },
  invoices: {
    title: "Invoices",
    subtitle: "Manage billings, payments due, and billing history",
    actionLabel: "Generate Invoice",
    actionTarget: () => openModal("invoiceModal")
  },
  payments: {
    title: "Payments",
    subtitle: "View and record customer receipts and transactions",
    actionLabel: "Record Payment",
    actionTarget: () => openModal("paymentModal")
  }
};

function navigateTo(pageId) {
  if (!PAGE_METADATA[pageId]) return;

  state.activePage = pageId;

  // Update Nav links
  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.toggle("active", item.getAttribute("data-page") === pageId);
  });

  // Update View containers
  document.querySelectorAll(".page-view").forEach(view => {
    view.classList.toggle("active", view.id === `view-${pageId}`);
  });

  // Update Topbar Title & Subtitle
  const meta = PAGE_METADATA[pageId];
  document.getElementById("pageTitle").textContent = meta.title;
  document.getElementById("pageSubtitle").textContent = meta.subtitle;
  document.getElementById("globalActionLabel").textContent = meta.actionLabel;

  // Close mobile sidebar if open
  document.getElementById("sidebar").classList.remove("mobile-open");

  // Re-render target page
  renderCurrentPage();
}


// ==========================================
// 6. RENDER LOGIC
// ==========================================

function renderAll() {
  renderSidebarCounts();
  renderDashboard();
  renderCustomers();
  renderPlans();
  renderSubscriptions();
  renderInvoices();
  renderPayments();
}

function renderCurrentPage() {
  renderSidebarCounts();
  switch (state.activePage) {
    case "dashboard":
      renderDashboard();
      break;
    case "customers":
      renderCustomers();
      break;
    case "plans":
      renderPlans();
      break;
    case "subscriptions":
      renderSubscriptions();
      break;
    case "invoices":
      renderInvoices();
      break;
    case "payments":
      renderPayments();
      break;
  }
}

function renderSidebarCounts() {
  document.getElementById("navCustomerCount").textContent = state.customers.length;
  document.getElementById("navPlanCount").textContent = state.plans.length;
  document.getElementById("navSubCount").textContent = state.subscriptions.length;
  document.getElementById("navInvoiceCount").textContent = state.invoices.length;
}


// ------------------------------------------
// DASHBOARD
// ------------------------------------------
function renderDashboard() {
  // 1. KPI Total Customers
  document.getElementById("kpiTotalCustomers").textContent = state.customers.length;

  // 2. KPI Active Subscriptions
  const activeSubs = state.subscriptions.filter(s => s.status === "Active");
  document.getElementById("kpiActiveSubs").textContent = activeSubs.length;
  document.getElementById("kpiTotalSubsCount").textContent = state.subscriptions.length;

  // 3. KPI Total Revenue (Collected Payments)
  const totalRev = state.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  document.getElementById("kpiTotalRevenue").textContent = formatCurrency(totalRev);

  // 4. KPI Pending Payments (Balance on unpaid/partial invoices)
  let pendingSum = 0;
  let unpaidCount = 0;
  state.invoices.forEach(inv => {
    const total = Number(inv.amount) || 0;
    const paid = Number(inv.amountPaid) || 0;
    const balance = total - paid;
    if (balance > 0) {
      pendingSum += balance;
      unpaidCount++;
    }
  });
  document.getElementById("kpiPendingPayments").textContent = formatCurrency(pendingSum);
  document.getElementById("kpiUnpaidInvoicesCount").textContent = unpaidCount;

  // Recent Subscriptions Widget
  const recentSubsTable = document.getElementById("dashboardRecentSubsTable");
  const recentSubs = [...state.subscriptions].slice(-4).reverse();

  if (recentSubs.length === 0) {
    recentSubsTable.innerHTML = `<tr><td colspan="4" class="table-empty">No subscriptions created yet</td></tr>`;
  } else {
    recentSubsTable.innerHTML = recentSubs.map(sub => {
      const cust = getCustomerById(sub.customerId);
      const plan = getPlanById(sub.planId);
      const badgeClass = getSubBadgeClass(sub.status);

      return `
        <tr>
          <td>
            <div class="table-cell-bold">${escapeHtml(cust.name)}</div>
            <span class="cell-subtext">${escapeHtml(cust.company || "Personal")}</span>
          </td>
          <td>${escapeHtml(plan.name)}</td>
          <td><strong>${formatCurrency(sub.amount)}</strong> <span class="cell-subtext">${sub.billingCycle}</span></td>
          <td><span class="status-badge ${badgeClass}">${sub.status}</span></td>
        </tr>
      `;
    }).join("");
  }

  // Recent Invoices Widget
  const recentInvoicesTable = document.getElementById("dashboardRecentInvoicesTable");
  const recentInvs = [...state.invoices].slice(-4).reverse();

  if (recentInvs.length === 0) {
    recentInvoicesTable.innerHTML = `<tr><td colspan="4" class="table-empty">No invoices generated yet</td></tr>`;
  } else {
    recentInvoicesTable.innerHTML = recentInvs.map(inv => {
      const cust = getCustomerById(inv.customerId);
      const badgeClass = getInvoiceBadgeClass(inv.status);
      const balance = (Number(inv.amount) || 0) - (Number(inv.amountPaid) || 0);

      return `
        <tr>
          <td>
            <span class="table-cell-bold">${escapeHtml(inv.id)}</span>
            <span class="cell-subtext">Due: ${formatDate(inv.dueDate)}</span>
          </td>
          <td>${escapeHtml(cust.name)}</td>
          <td>
            <strong>${formatCurrency(inv.amount)}</strong>
            ${balance > 0 ? `<span class="cell-subtext text-amber">Bal: ${formatCurrency(balance)}</span>` : `<span class="cell-subtext text-success">Paid full</span>`}
          </td>
          <td><span class="status-badge ${badgeClass}">${inv.status}</span></td>
        </tr>
      `;
    }).join("");
  }
}


// ------------------------------------------
// CUSTOMERS
// ------------------------------------------
function renderCustomers() {
  const tableBody = document.getElementById("customersTableBody");
  const query = (document.getElementById("customerSearchInput").value || "").toLowerCase().trim();

  const filtered = state.customers.filter(c => {
    return c.name.toLowerCase().includes(query) ||
           c.email.toLowerCase().includes(query) ||
           (c.company && c.company.toLowerCase().includes(query));
  });

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" class="table-empty"><div class="empty-graphic">👥</div>No customers found</td></tr>`;
    return;
  }

  tableBody.innerHTML = filtered.map(c => {
    // Count active subs for this customer
    const activeSubCount = state.subscriptions.filter(s => s.customerId === c.id && s.status === "Active").length;

    return `
      <tr>
        <td>
          <div class="table-cell-bold">${escapeHtml(c.name)}</div>
          <span class="cell-subtext">ID: ${c.id}</span>
        </td>
        <td><a href="mailto:${escapeHtml(c.email)}" class="btn-link" style="padding:0;">${escapeHtml(c.email)}</a></td>
        <td>${escapeHtml(c.phone || "-")}</td>
        <td>${escapeHtml(c.company || "-")}</td>
        <td>
          <span class="status-badge ${activeSubCount > 0 ? "badge-active" : "badge-draft"}">
            ${activeSubCount} Active
          </span>
        </td>
        <td>${formatDate(c.createdAt)}</td>
        <td class="text-right">
          <div class="action-row">
            <button class="btn btn-xs btn-outline" onclick="createSubForCustomer('${c.id}')" title="Subscribe to plan">
              + Sub
            </button>
            <button class="btn btn-xs btn-outline" onclick="createInvoiceForCustomer('${c.id}')" title="Generate invoice">
              + Inv
            </button>
            <button class="btn btn-xs btn-danger-outline" onclick="deleteCustomer('${c.id}')" title="Delete customer">
              Delete
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function deleteCustomer(customerId) {
  const customer = getCustomerById(customerId);
  const activeSubs = state.subscriptions.filter(s => s.customerId === customerId);

  let confirmMsg = `Are you sure you want to delete customer "${customer.name}"?`;
  if (activeSubs.length > 0) {
    confirmMsg += `\nWarning: This customer has ${activeSubs.length} active/linked subscriptions!`;
  }

  if (confirm(confirmMsg)) {
    state.customers = state.customers.filter(c => c.id !== customerId);
    setStorage(STORAGE_KEYS.CUSTOMERS, state.customers);
    showToast(`Customer "${customer.name}" removed`, "danger");
    renderAll();
  }
}

function createSubForCustomer(customerId) {
  openModal("subModal");
  document.getElementById("subCustomerSelect").value = customerId;
}

function createInvoiceForCustomer(customerId) {
  openModal("invoiceModal");
  document.getElementById("invCustomerSelect").value = customerId;
  triggerCustomerInvoiceChange();
}


// ------------------------------------------
// PRODUCTS & PLANS
// ------------------------------------------
function renderPlans() {
  const container = document.getElementById("plansGridContainer");

  if (state.plans.length === 0) {
    container.innerHTML = `<div class="card" style="grid-column: 1 / -1; padding: 3rem; text-align: center; color: var(--text-muted);">
      <div class="empty-graphic">📦</div>
      <h3>No Subscription Plans Yet</h3>
      <p>Create your first plan to start offering subscriptions to clients.</p>
      <button class="btn btn-primary" style="margin-top: 1rem;" onclick="openModal('planModal')">Add Plan</button>
    </div>`;
    return;
  }

  container.innerHTML = state.plans.map(p => {
    // Count active subs using this plan
    const subCount = state.subscriptions.filter(s => s.planId === p.id).length;
    const cycleLabel = p.billingCycle === "yearly" ? "/ yr" : "/ mo";
    const badgeCycle = p.billingCycle === "yearly" ? "yearly" : "monthly";

    // Split features
    const featureList = (p.features || "")
      .split(/[\n,]+/)
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const checkSvg = `<svg class="plan-feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

    return `
      <div class="plan-card">
        <span class="plan-badge-cycle ${badgeCycle}">${p.billingCycle}</span>
        <h3 class="plan-title">${escapeHtml(p.name)}</h3>
        <p class="plan-desc">${escapeHtml(p.description || "Comprehensive subscription plan package.")}</p>

        <div class="plan-price-wrap">
          <span class="plan-price-symbol">$</span>
          <span class="plan-price-num">${Number(p.price).toFixed(2)}</span>
          <span class="plan-price-period">${cycleLabel}</span>
        </div>

        <ul class="plan-features-list">
          ${featureList.length > 0 ? featureList.map(item => `
            <li class="plan-feature-item">
              ${checkSvg}
              <span>${escapeHtml(item)}</span>
            </li>
          `).join("") : `
            <li class="plan-feature-item">
              ${checkSvg}
              <span>Full feature access included</span>
            </li>
          `}
        </ul>

        <div class="plan-card-footer">
          <span class="badge" style="background:var(--surface-alt); color:var(--text-secondary); font-size:0.75rem; padding: 0.35rem 0.6rem; border-radius: var(--radius-sm);">
            ${subCount} active subscribers
          </span>
          <button class="btn btn-xs btn-danger-outline" style="margin-left: auto;" onclick="deletePlan('${p.id}')">
            Delete
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function deletePlan(planId) {
  const plan = getPlanById(planId);
  const subsLinked = state.subscriptions.filter(s => s.planId === planId);

  if (subsLinked.length > 0) {
    if (!confirm(`Plan "${plan.name}" is currently used by ${subsLinked.length} subscription(s). Are you sure you want to remove it?`)) {
      return;
    }
  } else {
    if (!confirm(`Delete plan "${plan.name}"?`)) return;
  }

  state.plans = state.plans.filter(p => p.id !== planId);
  setStorage(STORAGE_KEYS.PLANS, state.plans);
  showToast(`Plan "${plan.name}" deleted`, "danger");
  renderAll();
}


// ------------------------------------------
// SUBSCRIPTIONS
// ------------------------------------------
function renderSubscriptions() {
  const tableBody = document.getElementById("subscriptionsTableBody");
  const filter = document.getElementById("subStatusFilter").value;

  let list = state.subscriptions;
  if (filter !== "ALL") {
    list = list.filter(s => s.status === filter);
  }

  if (list.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="9" class="table-empty"><div class="empty-graphic">🔄</div>No subscriptions found</td></tr>`;
    return;
  }

  tableBody.innerHTML = list.map(sub => {
    const cust = getCustomerById(sub.customerId);
    const plan = getPlanById(sub.planId);
    const badgeClass = getSubBadgeClass(sub.status);

    return `
      <tr>
        <td><strong class="table-cell-bold">${escapeHtml(sub.id)}</strong></td>
        <td>
          <div class="table-cell-bold">${escapeHtml(cust.name)}</div>
          <span class="cell-subtext">${escapeHtml(cust.company || cust.email)}</span>
        </td>
        <td>${escapeHtml(plan.name)}</td>
        <td><span class="badge" style="background:var(--surface-alt); font-size:0.72rem;">${sub.billingCycle}</span></td>
        <td><strong>${formatCurrency(sub.amount)}</strong></td>
        <td>
          <select class="form-select form-select-sm" style="width: auto; font-size:0.75rem; font-weight:600; padding:2px 6px;" onchange="updateSubStatus('${sub.id}', this.value)">
            <option value="Draft" ${sub.status === "Draft" ? "selected" : ""}>Draft</option>
            <option value="Confirmed" ${sub.status === "Confirmed" ? "selected" : ""}>Confirmed</option>
            <option value="Active" ${sub.status === "Active" ? "selected" : ""}>Active</option>
            <option value="Closed" ${sub.status === "Closed" ? "selected" : ""}>Closed</option>
          </select>
        </td>
        <td>${formatDate(sub.startDate)}</td>
        <td>${formatDate(sub.nextBillingDate)}</td>
        <td class="text-right">
          <div class="action-row">
            <button class="btn btn-xs btn-outline" onclick="generateInvoiceForSub('${sub.id}')" title="Generate Invoice">
              + Invoice
            </button>
            <button class="btn btn-xs btn-danger-outline" onclick="deleteSubscription('${sub.id}')" title="Delete Subscription">
              Delete
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function updateSubStatus(subId, newStatus) {
  const sub = state.subscriptions.find(s => s.id === subId);
  if (sub) {
    sub.status = newStatus;
    setStorage(STORAGE_KEYS.SUBSCRIPTIONS, state.subscriptions);
    showToast(`Subscription ${subId} marked as ${newStatus}`, "success");
    renderDashboard();
    renderSubscriptions();
  }
}

function deleteSubscription(subId) {
  if (confirm(`Delete subscription "${subId}"?`)) {
    state.subscriptions = state.subscriptions.filter(s => s.id !== subId);
    setStorage(STORAGE_KEYS.SUBSCRIPTIONS, state.subscriptions);
    showToast(`Subscription ${subId} deleted`, "danger");
    renderAll();
  }
}

function generateInvoiceForSub(subId) {
  const sub = state.subscriptions.find(s => s.id === subId);
  if (!sub) return;

  openModal("invoiceModal");
  document.getElementById("invCustomerSelect").value = sub.customerId;
  triggerCustomerInvoiceChange();
  document.getElementById("invSubSelect").value = sub.id;
  document.getElementById("invAmount").value = Number(sub.amount).toFixed(2);
}

function getSubBadgeClass(status) {
  switch (status) {
    case "Active": return "badge-active";
    case "Confirmed": return "badge-confirmed";
    case "Draft": return "badge-draft";
    case "Closed": return "badge-closed";
    default: return "badge-draft";
  }
}


// ------------------------------------------
// INVOICES
// ------------------------------------------
function renderInvoices() {
  const tableBody = document.getElementById("invoicesTableBody");
  const filter = document.getElementById("invoiceStatusFilter").value;

  let list = state.invoices;
  if (filter !== "ALL") {
    list = list.filter(i => i.status === filter);
  }

  if (list.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="9" class="table-empty"><div class="empty-graphic">🧾</div>No invoices found</td></tr>`;
    return;
  }

  tableBody.innerHTML = list.map(inv => {
    const cust = getCustomerById(inv.customerId);
    const badgeClass = getInvoiceBadgeClass(inv.status);
    const total = Number(inv.amount) || 0;
    const paid = Number(inv.amountPaid) || 0;
    const balance = total - paid;

    return `
      <tr>
        <td>
          <span class="table-cell-bold">${escapeHtml(inv.id)}</span>
          ${inv.subscriptionId ? `<span class="cell-subtext">${escapeHtml(inv.subscriptionId)}</span>` : ""}
        </td>
        <td>
          <div class="table-cell-bold">${escapeHtml(cust.name)}</div>
          <span class="cell-subtext">${escapeHtml(cust.company || cust.email)}</span>
        </td>
        <td>${formatDate(inv.issueDate)}</td>
        <td>${formatDate(inv.dueDate)}</td>
        <td><strong>${formatCurrency(total)}</strong></td>
        <td class="text-success">${formatCurrency(paid)}</td>
        <td class="${balance > 0 ? "text-amber" : "text-muted"}">
          <strong>${formatCurrency(balance)}</strong>
        </td>
        <td><span class="status-badge ${badgeClass}">${inv.status}</span></td>
        <td class="text-right">
          <div class="action-row">
            ${balance > 0 ? `
              <button class="btn btn-xs btn-primary" onclick="payInvoiceDirectly('${inv.id}')" title="Pay this invoice">
                Pay
              </button>
            ` : ""}
            <button class="btn btn-xs btn-outline" onclick="viewInvoiceDetails('${inv.id}')" title="View printable invoice">
              View
            </button>
            <button class="btn btn-xs btn-danger-outline" onclick="deleteInvoice('${inv.id}')" title="Delete invoice">
              Delete
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function getInvoiceBadgeClass(status) {
  switch (status) {
    case "Paid": return "badge-paid";
    case "Partially Paid": return "badge-partial";
    case "Unpaid": return "badge-unpaid";
    case "Overdue": return "badge-overdue";
    default: return "badge-unpaid";
  }
}

function payInvoiceDirectly(invoiceId) {
  openModal("paymentModal");
  document.getElementById("payInvoiceSelect").value = invoiceId;
  triggerPaymentInvoiceChange();
}

function deleteInvoice(invId) {
  if (confirm(`Delete invoice ${invId}?`)) {
    state.invoices = state.invoices.filter(i => i.id !== invId);
    setStorage(STORAGE_KEYS.INVOICES, state.invoices);
    showToast(`Invoice ${invId} removed`, "danger");
    renderAll();
  }
}

function viewInvoiceDetails(invId) {
  const inv = state.invoices.find(i => i.id === invId);
  if (!inv) return;

  const cust = getCustomerById(inv.customerId);
  const total = Number(inv.amount) || 0;
  const paid = Number(inv.amountPaid) || 0;
  const balance = total - paid;
  const sub = state.subscriptions.find(s => s.id === inv.subscriptionId);
  const plan = sub ? getPlanById(sub.planId) : null;

  const html = `
    <div class="invoice-preview-header">
      <div>
        <div class="inv-brand">BrightLoop</div>
        <div class="inv-company-sub">Subscription Management System</div>
        <div class="inv-company-sub">billing@brightloop.local • +1 (800) 555-0199</div>
      </div>
      <div class="inv-meta-right">
        <div class="inv-number-big">INVOICE ${escapeHtml(inv.id)}</div>
        <div class="inv-dates">Issue Date: <strong>${formatDate(inv.issueDate)}</strong></div>
        <div class="inv-dates">Due Date: <strong>${formatDate(inv.dueDate)}</strong></div>
        <div style="margin-top: 0.5rem;"><span class="status-badge ${getInvoiceBadgeClass(inv.status)}">${inv.status}</span></div>
      </div>
    </div>

    <div class="invoice-parties">
      <div class="inv-party-col">
        <h4>Billed To:</h4>
        <div class="name">${escapeHtml(cust.name)}</div>
        <div class="detail">${escapeHtml(cust.company || "")}</div>
        <div class="detail">${escapeHtml(cust.email)}</div>
        <div class="detail">${escapeHtml(cust.phone || "")}</div>
      </div>
      <div class="inv-party-col" style="text-align: right;">
        <h4>Payment Terms:</h4>
        <div class="detail">Due on receipt (Net 14)</div>
        ${inv.subscriptionId ? `<div class="detail">Linked Subscription: <strong>${escapeHtml(inv.subscriptionId)}</strong></div>` : ""}
      </div>
    </div>

    <table class="data-table" style="margin-top: 1rem;">
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align: center;">Qty</th>
          <th class="text-right">Unit Price</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>${plan ? escapeHtml(plan.name) : "Subscription Service"}</strong>
            <div class="cell-subtext">${escapeHtml(inv.notes || "Recurring software subscription access")}</div>
          </td>
          <td style="text-align: center;">1</td>
          <td class="text-right">${formatCurrency(total)}</td>
          <td class="text-right"><strong>${formatCurrency(total)}</strong></td>
        </tr>
      </tbody>
    </table>

    <div class="inv-calc-box">
      <div class="calc-row">
        <span>Subtotal:</span>
        <span>${formatCurrency(total)}</span>
      </div>
      <div class="calc-row">
        <span>Tax (0%):</span>
        <span>$0.00</span>
      </div>
      <div class="calc-row grand-total">
        <span>Total Due:</span>
        <span>${formatCurrency(total)}</span>
      </div>
      <div class="calc-row" style="color: var(--success); font-weight:600;">
        <span>Amount Paid:</span>
        <span>-${formatCurrency(paid)}</span>
      </div>
      <div class="calc-row balance-due">
        <span>Balance Remaining:</span>
        <span>${formatCurrency(balance)}</span>
      </div>
    </div>
  `;

  document.getElementById("invoicePrintableArea").innerHTML = html;
  openModal("viewInvoiceModal");
}


// ------------------------------------------
// PAYMENTS
// ------------------------------------------
function renderPayments() {
  const tableBody = document.getElementById("paymentsTableBody");

  if (state.payments.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" class="table-empty"><div class="empty-graphic">💳</div>No payments recorded yet</td></tr>`;
    return;
  }

  const sorted = [...state.payments].reverse();

  tableBody.innerHTML = sorted.map(pay => {
    const cust = getCustomerById(pay.customerId);

    return `
      <tr>
        <td><strong class="table-cell-bold">${escapeHtml(pay.id)}</strong></td>
        <td>${formatDate(pay.date)}</td>
        <td>
          <div class="table-cell-bold">${escapeHtml(cust.name)}</div>
          <span class="cell-subtext">${escapeHtml(cust.company || "")}</span>
        </td>
        <td><span class="badge" style="background:var(--surface-alt); font-weight:600;">${escapeHtml(pay.invoiceId)}</span></td>
        <td>
          <span style="display:inline-flex; align-items:center; gap:0.35rem;">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
            ${escapeHtml(pay.paymentMethod)}
          </span>
          ${pay.notes ? `<span class="cell-subtext">${escapeHtml(pay.notes)}</span>` : ""}
        </td>
        <td><strong class="text-success">${formatCurrency(pay.amount)}</strong></td>
        <td><span class="status-badge badge-active">Completed</span></td>
      </tr>
    `;
  }).join("");
}


// ==========================================
// 7. FORM SUBMISSIONS & ACTIONS
// ==========================================

// Form: Add Customer
document.getElementById("customerForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("custName").value.trim();
  const email = document.getElementById("custEmail").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const company = document.getElementById("custCompany").value.trim();

  const newCust = {
    id: generateId("CUST"),
    name,
    email,
    phone,
    company,
    createdAt: getTodayString()
  };

  state.customers.push(newCust);
  setStorage(STORAGE_KEYS.CUSTOMERS, state.customers);

  closeModal("customerModal");
  showToast(`Customer "${name}" added successfully!`, "success");
  renderAll();
});

// Form: Add Plan
document.getElementById("planForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("planName").value.trim();
  const billingCycle = document.getElementById("planCycle").value;
  const price = parseFloat(document.getElementById("planPrice").value) || 0;
  const description = document.getElementById("planDesc").value.trim();
  const features = document.getElementById("planFeatures").value.trim();

  const newPlan = {
    id: generateId("PLAN"),
    name,
    billingCycle,
    price,
    description,
    features
  };

  state.plans.push(newPlan);
  setStorage(STORAGE_KEYS.PLANS, state.plans);

  closeModal("planModal");
  document.getElementById("planForm").reset();
  showToast(`Plan "${name}" created successfully!`, "success");
  renderAll();
});

// Form: Create Subscription
document.getElementById("subForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const customerId = document.getElementById("subCustomerSelect").value;
  const planId = document.getElementById("subPlanSelect").value;
  const status = document.getElementById("subStatusSelect").value;
  const startDate = document.getElementById("subStartDate").value;
  const autoInvoice = document.getElementById("subAutoInvoice").checked;

  const plan = getPlanById(planId);
  const nextBilling = plan.billingCycle === "yearly" ? addMonthsToDate(startDate, 12) : addMonthsToDate(startDate, 1);

  const newSubId = generateId("SUB");
  const newSub = {
    id: newSubId,
    customerId,
    planId,
    status,
    startDate,
    nextBillingDate: nextBilling,
    billingCycle: plan.billingCycle,
    amount: plan.price
  };

  state.subscriptions.push(newSub);
  setStorage(STORAGE_KEYS.SUBSCRIPTIONS, state.subscriptions);

  // Automatically create initial invoice if selected
  if (autoInvoice) {
    const newInvId = generateId("INV");
    const newInv = {
      id: newInvId,
      subscriptionId: newSubId,
      customerId,
      amount: plan.price,
      amountPaid: 0.00,
      issueDate: startDate,
      dueDate: addDaysToDate(startDate, 14),
      status: "Unpaid",
      notes: `Initial invoice for ${plan.name} (${plan.billingCycle})`
    };
    state.invoices.push(newInv);
    setStorage(STORAGE_KEYS.INVOICES, state.invoices);
  }

  closeModal("subModal");
  showToast(`Subscription created for ${getCustomerById(customerId).name}!`, "success");
  renderAll();
});

// Form: Generate Invoice
document.getElementById("invoiceForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const customerId = document.getElementById("invCustomerSelect").value;
  const subscriptionId = document.getElementById("invSubSelect").value || null;
  const amount = parseFloat(document.getElementById("invAmount").value) || 0;
  const dueDate = document.getElementById("invDueDate").value;
  const notes = document.getElementById("invNotes").value.trim();

  const newInvId = generateId("INV");
  const newInv = {
    id: newInvId,
    subscriptionId,
    customerId,
    amount,
    amountPaid: 0.00,
    issueDate: getTodayString(),
    dueDate,
    status: "Unpaid",
    notes: notes || "Subscription billing invoice"
  };

  state.invoices.push(newInv);
  setStorage(STORAGE_KEYS.INVOICES, state.invoices);

  closeModal("invoiceModal");
  showToast(`Invoice ${newInvId} generated for ${formatCurrency(amount)}!`, "success");
  renderAll();
});

// Form: Record Payment
document.getElementById("paymentForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const invoiceId = document.getElementById("payInvoiceSelect").value;
  const amount = parseFloat(document.getElementById("payAmount").value) || 0;
  const paymentMethod = document.getElementById("payMethod").value;
  const date = document.getElementById("payDate").value;
  const notes = document.getElementById("payNotes").value.trim();

  const invoice = state.invoices.find(i => i.id === invoiceId);
  if (!invoice) {
    alert("Please select a valid invoice.");
    return;
  }

  const currentPaid = Number(invoice.amountPaid) || 0;
  const totalAmount = Number(invoice.amount) || 0;
  const remaining = totalAmount - currentPaid;

  if (amount <= 0) {
    alert("Payment amount must be greater than zero.");
    return;
  }

  if (amount > remaining + 0.001) {
    if (!confirm(`The entered payment ($${amount}) exceeds the remaining balance ($${remaining.toFixed(2)}). Do you still want to proceed?`)) {
      return;
    }
  }

  // 1. Create Payment Record
  const newPayId = generateId("PAY");
  const newPayment = {
    id: newPayId,
    invoiceId,
    customerId: invoice.customerId,
    amount,
    paymentMethod,
    date,
    notes
  };

  state.payments.push(newPayment);
  setStorage(STORAGE_KEYS.PAYMENTS, state.payments);

  // 2. Update Invoice Status & Paid Amount
  const newAmountPaid = currentPaid + amount;
  invoice.amountPaid = newAmountPaid;

  if (newAmountPaid >= totalAmount) {
    invoice.status = "Paid";
  } else if (newAmountPaid > 0) {
    invoice.status = "Partially Paid";
  } else {
    invoice.status = "Unpaid";
  }
  setStorage(STORAGE_KEYS.INVOICES, state.invoices);

  closeModal("paymentModal");
  showToast(`Recorded payment of ${formatCurrency(amount)} for ${invoiceId}!`, "success");
  renderAll();
});


// ==========================================
// 8. DROPDOWN POPULATORS & EVENT HANDLERS
// ==========================================

function populateSubscriptionModalDropdowns() {
  const custSelect = document.getElementById("subCustomerSelect");
  const planSelect = document.getElementById("subPlanSelect");

  custSelect.innerHTML = state.customers.map(c => `
    <option value="${c.id}">${escapeHtml(c.name)} (${escapeHtml(c.company || c.email)})</option>
  `).join("");

  planSelect.innerHTML = state.plans.map(p => `
    <option value="${p.id}">${escapeHtml(p.name)} - ${formatCurrency(p.price)} / ${p.billingCycle}</option>
  `).join("");
}

function populateInvoiceModalDropdowns() {
  const custSelect = document.getElementById("invCustomerSelect");
  custSelect.innerHTML = state.customers.map(c => `
    <option value="${c.id}">${escapeHtml(c.name)} (${escapeHtml(c.company || c.email)})</option>
  `).join("");

  triggerCustomerInvoiceChange();
}

function triggerCustomerInvoiceChange() {
  const custId = document.getElementById("invCustomerSelect").value;
  const subSelect = document.getElementById("invSubSelect");
  const amountInput = document.getElementById("invAmount");

  const customerSubs = state.subscriptions.filter(s => s.customerId === custId);

  let optionsHtml = `<option value="">-- No specific subscription --</option>`;
  customerSubs.forEach(s => {
    const plan = getPlanById(s.planId);
    optionsHtml += `<option value="${s.id}" data-amount="${s.amount}">${escapeHtml(s.id)} - ${escapeHtml(plan.name)} (${formatCurrency(s.amount)})</option>`;
  });
  subSelect.innerHTML = optionsHtml;

  // Auto-fill amount if subscription selected
  if (customerSubs.length > 0) {
    subSelect.value = customerSubs[0].id;
    amountInput.value = Number(customerSubs[0].amount).toFixed(2);
  } else {
    amountInput.value = "";
  }
}

document.getElementById("invCustomerSelect").addEventListener("change", triggerCustomerInvoiceChange);
document.getElementById("invSubSelect").addEventListener("change", (e) => {
  const selected = e.target.options[e.target.selectedIndex];
  if (selected && selected.getAttribute("data-amount")) {
    document.getElementById("invAmount").value = Number(selected.getAttribute("data-amount")).toFixed(2);
  }
});

function populatePaymentModalInvoices() {
  const select = document.getElementById("payInvoiceSelect");
  
  // Show unpaid, partially paid or overdue invoices
  const pendingInvoices = state.invoices.filter(i => {
    const total = Number(i.amount) || 0;
    const paid = Number(i.amountPaid) || 0;
    return (total - paid) > 0;
  });

  if (pendingInvoices.length === 0) {
    select.innerHTML = `<option value="">No pending invoices available</option>`;
    document.getElementById("payInvoiceInfoBanner").style.display = "none";
    document.getElementById("payAmount").value = "";
    return;
  }

  select.innerHTML = pendingInvoices.map(i => {
    const cust = getCustomerById(i.customerId);
    const balance = (Number(i.amount) || 0) - (Number(i.amountPaid) || 0);
    return `<option value="${i.id}">${escapeHtml(i.id)} - ${escapeHtml(cust.name)} (Bal: ${formatCurrency(balance)})</option>`;
  }).join("");

  triggerPaymentInvoiceChange();
}

function triggerPaymentInvoiceChange() {
  const invoiceId = document.getElementById("payInvoiceSelect").value;
  const invoice = state.invoices.find(i => i.id === invoiceId);
  const banner = document.getElementById("payInvoiceInfoBanner");

  if (!invoice) {
    banner.style.display = "none";
    return;
  }

  const cust = getCustomerById(invoice.customerId);
  const total = Number(invoice.amount) || 0;
  const paid = Number(invoice.amountPaid) || 0;
  const balance = total - paid;

  document.getElementById("payBannerCustomer").textContent = `${cust.name} (${cust.company || cust.email})`;
  document.getElementById("payBannerTotal").textContent = formatCurrency(total);
  document.getElementById("payBannerBalance").textContent = formatCurrency(balance);
  document.getElementById("payAmount").value = balance.toFixed(2);

  banner.style.display = "block";
}

document.getElementById("payInvoiceSelect").addEventListener("change", triggerPaymentInvoiceChange);

// "Full Balance" shortcut button
document.getElementById("payFullBtn").addEventListener("click", () => {
  const invoiceId = document.getElementById("payInvoiceSelect").value;
  const invoice = state.invoices.find(i => i.id === invoiceId);
  if (invoice) {
    const balance = (Number(invoice.amount) || 0) - (Number(invoice.amountPaid) || 0);
    document.getElementById("payAmount").value = balance.toFixed(2);
  }
});

// Print Invoice Button
document.getElementById("printInvoiceBtn").addEventListener("click", () => {
  window.print();
});

// Global Topbar Action Button
document.getElementById("globalActionBtn").addEventListener("click", () => {
  const meta = PAGE_METADATA[state.activePage];
  if (meta && typeof meta.actionTarget === "function") {
    meta.actionTarget();
  }
});

// Reset Demo Data Button
document.getElementById("resetDemoBtn").addEventListener("click", resetDemoData);

// Customer Search Realtime Filter
document.getElementById("customerSearchInput").addEventListener("input", renderCustomers);

// Subscriptions & Invoices Filters
document.getElementById("subStatusFilter").addEventListener("change", renderSubscriptions);
document.getElementById("invoiceStatusFilter").addEventListener("change", renderInvoices);

// Mobile Sidebar Toggle
document.getElementById("mobileMenuBtn").addEventListener("click", () => {
  document.getElementById("sidebar").classList.add("mobile-open");
});
document.getElementById("mobileCloseBtn").addEventListener("click", () => {
  document.getElementById("sidebar").classList.remove("mobile-open");
});

// Navigation Click Handlers
document.querySelectorAll(".nav-item").forEach(btn => {
  btn.addEventListener("click", () => {
    const page = btn.getAttribute("data-page");
    if (page) navigateTo(page);
  });
});

// Helper for HTML escaping
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


// ==========================================
// 9. APP INITIALIZATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  loadState();
  navigateTo("dashboard");
  renderAll();
});
