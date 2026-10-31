/* Brightloop dashboard — front-end demo (all data lives in the browser) */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const initials = n => n.trim().split(/\s+/).slice(0, 2).map(x => x[0]).join('').toUpperCase();
const sleep = ms => new Promise(r => setTimeout(r, ms));
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k) ?? sessionStorage.getItem(k)); } catch { return null; } },
  set(k, v, persist = true) { try { (persist ? localStorage : sessionStorage).setItem(k, JSON.stringify(v)); } catch {} },
  del(k) { try { localStorage.removeItem(k); sessionStorage.removeItem(k); } catch {} }
};

/* ---------- toast, modals, popup menu ---------- */
const toast = $('#toast'); let toastTimer;
function showToast(m) {
  $('#toastMessage').textContent = m; toast.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}
let lastFocus;
function openB(el, focusSel) {
  lastFocus = document.activeElement; closeMenu();
  el.classList.add('open'); el.setAttribute('aria-hidden', 'false');
  setTimeout(() => $(focusSel || 'input,select,button', el)?.focus(), 60);
}
function closeB(el) { el.classList.remove('open'); el.setAttribute('aria-hidden', 'true'); lastFocus?.focus?.(); }
$$('.modal-backdrop').forEach(b => b.addEventListener('click', e => { if (e.target === b) closeB(b); }));
$$('[data-close]').forEach(x => x.addEventListener('click', () => closeB(x.closest('.modal-backdrop'))));
function openInfo(title, sub, html) {
  $('#infoTitle').textContent = title; $('#infoSub').textContent = sub || ''; $('#infoBody').innerHTML = html;
  openB($('#infoBackdrop'), '.btn-primary');
}

const pop = $('#popMenu'); let menuAnchor = null;
function closeMenu() { pop.hidden = true; pop.innerHTML = ''; menuAnchor = null; }
function openMenu(anchor, items, title) {
  if (menuAnchor === anchor) return closeMenu();
  anchor.setAttribute('data-menu', '');
  pop.innerHTML = (title ? `<div class="menu-title">${esc(title)}</div>` : '') + items.map((it, i) =>
    it.sep ? '<hr>' : it.head ? `<div class="menu-title">${esc(it.head)}</div>` :
    `<button class="menu-item${it.danger ? ' danger' : ''}${it.on ? ' on' : ''}" role="menuitem" data-i="${i}">${it.icon ? `<span>${it.icon}</span>` : ''}${esc(it.label)}${it.on ? '<b>✓</b>' : ''}${it.dot ? '<i class="udot"></i>' : ''}</button>`).join('');
  pop._items = items; pop.hidden = false; menuAnchor = anchor;
  const r = anchor.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight;
  pop.style.top = Math.max(8, Math.min(r.bottom + 6, innerHeight - h - 8)) + 'px';
  pop.style.left = Math.max(8, Math.min(r.right - w, innerWidth - w - 8)) + 'px';
  $('.menu-item', pop)?.focus();
}
pop.addEventListener('click', e => {
  const b = e.target.closest('.menu-item'); if (!b) return;
  const it = pop._items[b.dataset.i]; closeMenu(); it.fn?.();
});
document.addEventListener('click', e => {
  if (!pop.hidden && !pop.contains(e.target) && !e.target.closest('[data-menu]')) closeMenu();
  if ($('#sidebar').classList.contains('open') && !e.target.closest('#sidebar,#mobileMenu')) $('#sidebar').classList.remove('open');
});
addEventListener('resize', closeMenu);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeMenu(); $$('.modal-backdrop.open').forEach(closeB); }
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); $('#globalSearch').focus(); }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role=button],[role=link],th[data-sort]')) { e.preventDefault(); e.target.click(); }
});

/* ---------- theme ---------- */
const mq = matchMedia('(prefers-color-scheme: dark)');
let themePref = store.get('bl_theme') || 'system';
const isDark = () => themePref === 'dark' || (themePref === 'system' && mq.matches);
function applyTheme(animate) {
  const root = document.documentElement;
  if (animate) { root.classList.add('theme-anim'); setTimeout(() => root.classList.remove('theme-anim'), 350); }
  root.dataset.theme = isDark() ? 'dark' : 'light';
  const b = $('#themeBtn'), d = isDark();
  b.textContent = d ? '☀' : '☾'; b.setAttribute('aria-label', d ? 'Switch to light mode' : 'Switch to dark mode'); b.title = d ? 'Switch to light mode' : 'Switch to dark mode';
  $('meta[name=theme-color]').content = d ? '#0d1020' : '#10172a';
}
function setTheme(pref, notify) { themePref = pref; store.set('bl_theme', pref); applyTheme(true); if (notify) showToast(`Theme: ${pref === 'system' ? 'matches your device' : pref}`); }
$('#themeBtn').addEventListener('click', () => setTheme(isDark() ? 'light' : 'dark'));
mq.addEventListener?.('change', () => themePref === 'system' && applyTheme(true));

/* ---------- data ---------- */
const PLANS = {
  Starter: { price: 799, cycle: 'Monthly', feat: '3 seats · 1 project · Email support' },
  Professional: { price: 2499, cycle: 'Monthly', feat: '15 seats · Unlimited projects · Priority support' },
  Business: { price: 24000, cycle: 'Yearly', feat: '50 seats · SSO · Advanced analytics' },
  Enterprise: { price: 84000, cycle: 'Yearly', feat: 'Unlimited seats · Dedicated manager · SLA' }
};
const PCOL = { Starter: '#4bc8a0', Professional: '#5398ef', Business: '#6c5ce7', Enterprise: '#f2b36b' };
const UNIT = { Yearly: 'year', Monthly: 'month', Weekly: 'week', Daily: 'day' };
const avClasses = ['ca-lilac', 'ca-peach', 'ca-blue', 'ca-mint', 'ca-yellow', 'ca-rose'];
const avFor = s => avClasses[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 6];
const today = new Date();
const fmtD = d => d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const inr = n => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const inr0 = n => '₹' + Math.round(n).toLocaleString('en-IN');
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
function nextDate(start, cycle) {
  const n = new Date(start);
  if (cycle === 'Yearly') n.setFullYear(n.getFullYear() + 1); else if (cycle === 'Monthly') n.setMonth(n.getMonth() + 1);
  else if (cycle === 'Weekly') n.setDate(n.getDate() + 7); else n.setDate(n.getDate() + 1);
  return n;
}
const nextFor = s => s.status === 'Cancelled' ? null : s.status === 'Past due' ? addDays(s.base, 3) : s.status === 'Trial' ? addDays(s.base, 30) : nextDate(s.base, s.cycle);
function mk(id, customer, email, plan, cycle, amount, created, status) {
  const s = { id, customer, email, plan, cycle, amount, created, base: created, status, av: avFor(email) }; s.next = nextFor(s); return s;
}
const subs = [
  ['Nikhil Kapoor', 'nikhil@acme.co', 'Business', 'Yearly', 24000, 28, 'Active'],
  ['Ananya Sharma', 'ananya@studio.in', 'Professional', 'Monthly', 2499, 27, 'Active'],
  ['Rahul Verma', 'rahul@verma.tech', 'Starter', 'Monthly', 799, 26, 'Past due'],
  ['Priya Desai', 'priya@northstar.io', 'Enterprise', 'Yearly', 84000, 25, 'Trial'],
  ['Karan Mehta', 'karan@mehta.design', 'Professional', 'Monthly', 2499, 24, 'Active'],
  ['Sneha Iyer', 'sneha@pixelworks.in', 'Starter', 'Monthly', 799, 23, 'Cancelled']
].map((r, i) => mk('SUB-2026-' + (1284 - i), r[0], r[1], r[2], r[3], r[4], new Date(2026, 9, r[5], 12), r[6]));
{
  const F = ['Aarav', 'Diya', 'Vihaan', 'Isha', 'Kabir', 'Meera', 'Arjun', 'Tara', 'Rohan', 'Nisha', 'Dev', 'Kavya'];
  const L = ['Nair', 'Gupta', 'Rao', 'Joshi', 'Bose', 'Menon', 'Khanna', 'Patil', 'Reddy', 'Singh', 'Shah', 'Pillai'];
  const dom = ['cloudmint.io', 'orbit.co', 'lumen.in', 'tidal.dev', 'kite.studio', 'harbor.app'];
  const keys = Object.keys(PLANS), st = ['Active', 'Active', 'Trial', 'Active', 'Past due', 'Active', 'Cancelled', 'Active', 'Active'];
  for (let i = 0; i < 54; i++) {
    const f = F[i % 12], l = L[(i * 5 + 3) % 12], p = keys[(i * 5 + 1) % 4];
    subs.push(mk('SUB-2026-' + (1278 - i), `${f} ${l}`, `${f}.${l}@${dom[i % 6]}`.toLowerCase(), p, PLANS[p].cycle, PLANS[p].price, new Date(2026, 9, 22 - i, 12), st[i % 9]));
  }
}
let subCounter = 1285;
const monthly = s => s.amount * ({ Yearly: 1 / 12, Monthly: 1, Weekly: 52 / 12, Daily: 365 / 12 }[s.cycle]);
const STATUS_CLS = { Active: 'status-active', Paid: 'status-active', Succeeded: 'status-active', Trial: 'status-trial', Pending: 'status-trial', 'Past due': 'status-overdue', Overdue: 'status-overdue', Failed: 'status-overdue', Cancelled: 'status-cancelled', Void: 'status-cancelled', Paused: 'status-cancelled' };
const chip = st => `<span class="status ${STATUS_CLS[st] || 'status-active'}"><i></i>${esc(st)}</span>`;

/* ---------- roles, members, workspace settings ---------- */
const ROLE_LABEL = { admin: 'Administrator', developer: 'Developer', user: 'User' };
const DEFAULT_MEMBERS = [
  { name: 'Alex Morgan', email: 'alex@brightloop.com', role: 'admin', tier: 'Pro' }, { name: 'Dev Patel', email: 'dev@brightloop.com', role: 'developer', tier: 'Pro' },
  { name: 'Maya Rao', email: 'user@brightloop.com', role: 'user', tier: 'Pro' }, { name: 'Sam Joshi', email: 'sam@brightloop.com', role: 'user', tier: 'Normal' },
  { name: 'Isha Nair', email: 'isha@brightloop.com', role: 'user', tier: 'Normal' }, { name: 'Rohan Shah', email: 'rohan@brightloop.com', role: 'developer', tier: 'Normal' }
];
const members = store.get('bl_members') || DEFAULT_MEMBERS.map(m => ({ ...m }));
const cfg = Object.assign({ ws: 'Brightloop Software', tier: 'Normal', export: true }, store.get('bl_cfg'));
const saveMembers = () => store.set('bl_members', members);
const roleOf = u => members.find(m => m.email === u.email)?.role || 'user';
const tierOf = u => members.find(m => m.email === u.email)?.tier || 'Normal';
const role = () => user ? roleOf(user) : 'guest';
const isAdmin = () => role() === 'admin';
const needAdmin = what => isAdmin() || (showToast(user ? `Only admins can ${what}` : `Log in as an admin to ${what}`), false);
const canExport = () => ['admin', 'developer'].includes(role()) || cfg.export || (showToast('Exports are turned off for your role. Ask an admin.'), false);
const persisted = () => { try { return localStorage.getItem('bl_user') !== null; } catch { return true; } };
const ADMIN_SET = () => `<div class="full admin-block"><h3>Admin settings</h3></div>
<label class="form-field full">Workspace name<input name="ws" value="${esc(cfg.ws)}"></label>
<label class="form-field">Default plan for new members<select name="tier"><option${cfg.tier === 'Normal' ? ' selected' : ''}>Normal</option><option${cfg.tier === 'Pro' ? ' selected' : ''}>Pro</option></select></label>
<label class="form-field check-line" style="align-self:end"><input type="checkbox" name="export" ${cfg.export ? 'checked' : ''}> Let users export CSV files</label>`;
/* developer tools */
const genKey = p => 'bl_' + p + '_' + [...crypto.getRandomValues(new Uint8Array(12))].map(b => b.toString(16).padStart(2, '0')).join('');
const EVENTS = ['subscription.created', 'subscription.cancelled', 'payment.failed', 'invoice.paid'];
const devCfg = () => { let d = store.get('bl_dev'); if (!d) { d = { env: 'sandbox', keys: { sandbox: genKey('test'), live: genKey('live') }, hook: '', events: {} }; store.set('bl_dev', d); } return d; };
let devReveal = false, devTab = 'cURL'; const devLog = [];
const SNIP = {
  cURL: `curl https://api.brightloop.app/v1/subscriptions \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"customer":"Aditi Sharma","email":"aditi@company.com","plan":"Professional","cycle":"Monthly","amount":2499}'`,
  JavaScript: `const res = await fetch("https://api.brightloop.app/v1/subscriptions", {\n  method: "POST",\n  headers: { "Authorization": "Bearer YOUR_API_KEY", "Content-Type": "application/json" },\n  body: JSON.stringify({ customer: "Aditi Sharma", email: "aditi@company.com", plan: "Professional", cycle: "Monthly", amount: 2499 })\n});\nconsole.log(await res.json());`,
  Python: `import requests\n\nres = requests.post(\n    "https://api.brightloop.app/v1/subscriptions",\n    headers={"Authorization": "Bearer YOUR_API_KEY"},\n    json={"customer": "Aditi Sharma", "email": "aditi@company.com", "plan": "Professional", "cycle": "Monthly", "amount": 2499},\n)\nprint(res.json())`
};
const copyText = t => navigator.clipboard ? navigator.clipboard.writeText(t).then(() => showToast('Copied to clipboard'), () => showToast('Copy failed. Select the text and copy it manually.')) : showToast('Copy is not available in this browser');

/* ---------- subscriptions table ---------- */
const PER = 6;
const state = { q: '', status: 'All', plan: 'All', cycle: 'All', page: 1, sort: { k: 'id', d: -1 }, sel: new Set() };
const sortVal = { id: s => +s.id.split('-')[2], customer: s => s.customer.toLowerCase(), plan: s => s.plan, amount: s => s.amount, next: s => s.next ? +s.next : 0, status: s => s.status };
function filtered() {
  const q = state.q.trim().toLowerCase();
  return subs.filter(s => (state.status === 'All' || s.status === state.status) && (state.plan === 'All' || s.plan === state.plan) && (state.cycle === 'All' || s.cycle === state.cycle) &&
    (!q || [s.id, s.customer, s.email, s.plan, s.cycle, s.status].join(' ').toLowerCase().includes(q)))
    .sort((a, b) => { const x = sortVal[state.sort.k](a), y = sortVal[state.sort.k](b); return (x > y ? 1 : x < y ? -1 : 0) * state.sort.d; });
}
function rowHTML(s) {
  return `<tr data-id="${s.id}" data-status="${s.status}"><td><input type="checkbox" class="row-check" aria-label="Select ${s.id}" ${state.sel.has(s.id) ? 'checked' : ''}></td>
<td><a class="sub-id" href="#">${s.id}</a><small>Created ${fmtD(s.created)}</small></td>
<td><div class="customer-cell"><span class="customer-avatar ${s.av}">${esc(initials(s.customer))}</span><div><strong>${esc(s.customer)}</strong><small>${esc(s.email)}</small></div></div></td>
<td><span class="plan-name pl-${s.plan}">${esc(s.plan)}</span><small>${s.cycle} billing</small></td>
<td class="amount">${inr(s.amount)} <small>/ ${UNIT[s.cycle]}</small></td>
<td class="${s.status === 'Past due' ? 'overdue-date' : ''}">${fmtD(s.next)}</td><td>${chip(s.status)}</td>
<td><button class="row-more" aria-label="Subscription options" aria-haspopup="menu">•••</button></td></tr>`;
}
function renderSubs() {
  const list = filtered(), pages = Math.max(1, Math.ceil(list.length / PER));
  state.page = Math.min(Math.max(1, state.page), pages);
  const from = (state.page - 1) * PER, slice = list.slice(from, from + PER);
  $('#subscriptionRows').innerHTML = slice.length ? slice.map(rowHTML).join('') :
    '<tr><td colspan="8"><div class="empty-state">No subscriptions match your search or filters.<button class="link-btn" data-act="clear">Clear filters</button></div></td></tr>';
  $('#subCount').textContent = list.length;
  $('.nav-count').textContent = subs.length;
  $('#tableSummary').innerHTML = `Showing <strong>${slice.length ? from + 1 : 0}–${from + slice.length}</strong> of <strong>${list.length}</strong> subscriptions`;
  const nums = [...new Set([1, state.page - 1, state.page, state.page + 1, pages])].filter(n => n >= 1 && n <= pages).sort((a, b) => a - b);
  let h = `<button data-p="${state.page - 1}" ${state.page === 1 ? 'disabled' : ''} aria-label="Previous page">←</button>`, prev = 0;
  nums.forEach(n => { if (n - prev > 1) h += '<span>…</span>'; h += `<button class="page-number${n === state.page ? ' current-page' : ''}" data-p="${n}" ${n === state.page ? 'aria-current="page"' : ''}>${n}</button>`; prev = n; });
  $('#pagination').innerHTML = h + `<button data-p="${state.page + 1}" ${state.page === pages ? 'disabled' : ''} aria-label="Next page">→</button>`;
  $$('th[data-sort]').forEach(th => {
    const on = th.dataset.sort === state.sort.k;
    $('span', th).textContent = on ? (state.sort.d > 0 ? '↑' : '↓') : '↕'; th.setAttribute('aria-sort', on ? (state.sort.d > 0 ? 'ascending' : 'descending') : 'none');
  });
  const n = state.sel.size; $('#bulkBar').hidden = !n; $('#bulkCount').textContent = `${n} selected`;
  $('#selectAll').checked = slice.length > 0 && slice.every(s => state.sel.has(s.id));
  const fc = (state.plan !== 'All') + (state.cycle !== 'All');
  $('#filterBtn').textContent = '☷ Filters' + (fc ? ` (${fc})` : ''); $('#filterBtn').classList.toggle('has', !!fc);
}
function syncInputs(except) {
  [$('#tableSearch'), $('#globalSearch'), $('#pvSearch')].forEach(i => { if (i && i !== except) i.value = state.q; });
  $('#statusFilter').value = state.status;
}
function clearFilters() { Object.assign(state, { q: '', status: 'All', plan: 'All', cycle: 'All', page: 1 }); syncInputs(); refresh(); }
function refresh() { page === 'Overview' || page === 'Subscriptions' ? renderSubs() : fillPage(); }
function onSearch(e) { state.q = e.target.value; state.page = 1; syncInputs(e.target); refresh(); }
['#tableSearch', '#globalSearch'].forEach(s => $(s).addEventListener('input', onSearch));
$('#statusFilter').addEventListener('change', e => { state.status = e.target.value; state.page = 1; renderSubs(); });
$$('th[data-sort]').forEach(th => th.addEventListener('click', () => {
  const k = th.dataset.sort; state.sort = { k, d: state.sort.k === k ? -state.sort.d : 1 }; renderSubs();
}));
$('#pagination').addEventListener('click', e => {
  const b = e.target.closest('[data-p]'); if (!b || b.disabled) return;
  state.page = +b.dataset.p; renderSubs(); $('#subsPanel').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
});
$('#selectAll').addEventListener('change', e => {
  const list = filtered().slice((state.page - 1) * PER, state.page * PER);
  list.forEach(s => e.target.checked ? state.sel.add(s.id) : state.sel.delete(s.id)); renderSubs();
});
$('#filterBtn').addEventListener('click', e => {
  const t = (k, v) => ({ label: v, on: state[k] === v, fn: () => { state[k] = state[k] === v ? 'All' : v; state.page = 1; renderSubs(); } });
  openMenu(e.currentTarget, [{ head: 'Plan' }, ...Object.keys(PLANS).map(p => t('plan', p)), { sep: 1 }, { head: 'Billing cycle' }, t('cycle', 'Monthly'), t('cycle', 'Yearly'), { sep: 1 }, { label: 'Clear all filters', fn: clearFilters }]);
});

/* subscription actions */
function setStatus(s, st) { s.status = st; if (st === 'Active') s.base = new Date(); s.next = nextFor(s); }
function showSub(s) {
  openInfo(s.id, `Created ${fmtD(s.created)}`, `<dl class="detail"><div><dt>Customer</dt><dd>${esc(s.customer)}<small>${esc(s.email)}</small></dd></div><div><dt>Plan</dt><dd><span class="plan-name pl-${s.plan}">${s.plan}</span></dd></div><div><dt>Billing</dt><dd>${inr(s.amount)} / ${UNIT[s.cycle]}</dd></div><div><dt>Next billing</dt><dd>${fmtD(s.next)}</dd></div><div><dt>Status</dt><dd>${chip(s.status)}</dd></div></dl>`);
}
function rowMenu(btn, s) {
  if (!isAdmin()) return openMenu(btn, [{ icon: '◎', label: 'View details', fn: () => showSub(s) }, { head: 'Only admins can change subscriptions' }]);
  const act = (st, msg) => () => { setStatus(s, st); renderSubs(); showToast(`${s.id} ${msg}`); };
  const items = [{ icon: '◎', label: 'View details', fn: () => showSub(s) }];
  if (s.status === 'Past due') items.push({ icon: '✓', label: 'Mark as paid', fn: act('Active', 'marked as paid') });
  if (s.status === 'Trial') items.push({ icon: '↗', label: 'Convert to paid', fn: act('Active', 'converted to a paid plan') });
  if (s.status === 'Cancelled') items.push({ icon: '↻', label: 'Reactivate', fn: act('Active', 'reactivated') });
  if (s.status !== 'Cancelled') items.push({ icon: '✕', label: 'Cancel subscription', danger: 1, fn: act('Cancelled', 'cancelled') });
  items.push({ sep: 1 }, { icon: '🗑', label: 'Delete', danger: 1, fn: () => { if (confirm(`Delete ${s.id}? This can't be undone.`)) { subs.splice(subs.indexOf(s), 1); state.sel.delete(s.id); renderSubs(); showToast(`${s.id} deleted`); } } });
  openMenu(btn, items);
}
$('#subscriptionRows').addEventListener('click', e => {
  const tr = e.target.closest('tr[data-id]'), s = tr && subs.find(x => x.id === tr.dataset.id);
  if (e.target.closest('[data-act=clear]')) return clearFilters();
  if (!s) return;
  if (e.target.closest('.sub-id')) { e.preventDefault(); showSub(s); }
  if (e.target.closest('.row-more')) rowMenu(e.target.closest('.row-more'), s);
});
$('#subscriptionRows').addEventListener('change', e => {
  if (!e.target.classList.contains('row-check')) return;
  const id = e.target.closest('tr').dataset.id; e.target.checked ? state.sel.add(id) : state.sel.delete(id); renderSubs();
});
$('#bulkBar').addEventListener('click', e => {
  const a = e.target.closest('[data-bulk]')?.dataset.bulk; if (!a) return;
  if (a !== 'export' && a !== 'clear' && !needAdmin('change subscriptions')) return;
  if (a === 'export' && !canExport()) return;
  const chosen = subs.filter(s => state.sel.has(s.id));
  if (a === 'export') download('brightloop-selected.csv', [SUB_HEAD, ...chosen.map(subRow)]);
  else if (a === 'activate' || a === 'cancel') { chosen.forEach(s => setStatus(s, a === 'activate' ? 'Active' : 'Cancelled')); showToast(`${chosen.length} subscriptions ${a === 'activate' ? 'marked active' : 'cancelled'}`); }
  if (a !== 'export') state.sel.clear(); else showToast(`Exported ${chosen.length} subscriptions`);
  if (a === 'clear') state.sel.clear(); renderSubs();
});

/* new subscription */
$('#newSubscriptionBtn').addEventListener('click', () => {
  if (!needAdmin('create subscriptions')) return;
  $('#subscriptionForm [name=start]').value = today.toISOString().slice(0, 10); openB($('#modalBackdrop'), 'input[name=customer]');
});
$('#subscriptionForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.currentTarget), customer = String(f.get('customer')).trim(), email = String(f.get('email')).trim();
  const plan = String(f.get('plan')), cycle = String(f.get('cycle')), amount = Number(f.get('amount')), start = String(f.get('start'));
  if (!customer || !email || !plan || !(amount >= 1) || !start) return;
  const s = mk('SUB-2026-' + subCounter++, customer, email, plan, cycle, amount, new Date(`${start}T12:00:00`), 'Active');
  subs.unshift(s); state.sort = { k: 'id', d: -1 }; Object.assign(state, { q: '', status: 'All', plan: 'All', cycle: 'All', page: 1 });
  e.currentTarget.reset(); closeB($('#modalBackdrop')); syncInputs(); go('Subscriptions'); showToast(`Subscription ${s.id} created successfully`);
});

/* ---------- csv export ---------- */
function download(name, rows) {
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name }); document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}
const SUB_HEAD = ['Subscription', 'Customer', 'Email', 'Plan', 'Billing', 'Amount (INR)', 'Next billing', 'Status'];
const subRow = s => [s.id, s.customer, s.email, s.plan, s.cycle, s.amount, fmtD(s.next), s.status];
function exportCurrent() {
  if (!canExport()) return;
  if (!$('#pageView').hidden && $('#pvBody')) {
    const rows = [$$('#pageView thead th').map(t => t.textContent.trim()), ...$$('#pvBody tr:not(.empty-row)').map(tr => $$('td', tr).map(td => td.textContent.trim()))];
    download(`brightloop-${page.toLowerCase().replace(/\W+/g, '-')}.csv`, rows); showToast(`${page} exported as CSV`);
  } else { const l = filtered(); download('brightloop-subscriptions.csv', [SUB_HEAD, ...l.map(subRow)]); showToast(`Exported ${l.length} subscriptions as CSV`); }
}
$('#exportBtn').addEventListener('click', exportCurrent);

/* ---------- dashboard period, chart, stats ---------- */
let period = '7 days', metric = 'Revenue';
const PD = {
  '7 days': { d: 7, v: ['₹24,86,500', '1,284', '₹18,42,250', '₹3,28,750'], t: [12.8, 8.2, 6.4, -3.1], w: 'week' },
  '30 days': { d: 30, v: ['₹24,86,500', '1,284', '₹71,60,400', '₹3,28,750'], t: [18.4, 11.6, 9.2, -5.4], w: 'month' },
  '90 days': { d: 90, v: ['₹24,86,500', '1,284', '₹2,08,45,900', '₹3,28,750'], t: [34.7, 26.1, 21.8, -8.9], w: 'quarter' },
  '12 months': { d: 365, v: ['₹24,86,500', '1,284', '₹7,96,32,500', '₹3,28,750'], t: [142.3, 98.5, 87.2, -12.6], w: 'year' }
};
const MET = { Revenue: { y: ['₹30L', '₹20L', '₹10L', '₹0'], seed: 3 }, Subscriptions: { y: ['1.5K', '1K', '500', '0'], seed: 11 }, Payments: { y: ['₹25L', '₹17L', '₹8L', '₹0'], seed: 23 } };
const rnd = s => { const x = Math.sin(s * 9301 + 49297) * 233280; return x - Math.floor(x); };
const smooth = p => p.reduce((d, [x1, y1], i) => i ? d + ` C${(p[i - 1][0] + x1) / 2} ${p[i - 1][1]} ${(p[i - 1][0] + x1) / 2} ${y1} ${x1} ${y1}` : `M${x1} ${y1}`, '');
function drawChart() {
  const n = 14, seed = MET[metric].seed + PD[period].d, cur = [], prv = [];
  for (let i = 0; i < n; i++) {
    const x = +(i * 620 / (n - 1)).toFixed(1), v = Math.min(.95, Math.max(.08, .28 + .6 * i / (n - 1) + (rnd(seed + i) - .5) * .2));
    const w = Math.min(.9, Math.max(.05, v * .78 - .02 + (rnd(seed * 2 + i) - .5) * .06));
    cur.push([x, +(200 - v * 190).toFixed(1)]); prv.push([x, +(200 - w * 190).toFixed(1)]);
  }
  const c = smooth(cur), pt = cur[n - 4];
  $('#cCurrent').setAttribute('d', c); $('#cPrev').setAttribute('d', smooth(prv)); $('#cArea').setAttribute('d', `${c} L620 210 L0 210Z`);
  $('#cPoint').setAttribute('cx', pt[0]); $('#cPoint').setAttribute('cy', pt[1]);
  $('#yAxis').innerHTML = MET[metric].y.map(t => `<span>${t}</span>`).join('');
  const d = PD[period].d; $('#xAxis').innerHTML = [0, 1, 2, 3, 4, 5, 6].map(i => `<span>${addDays(today, -Math.round(d * (6 - i) / 6)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>`).join('');
  $('#revenueSelect').textContent = metric + ' ▾'; $('.revenue-panel h2').textContent = metric + ' overview';
}
function setPeriod(p, notify) {
  period = p; const d = PD[p];
  $$('.period').forEach(b => { const on = b.dataset.period === p; b.classList.toggle('active', on); b.setAttribute('aria-pressed', on); });
  $$('.stats-grid.dash .stat-value').forEach((el, i) => el.textContent = d.v[i]);
  $$('.stats-grid.dash .trend').forEach((el, i) => { const t = d.t[i]; el.className = 'trend ' + (t < 0 ? 'negative' : 'positive'); el.textContent = (t < 0 ? '↘ ' : '↗ ') + Math.abs(t) + '%'; });
  $$('.stats-grid.dash .vs').forEach(el => el.textContent = 'vs. previous ' + d.w);
  const start = addDays(today, -(d.d - 1)), f = (x, y) => x.toLocaleDateString('en-US', { month: 'short', day: 'numeric', ...(y && { year: 'numeric' }) });
  $('#dateFilter span').textContent = `${f(start, start.getFullYear() !== today.getFullYear())} – ${f(today, true)}`;
  drawChart(); if (notify) showToast(`Dashboard period changed to ${p}`);
}
$$('.period').forEach(b => b.addEventListener('click', () => setPeriod(b.dataset.period, true)));
$('#dateFilter').addEventListener('click', e => openMenu(e.currentTarget, Object.keys(PD).map(p => ({ label: 'Last ' + p, on: p === period, fn: () => setPeriod(p, true) }))));
$('#revenueSelect').addEventListener('click', e => openMenu(e.currentTarget, Object.keys(MET).map(m => ({ label: m, on: m === metric, fn: () => { metric = m; drawChart(); showToast(`Chart is showing ${m.toLowerCase()}`); } }))));
$$('.info').forEach((el, i) => { el.title = ['Predictable revenue you can expect each month', 'Subscriptions currently billing', 'Payments received in the selected period', 'Invoices still waiting to be paid'][i]; el.tabIndex = 0; el.setAttribute('role', 'img'); el.setAttribute('aria-label', el.title); });
$$('.stat-card[data-go]').forEach(c => c.addEventListener('click', () => go(c.dataset.go)));
$$('.donut-legend [data-plan]').forEach(el => el.addEventListener('click', () => goSubs({ plan: el.dataset.plan }, `Showing ${el.dataset.plan} subscriptions`)));

/* ---------- pages ---------- */
let page = 'Overview';
const discounts = [
  { code: 'WELCOME10', off: '10% off first 3 months', uses: '142 / 500', on: true }, { code: 'ANNUAL20', off: '20% off annual plans', uses: '88 / 200', on: true },
  { code: 'DIWALI25', off: '25% off for 2 months', uses: '310 / 310', on: false }, { code: 'STARTUP50', off: '₹500 off Starter', uses: '27 / 100', on: true }
];
const pvTable = (cols, rows, extra = {}) => ({ cols, rows, ...extra });
const P = {
  Customers() {
    const m = new Map();
    subs.forEach(s => {
      const c = m.get(s.email) || { name: s.customer, email: s.email, plan: s.plan, n: 0, mrr: 0, st: 'Cancelled' };
      c.n++; if (s.status !== 'Cancelled') c.mrr += monthly(s);
      if (s.status === 'Past due') c.st = 'Past due'; else if (c.st !== 'Past due' && s.status !== 'Cancelled') c.st = s.status; m.set(s.email, c);
    });
    return pvTable(['Customer', 'Plan', 'Subscriptions', 'Monthly value', 'Status'], [...m.values()].map(c => ({
      cells: [`<div class="customer-cell"><span class="customer-avatar ${avFor(c.email)}">${esc(initials(c.name))}</span><div><strong>${esc(c.name)}</strong><small>${esc(c.email)}</small></div></div>`, `<span class="plan-name pl-${c.plan}">${c.plan}</span>`, c.n, inr(c.mrr), chip(c.st)],
      text: `${c.name} ${c.email} ${c.plan} ${c.st}`, fn: () => goSubs({ q: c.email })
    })), { blurb: 'Everyone with a subscription. Select a row to see their subscriptions.' });
  },
  'Products & plans'() {
    return pvTable(['Plan', 'Price', 'Billing', 'Active subscribers', 'Included'], Object.entries(PLANS).map(([n, p]) => ({
      cells: [`<span class="plan-name pl-${n}">${n}</span>`, inr(p.price), p.cycle, subs.filter(s => s.plan === n && s.status !== 'Cancelled').length, esc(p.feat)],
      text: `${n} ${p.feat} ${p.cycle}`, fn: () => goSubs({ plan: n })
    })), { blurb: 'Plans you sell. Select a row to see who is on it.' });
  },
  Invoices() {
    const map = { Active: 'Paid', 'Past due': 'Overdue', Trial: 'Pending', Cancelled: 'Void' };
    return pvTable(['Invoice', 'Customer', 'Amount', 'Issued', 'Due', 'Status', ''], subs.slice(0, 24).map(s => {
      const st = map[s.status];
      return { cells: [`<a class="sub-id" href="#">INV-${s.id.slice(-4)}</a>`, esc(s.customer), inr(s.amount), fmtD(s.created), fmtD(addDays(s.created, 7)), chip(st), `<button class="link-btn" data-inv="${s.id}">${st === 'Overdue' ? 'Send reminder' : 'Download'}</button>`], text: `INV-${s.id.slice(-4)} ${s.customer} ${st}` };
    }), { blurb: 'Invoices generated from your subscriptions.' });
  },
  Payments() {
    const methods = ['UPI', 'Visa •••• 4242', 'Net banking', 'Mastercard •••• 1881'];
    return pvTable(['Payment', 'Customer', 'Method', 'Amount', 'Date', 'Status'], subs.filter(s => s.status !== 'Trial').slice(0, 24).map((s, i) => {
      const st = s.status === 'Past due' ? 'Failed' : 'Succeeded';
      return { cells: [`PAY-${9000 + +s.id.slice(-4)}`, esc(s.customer), methods[i % 4], inr(s.amount), fmtD(s.created), chip(st)], text: `PAY-${s.id} ${s.customer} ${methods[i % 4]} ${st}` };
    }), { blurb: 'Money moving in. Failed payments are retried automatically.' });
  },
  Discounts() {
    return pvTable(['Code', 'Offer', 'Redeemed', 'Status', 'Enabled'], discounts.map((d, i) => ({
      cells: [`<strong>${d.code}</strong>`, esc(d.off), d.uses, chip(d.on ? 'Active' : 'Paused'), `<button class="switch${d.on ? ' on' : ''}" role="switch" aria-checked="${d.on}" aria-label="Enable ${d.code}" data-disc="${i}"></button>`],
      text: `${d.code} ${d.off}`
    })), { blurb: 'Turn codes on or off. Changes apply to new checkouts only.' });
  },
  Reports: {
    custom() {
      const live = subs.filter(s => s.status !== 'Cancelled'), mrr = live.reduce((a, s) => a + monthly(s), 0);
      const churn = (subs.filter(s => s.status === 'Cancelled').length / subs.length * 100).toFixed(1);
      const by = Object.keys(PLANS).map(n => ({ n, v: live.filter(s => s.plan === n).reduce((a, s) => a + monthly(s), 0) })), max = Math.max(...by.map(b => b.v), 1);
      const tile = (l, v, ic, c) => `<article class="stat-card"><div class="stat-top"><span>${l}</span><span class="stat-icon ${c}">${ic}</span></div><div class="stat-value">${v}</div></article>`;
      return `<section class="stats-grid report-tiles" style="grid-template-columns:repeat(3,minmax(0,1fr))">${tile('Monthly recurring revenue', inr0(mrr), '↗', 'mint')}${tile('Billing subscriptions', live.length, '↻', 'lavender')}${tile('Churn rate', churn + '%', '!', 'peach')}</section>
<article class="panel"><div class="panel-heading"><div><h2>Revenue by plan</h2><p>Monthly value of every non-cancelled subscription.</p></div><button class="btn btn-light btn-small" data-act="export-subs">↓ Download CSV</button></div>
${by.map(b => `<div class="bar-row"><span>${b.n}</span><div class="bar"><i style="width:${(b.v / max * 100).toFixed(1)}%;background:${PCOL[b.n]}"></i></div><strong>${inr0(b.v)}</strong></div>`).join('')}</article>`;
    }
  },
  Members: {
    custom() {
      const pro = members.filter(m => m.tier === 'Pro').length, me = user?.email;
      const tile = (l, v, ic, c) => `<article class="stat-card"><div class="stat-top"><span>${l}</span><span class="stat-icon ${c}">${ic}</span></div><div class="stat-value">${v}</div></article>`;
      return `<section class="stats-grid report-tiles" style="grid-template-columns:repeat(3,minmax(0,1fr))">${tile('Members', members.length, '♙', 'lavender')}${tile('Pro users', pro, '★', 'peach')}${tile('Normal users', members.length - pro, '○', 'blue')}</section>
<article class="panel"><div class="panel-heading"><div><h2>Team members</h2><p>Set each person's role, and whether they are a Pro or Normal user.</p></div><div class="header-buttons" style="padding:0"><button class="btn btn-light btn-small" data-act="xl-import">↑ Import from Excel</button><button class="btn btn-light btn-small" data-act="xl-export">↓ Export to Excel</button></div></div>
<form id="inviteForm" class="invite-form"><input name="name" placeholder="Full name" required><input name="email" type="email" placeholder="name@company.com" required><select name="role"><option value="user">User</option><option value="developer">Developer</option><option value="admin">Admin</option></select><button class="btn btn-primary btn-small" type="submit">Add member</button></form>
<div class="table-scroll"><table><thead><tr><th>MEMBER</th><th>ROLE</th><th>PLAN</th><th></th></tr></thead><tbody>${members.map((m, i) => `<tr><td><div class="customer-cell"><span class="customer-avatar ${avFor(m.email)}">${esc(initials(m.name))}</span><div><strong>${esc(m.name)}${m.email === me ? ' (you)' : ''}</strong><small>${esc(m.email)}</small></div></div></td><td><select class="mini-select" data-mrole="${i}" aria-label="Role for ${esc(m.name)}" ${m.email === me ? 'disabled' : ''}>${['admin', 'developer', 'user'].map(r => `<option value="${r}"${m.role === r ? ' selected' : ''}>${ROLE_LABEL[r]}</option>`).join('')}</select></td><td><button class="tier-btn${m.tier === 'Pro' ? ' pro' : ''}" data-tier="${i}" aria-pressed="${m.tier === 'Pro'}">${m.tier === 'Pro' ? '★ Pro user' : 'Normal user'}</button></td><td><button class="link-btn danger-link" data-rm="${i}" ${m.email === me ? 'disabled' : ''}>Remove</button></td></tr>`).join('')}</tbody></table></div></article>`;
    }
  },
  Developer: {
    custom() {
      const d = devCfg(), key = d.keys[d.env], shown = devReveal ? key : key.slice(0, 8) + '•'.repeat(16) + key.slice(-4);
      return `<article class="panel"><div class="panel-heading"><div><h2>API keys</h2><p>Use a key to call the Brightloop API from your code. Keep it secret.</p></div><div class="period-tabs">${['sandbox', 'live'].map(e => `<button class="period${d.env === e ? ' active' : ''}" data-env="${e}">${e[0].toUpperCase() + e.slice(1)}</button>`).join('')}</div></div>
<div class="key-row"><code>${esc(shown)}</code><button class="btn btn-light btn-small" data-dev="reveal">${devReveal ? 'Hide' : 'Reveal'}</button><button class="btn btn-light btn-small" data-dev="copy">Copy</button><button class="btn btn-light btn-small" data-dev="regen">Regenerate</button></div>
<p class="dev-note">Limit: 600 requests per minute. Example base URL: <code>https://api.brightloop.app/v1</code></p></article>
<article class="panel"><div class="panel-heading"><div><h2>Webhooks</h2><p>Get a POST request at your URL when something happens.</p></div></div>
<form id="hookForm" class="invite-form"><input name="url" type="url" placeholder="https://yourapp.com/webhooks/brightloop" value="${esc(d.hook)}"><button class="btn btn-primary btn-small" type="submit">Save URL</button><button class="btn btn-light btn-small" type="button" data-dev="test">Send test event</button></form>
<div class="hook-events">${EVENTS.map(ev => `<label class="check"><input type="checkbox" data-ev="${ev}" ${d.events[ev] !== false ? 'checked' : ''}> ${ev}</label>`).join('')}</div>
<pre class="code-box log-box">${esc(devLog.join('\n') || 'No events yet. Save a URL, then send a test event.')}</pre></article>
<article class="panel"><div class="panel-heading"><div><h2>Quick start</h2><p>Create a subscription with one request.</p></div><div class="period-tabs">${Object.keys(SNIP).map(t => `<button class="period${devTab === t ? ' active' : ''}" data-tab="${t}">${t}</button>`).join('')}</div></div>
<pre class="code-box">${esc(SNIP[devTab])}</pre><div style="margin-top:12px"><button class="btn btn-light btn-small" data-dev="copycode">Copy code</button></div></article>`;
    }
  },
  Settings: {
    custom() {
      return `<article class="panel"><div class="panel-heading"><div><h2>Settings</h2><p>Choose how Brightloop looks and what it emails you about.</p></div></div>
${user ? '' : '<div class="modal-note" style="margin-top:16px"><span>✦</span><p>Log in to edit your profile. <button class="link-btn" data-act="login">Log in</button></p></div>'}
<form id="settingsForm" class="form-grid settings-form"><label class="form-field">Display name<input name="name" value="${esc(user?.name || '')}" ${user ? '' : 'disabled'} placeholder="Log in to set a name"></label>
<label class="form-field">Theme<select name="theme"><option value="system">Match my device</option><option value="light">Light</option><option value="dark">Dark</option></select></label>
${isAdmin() ? ADMIN_SET() : ""}
<label class="form-field full check-line"><input type="checkbox" name="alerts" ${store.get('bl_alerts') === false ? '' : 'checked'}> Email me about failed payments and ending trials</label>
<div class="full modal-actions"><button class="btn btn-primary" type="submit">Save changes</button></div></form></article>`;
    }
  }
};
let pvRows = [];
function renderPage(name) {
  const def = P[name], pv = $('#pageView');
  if (typeof def === 'object') { pv.innerHTML = def.custom(); const t = $('#settingsForm [name=theme]'); if (t) t.value = themePref; return; }
  const d = def();
  pv.innerHTML = `<article class="panel subscriptions-panel"><div class="panel-heading table-heading"><div><h2>${esc(name)} <span class="count-pill" id="pvCount"></span></h2><p>${esc(d.blurb)}</p></div><button class="btn btn-light btn-small" data-act="pv-export">↓ Export CSV</button></div>
<div class="table-tools"><label class="table-search"><span>⌕</span><input id="pvSearch" type="search" placeholder="Search ${esc(name.toLowerCase())}..." value="${esc(state.q)}"></label></div>
<div class="table-scroll"><table><thead><tr>${d.cols.map(c => `<th>${esc(c.toUpperCase())}</th>`).join('')}</tr></thead><tbody id="pvBody"></tbody></table></div></article>`;
  $('#pvSearch').addEventListener('input', onSearch); fillPage();
}
function fillPage() {
  if (!$('#pvBody')) return;
  const q = state.q.trim().toLowerCase(), d = P[page]();
  pvRows = d.rows.filter(r => !q || r.text.toLowerCase().includes(q));
  $('#pvBody').innerHTML = pvRows.length ? pvRows.map((r, i) => `<tr ${r.fn ? `class="clickable" data-r="${i}"` : ''}>${r.cells.map(c => `<td>${c}</td>`).join('')}</tr>`).join('') : `<tr class="empty-row"><td colspan="${d.cols.length}"><div class="empty-state">Nothing matches “${esc(state.q)}”.</div></td></tr>`;
  $('#pvCount').textContent = pvRows.length;
}
$('#pageView').addEventListener('click', e => {
  const t = e.target;
  if (t.closest('.sub-id')) e.preventDefault();
  const a = t.closest('[data-act]')?.dataset.act;
  if (a === 'pv-export') return exportCurrent();
  if (a === 'export-subs') { download('brightloop-subscriptions.csv', [SUB_HEAD, ...subs.map(subRow)]); return showToast('Exported all subscriptions as CSV'); }
  if (a === 'login') return $('#loginBtn').click();
  const sw = t.closest('[data-disc]'); if (sw) { if (!needAdmin('change discounts')) return; const d = discounts[+sw.dataset.disc]; d.on = !d.on; fillPage(); return showToast(`${d.code} ${d.on ? 'enabled' : 'paused'}`); }
  const inv = t.closest('[data-inv]');
  if (inv) {
    const s = subs.find(x => x.id === inv.dataset.inv);
    if (inv.textContent === 'Send reminder') return showToast(`Payment reminder sent to ${s.email}`);
    download(`INV-${s.id.slice(-4)}.csv`, [['Invoice', 'Customer', 'Email', 'Plan', 'Amount (INR)', 'Issued'], [`INV-${s.id.slice(-4)}`, s.customer, s.email, s.plan, s.amount, fmtD(s.created)]]); return showToast(`INV-${s.id.slice(-4)} downloaded`);
  }
  const tr = t.closest('tr[data-r]'); if (tr) pvRows[+tr.dataset.r].fn();
});
$('#pageView').addEventListener('submit', e => {
  if (e.target.id !== 'settingsForm') return; e.preventDefault();
  const f = new FormData(e.target), name = String(f.get('name') || '').trim();
  store.set('bl_alerts', f.has('alerts'));
  if (user && name.length >= 2) setUser({ ...user, name }, localStorage.getItem('bl_user') !== null);
  if (isAdmin()) { cfg.ws = String(f.get('ws') || '').trim() || cfg.ws; cfg.tier = String(f.get('tier')); cfg.export = f.has('export'); store.set('bl_cfg', cfg); $('#wsName').textContent = cfg.ws; $('#wsIcon').textContent = cfg.ws[0].toUpperCase(); }
  setTheme(String(f.get('theme')), false); showToast('Settings saved');
});

/* ---------- navigation ---------- */
function setTitle() {
  const h = today.getHours(), first = user?.name.split(' ')[0];
  if (page === 'Overview') $('#pageTitle').innerHTML = `Good ${h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'}${first ? ', ' + esc(first) : ''} <span class="wave">✳</span>`;
  else $('#pageTitle').textContent = page;
  $('#pageSubtitle').textContent = page === 'Overview' ? "Here's what's happening with your subscriptions today." : `Manage and review your ${page.toLowerCase()} in one place.`;
}
function go(name) {
  closeMenu(); page = name;
  $$('.nav-item[data-page]').forEach(b => { const on = b.dataset.page === name; b.classList.toggle('active', on); on ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current'); });
  $('#crumbPage').textContent = name; setTitle();
  const ov = name === 'Overview', sb = name === 'Subscriptions';
  $$('.dash').forEach(e => e.hidden = !ov); $('#subsPanel').hidden = !(ov || sb); $('#pageView').hidden = ov || sb;
  if (ov || sb) renderSubs(); else renderPage(name);
  $('#sidebar').classList.remove('open'); scrollTo({ top: 0 });
}
function goSubs(f, msg) { Object.assign(state, { q: '', status: 'All', plan: 'All', cycle: 'All', page: 1 }, f); syncInputs(); go('Subscriptions'); if (msg) showToast(msg); }
$$('.nav-item[data-page]').forEach(b => b.addEventListener('click', () => go(b.dataset.page)));
$$('[data-page-link]').forEach(b => b.addEventListener('click', () => go(b.dataset.pageLink)));
$('#viewAllBtn').addEventListener('click', () => go('Subscriptions'));
$('#brandLink').addEventListener('click', e => { e.preventDefault(); go('Overview'); });
$('#mobileMenu').addEventListener('click', e => { e.stopPropagation(); $('#sidebar').classList.toggle('open'); });
$('#helpBtn').addEventListener('click', () => openInfo('Help center', 'Quick answers and shortcuts', `<ul class="info-list"><li><kbd>⌘ / Ctrl + K</kbd>Jump to search</li><li><kbd>Esc</kbd>Close any dialog or menu</li><li>Select a stat card to open the matching page.</li><li>Use <strong>•••</strong> on a subscription to mark paid, cancel or delete it.</li><li>Need a person? <a class="sub-id" href="mailto:support@brightloop.app">support@brightloop.app</a></li></ul>`));
const WS = ['Brightloop Software', 'Brightloop Labs', 'Brightloop India'];
$('#workspaceBtn').addEventListener('click', e => openMenu(e.currentTarget, WS.map(w => ({ label: w, on: w === $('#wsName').textContent, fn: () => { $('#wsName').textContent = w; $('#wsIcon').textContent = w.split(' ').pop()[0]; showToast(`Switched to ${w}`); } })), 'Workspaces'));

/* notifications */
const notes = [
  { t: 'Payment failed — Rahul Verma', on: true, fn: () => goSubs({ status: 'Past due' }) },
  { t: 'Trial ending soon — Priya Desai', on: true, fn: () => goSubs({ status: 'Trial' }) },
  { t: 'New subscription — Nikhil Kapoor', on: true, fn: () => goSubs({ q: 'Nikhil' }) }
];
const updateBadge = () => $('#notificationBtn i').hidden = !notes.some(n => n.on);
$('#notificationBtn').addEventListener('click', e => openMenu(e.currentTarget, [...notes.map(n => ({ label: n.t, dot: n.on, fn: () => { n.on = false; updateBadge(); n.fn(); } })), { sep: 1 },
  { label: 'Mark all as read', fn: () => { notes.forEach(n => n.on = false); updateBadge(); showToast('You’re all caught up'); } }], 'Notifications'));

/* ---------- login ---------- */
const DEMOS = [{ email: 'alex@brightloop.com', name: 'Alex Morgan' }, { email: 'dev@brightloop.com', name: 'Dev Patel' }, { email: 'user@brightloop.com', name: 'Maya Rao' }];
const DEMO_PASS = 'Brightloop@123';
let user = store.get('bl_user'), authMode = 'login';
const accounts = () => store.get('bl_accounts') || {};
const hash = async s => { try { return [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode('bl:' + s)))].map(x => x.toString(16).padStart(2, '0')).join(''); } catch { return btoa(unescape(encodeURIComponent('bl:' + s))); } };
function setUser(u, persist = true) {
  user = u; store.del('bl_user'); if (u) store.set('bl_user', u, persist);
  $('#loginBtn').hidden = !!u; $('#userBtn').hidden = !u;
  $('#userBtn').textContent = u ? initials(u.name) : 'GU'; $('#profAvatar').textContent = u ? initials(u.name) : 'GU';
  $('#profName').textContent = u ? u.name : 'Guest'; $('#profRole').textContent = u ? ROLE_LABEL[roleOf(u)] + (tierOf(u) === 'Pro' ? ' · Pro' : '') : 'Not logged in';
  applyRole(); setTitle();
}
function applyRole() {
  const r = role(); $$('[data-roles]').forEach(b => b.hidden = !b.dataset.roles.split(',').includes(r));
  const cur = $(`.nav-item[data-page="${page}"]`); if (cur && cur.hidden) go('Overview');
}
const showErr = m => { const el = $('#authError'); el.textContent = m || ''; el.hidden = !m; };
function setAuthMode(m) {
  authMode = m; const r = m === 'register';
  $('#nameField').hidden = !r; $('#roleField').hidden = !r; $('#authKicker').textContent = r ? 'GET STARTED' : 'WELCOME BACK';
  $('#authTitle').textContent = r ? 'Create your account' : 'Log in to Brightloop';
  $('#authSub').textContent = r ? 'Start managing subscriptions in a few seconds.' : 'Manage subscriptions, invoices and payments.';
  $('#authSubmit').textContent = r ? 'Create account' : 'Log in'; $('#authSwitch').textContent = r ? 'Have an account? Log in' : 'New here? Create an account';
  $('#loginForm [name=password]').autocomplete = r ? 'new-password' : 'current-password'; showErr('');
}
const openLogin = () => { setAuthMode('login'); openB($('#loginBackdrop'), 'input[name=email]'); };
$('#loginBtn').addEventListener('click', openLogin);
$('#authSwitch').addEventListener('click', () => setAuthMode(authMode === 'login' ? 'register' : 'login'));
$('#pwToggle').addEventListener('click', e => {
  const i = $('#loginForm [name=password]'), show = i.type === 'password'; i.type = show ? 'text' : 'password';
  e.currentTarget.textContent = show ? 'Hide' : 'Show'; e.currentTarget.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
});
$$('[data-demo]').forEach(b => b.addEventListener('click', () => { setAuthMode('login'); $('#loginForm [name=email]').value = DEMOS[+b.dataset.demo].email; $('#loginForm [name=password]').value = DEMO_PASS; showErr(''); }));
$('#forgotBtn').addEventListener('click', () => {
  const em = $('#loginForm [name=email]').value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return showErr('Enter your email address above, then select “Forgot password?”.');
  showErr(''); showToast(`Password reset link sent to ${em}`);
});
$('#loginForm').addEventListener('submit', async e => {
  e.preventDefault(); const form = e.currentTarget;
  const f = new FormData(form), email = String(f.get('email')).trim().toLowerCase(), pw = String(f.get('password')), name = String(f.get('name') || '').trim(), reg = authMode === 'register';
  if (reg && name.length < 2) return showErr('Enter your full name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showErr('Enter a valid email address, like name@company.com.');
  if (!pw) return showErr('Enter your password.');
  if (reg && pw.length < 8) return showErr('Use at least 8 characters for your password.');
  const btn = $('#authSubmit'), label = btn.textContent; btn.disabled = true; btn.textContent = reg ? 'Creating…' : 'Logging in…';
  await sleep(450); const h = await hash(pw); let u;
  if (reg) {
    const acc = accounts();
    if (DEMOS.some(d => d.email === email) || acc[email]) { btn.disabled = false; btn.textContent = label; return showErr('An account with this email already exists. Log in instead.'); }
    acc[email] = { name, h }; store.set('bl_accounts', acc); u = { name, email };
    if (!members.some(m => m.email === email)) { members.push({ name, email, role: f.get('role') === 'developer' ? 'developer' : 'user', tier: cfg.tier }); saveMembers(); }
  } else {
    const demo = DEMOS.find(d => d.email === email), a = demo ? { name: demo.name, h: await hash(DEMO_PASS) } : accounts()[email];
    if (!a || a.h !== h) { btn.disabled = false; btn.textContent = label; return showErr('Email or password is incorrect. Check them and try again.'); }
    u = { name: a.name, email };
  }
  btn.disabled = false; btn.textContent = label; form.reset(); showErr('');
  setUser(u, f.has('remember')); closeB($('#loginBackdrop')); showToast(`${reg ? 'Welcome' : 'Welcome back'}, ${u.name.split(' ')[0]}`);
  if (page === 'Settings') renderPage('Settings');
});
const logout = () => { setUser(null); showToast('You’re logged out'); if (page === 'Settings') renderPage('Settings'); };
const acctItems = () => user
  ? [{ head: `${user.name} · ${ROLE_LABEL[roleOf(user)]}` }, { icon: '⚙', label: 'Settings', fn: () => go('Settings') }, { icon: '◐', label: isDark() ? 'Switch to light mode' : 'Switch to dark mode', fn: () => setTheme(isDark() ? 'light' : 'dark') }, { sep: 1 }, { icon: '⏻', label: 'Log out', danger: 1, fn: logout }]
  : [{ icon: '→', label: 'Log in', fn: openLogin }, { icon: '⚙', label: 'Settings', fn: () => go('Settings') }];
$('#userBtn').addEventListener('click', e => openMenu(e.currentTarget, acctItems()));
$('#profileMore').addEventListener('click', e => openMenu(e.currentTarget, acctItems()));

/* members + developer page actions */
const rerender = () => { renderPage(page); setUser(user, persisted()); };
$('#pageView').addEventListener('click', e => {
  const t = e.target, tier = t.closest('[data-tier]'), rm = t.closest('[data-rm]'), dev = t.closest('[data-dev]')?.dataset.dev;
  if (tier) { if (!needAdmin('change plans')) return; const m = members[+tier.dataset.tier]; m.tier = m.tier === 'Pro' ? 'Normal' : 'Pro'; saveMembers(); rerender(); return showToast(`${m.name} is now a ${m.tier} user`); }
  if (rm) { if (!needAdmin('remove members')) return; const m = members[+rm.dataset.rm]; if (confirm(`Remove ${m.name} from the workspace?`)) { members.splice(+rm.dataset.rm, 1); saveMembers(); rerender(); showToast(`${m.name} removed`); } return; }
  const envB = t.closest('[data-env]'), tabB = t.closest('[data-tab]');
  if (envB) { const d = devCfg(); d.env = envB.dataset.env; store.set('bl_dev', d); devReveal = false; return rerender(); }
  if (tabB) { devTab = tabB.dataset.tab; return rerender(); }
  if (!dev) return;
  const d = devCfg();
  if (dev === 'reveal') { devReveal = !devReveal; rerender(); }
  else if (dev === 'copy') copyText(d.keys[d.env]);
  else if (dev === 'copycode') copyText(SNIP[devTab]);
  else if (dev === 'regen') { if (confirm(`Create a new ${d.env} key? The current one stops working immediately.`)) { d.keys[d.env] = genKey(d.env === 'live' ? 'live' : 'test'); store.set('bl_dev', d); devReveal = true; rerender(); showToast('New key created. Copy it now.'); } }
  else if (dev === 'test') {
    const url = $('#hookForm [name=url]').value.trim(), ts = new Date().toLocaleTimeString();
    if (!/^https?:\/\/\S+\.\S+/.test(url)) devLog.push(`[${ts}] Not sent: enter a valid https:// URL first`);
    else devLog.push(`[${ts}] POST ${url}\n         {"type":"subscription.created","env":"${d.env}","id":"SUB-TEST-0001"}\n         → simulated 200 OK (no real request is sent from this demo)`);
    rerender();
  }
});
$('#pageView').addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.mrole !== undefined) { if (!needAdmin('change roles')) return rerender(); const m = members[+t.dataset.mrole]; m.role = t.value; saveMembers(); rerender(); showToast(`${m.name} is now ${ROLE_LABEL[m.role]}`); }
  if (t.dataset.ev) { const d = devCfg(); d.events[t.dataset.ev] = t.checked; store.set('bl_dev', d); showToast(`${t.dataset.ev} ${t.checked ? 'on' : 'off'}`); }
});
$('#pageView').addEventListener('submit', e => {
  const f = e.target;
  if (f.id === 'inviteForm') {
    e.preventDefault(); if (!needAdmin('add members')) return; const v = new FormData(f), email = String(v.get('email')).trim().toLowerCase();
    if (members.some(m => m.email === email)) return showToast('That email is already a member');
    members.push({ name: String(v.get('name')).trim(), email, role: String(v.get('role')), tier: cfg.tier }); saveMembers(); rerender(); showToast(`${v.get('name')} added as ${ROLE_LABEL[v.get('role')]}`);
  }
  if (f.id === 'hookForm') { e.preventDefault(); const d = devCfg(); d.hook = String(new FormData(f).get('url')).trim(); store.set('bl_dev', d); showToast(d.hook ? 'Webhook URL saved' : 'Webhook URL cleared'); }
});

/* spreadsheet link: import / export members (.xlsx via SheetJS, or .csv) */
const xlInput = $('#xlsxInput');
const roleName = r => ({ admin: 'Admin', developer: 'Developer', user: 'User' }[r]);
const parseCSV = t => {
  const rows = []; let r = [], c = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (q) { if (ch === '"' && t[i + 1] === '"') { c += '"'; i++; } else if (ch === '"') q = false; else c += ch; }
    else if (ch === '"') q = true; else if (ch === ',') { r.push(c); c = ''; }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && t[i + 1] === '\n') i++; r.push(c); rows.push(r); r = []; c = ''; } else c += ch;
  }
  r.push(c); rows.push(r); return rows;
};
function importRows(rows) {
  const low = v => String(v ?? '').trim().toLowerCase();
  const hi = rows.findIndex(r => r.some(v => low(v) === 'email') && r.some(v => low(v) === 'name'));
  if (hi < 0) return showToast('Could not find the Name, Email, Role and Plan tier columns');
  const head = rows[hi].map(low), col = n => head.indexOf(n);
  const ci = { name: col('name'), email: col('email'), role: col('role'), tier: col('plan tier') >= 0 ? col('plan tier') : col('plan') };
  const g = (r, k) => ci[k] >= 0 ? String(r[ci[k]] ?? '').trim() : '';
  let add = 0, upd = 0, skip = 0;
  rows.slice(hi + 1).forEach(r => {
    const name = g(r, 'name'), email = g(r, 'email').toLowerCase(); let rl = g(r, 'role').toLowerCase(); const tier = g(r, 'tier').toLowerCase();
    if (!name && !email) return; if (rl === 'administrator') rl = 'admin';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || name.length < 2 || !['admin', 'developer', 'user'].includes(rl) || !['pro', 'normal'].includes(tier)) { skip++; return; }
    const val = { name, email, role: rl, tier: tier === 'pro' ? 'Pro' : 'Normal' }, m = members.find(x => x.email === email);
    if (m) { if (m.email === user?.email) val.role = m.role; Object.assign(m, val); upd++; } else { members.push(val); add++; }
  });
  saveMembers(); rerender(); showToast(`Imported: ${add} added, ${upd} updated${skip ? `, ${skip} skipped (check the values)` : ''}`);
}
xlInput.addEventListener('change', async () => {
  const f = xlInput.files[0]; xlInput.value = ''; if (!f || !needAdmin('import members')) return;
  try {
    if (/\.csv$/i.test(f.name)) return importRows(parseCSV(await f.text()));
    if (typeof XLSX === 'undefined') return showToast('Excel support did not load (check your internet). Save the sheet as CSV and import that instead.');
    const wb = XLSX.read(await f.arrayBuffer(), { type: 'array' });
    const ws = wb.Sheets[wb.SheetNames.find(n => n.toLowerCase() === 'members') || wb.SheetNames[0]];
    importRows(XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' }));
  } catch { showToast('Could not read that file. Use the Brightloop .xlsx or a .csv.'); }
});
function exportXlsx() {
  const rows = [['Name', 'Email', 'Role', 'Plan tier'], ...members.map(m => [m.name, m.email, roleName(m.role), m.tier])];
  if (typeof XLSX === 'undefined') { download('brightloop-members.csv', rows); return showToast('Excel support did not load, so a CSV was saved instead'); }
  const wb = XLSX.utils.book_new(), ws = XLSX.utils.aoa_to_sheet(rows); ws['!cols'] = [{ wch: 22 }, { wch: 30 }, { wch: 14 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Members');
  const perm = [['Feature', 'Admin', 'Developer', 'User'], ['Dashboard, reports, view data', 'Yes', 'Yes', 'Yes'], ['Create / change subscriptions, edit discounts', 'Yes', 'No', 'No'], ['Members page and workspace settings', 'Yes', 'No', 'No'], ['Developer page (API keys, webhooks, code)', 'Yes', 'Yes', 'No'], ['Export CSV', 'Always', 'Always', 'If admin allows']];
  const w2 = XLSX.utils.aoa_to_sheet(perm); w2['!cols'] = [{ wch: 46 }, { wch: 12 }, { wch: 12 }, { wch: 16 }]; XLSX.utils.book_append_sheet(wb, w2, 'Role permissions');
  XLSX.writeFile(wb, 'brightloop-members.xlsx'); showToast(`Exported ${members.length} members to Excel`);
}
$('#pageView').addEventListener('click', e => {
  const a = e.target.closest('[data-act]')?.dataset.act;
  if (a === 'xl-import') { if (needAdmin('import members')) xlInput.click(); }
  if (a === 'xl-export') { if (needAdmin('export members')) exportXlsx(); }
});

/* ---------- start ---------- */
$('#todayLabel').textContent = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
$('#wsName').textContent = cfg.ws; $('#wsIcon').textContent = cfg.ws[0].toUpperCase();
applyTheme(false); updateBadge(); setUser(user, persisted()); setPeriod('7 days'); go('Overview');
