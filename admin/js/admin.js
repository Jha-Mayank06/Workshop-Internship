// ══════════════════════════
// AUTH
// ══════════════════════════
const ADMIN_CREDS = { user: "admin", pass: "cps2025" }; // Change this!

function tryLogin() {
  const u = document.getElementById("admin-user").value.trim();
  const p = document.getElementById("admin-pass").value.trim();
  if (u === ADMIN_CREDS.user && p === ADMIN_CREDS.pass) {
    document.getElementById("login-gate").style.display = "none";
    document.getElementById("app").style.display = "block";
    initDashboard();
  } else {
    document.getElementById("login-err").textContent =
      "❌ Invalid credentials. Try again.";
    document.getElementById("admin-pass").value = "";
  }
}

function logout() {
  document.getElementById("app").style.display = "none";
  document.getElementById("login-gate").style.display = "flex";
  document.getElementById("admin-user").value = "";
  document.getElementById("admin-pass").value = "";
  document.getElementById("login-err").textContent = "";
}

// ══════════════════════════
// CONFIG & DATA
// ══════════════════════════
const API_URL = "https://script.google.com/macros/s/AKfycbwxrjQ4MbE8ZfacH6kCSyoZdbn0iCPPTG9j8eEMVVFnDNBczSV2BHNZhANy-B8_zEPQSA/exec";
let cachedData = []; // Global store for real data

async function refreshData() {
  const topbarCount = document.getElementById("topbar-count");
  if (topbarCount) topbarCount.textContent = "⌛ Refreshing...";
  
  try {
    const response = await fetch(API_URL);
    cachedData = await response.json();
    renderStats();
    
    // Refresh current page
    const activePage = document.querySelector(".page.active")?.id;
    if (activePage === "page-dashboard") renderRecent();
    if (activePage === "page-students") renderStudents();
    if (activePage === "page-internship") renderInternship();
    
  } catch (error) {
    console.error("Fetch error:", error);
    showToast("⚠️ Failed to load real data", "error");
  }
}

function getData() {
  return cachedData;
}

function getApprovals() {
  return JSON.parse(localStorage.getItem("cps_approvals") || "{}");
}

function setApprovals(obj) {
  localStorage.setItem("cps_approvals", JSON.stringify(obj));
}

// ══════════════════════════
// NAVIGATION
// ══════════════════════════
function showPage(page, el) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
  document.getElementById("page-" + page).classList.add("active");
  if (el) el.classList.add("active");
  
  if (page === "dashboard") renderRecent();
  if (page === "students") renderStudents();
  if (page === "internship") renderInternship();
  if (page === "announce") renderAnnouncements();
}

// ══════════════════════════
// DASHBOARD
// ══════════════════════════
async function initDashboard() {
  await refreshData();
  setInterval(refreshData, 30000); // Auto-refresh every 30 seconds
}

function renderStats() {
  const data = getData();
  const approvals = getApprovals();
  
  const total = data.length;
  const workshop = data.filter((d) => d.plan === "Workshop Only").length;
  const internship = data.filter((d) => d.plan === "Workshop + Internship").length;
  
  // New Stats
  const paid = data.filter((d) => d.paymentStatus === "paid").length;
  const pendingPayment = data.filter((d) => d.paymentStatus === "pending").length;
  
  const pendingApproval = data.filter(
    (d) =>
      d.plan === "Workshop + Internship" &&
      d.paymentStatus === "paid" && 
      (!approvals[d.email] || approvals[d.email] === "pending")
  ).length;

  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-workshop").textContent = workshop;
  document.getElementById("stat-internship").textContent = internship;
  document.getElementById("stat-pending").textContent = pendingApproval;
  
  // Optional: Update new cards if they exist in HTML
  if (document.getElementById("stat-paid")) document.getElementById("stat-paid").textContent = paid;
  if (document.getElementById("stat-unpaid")) document.getElementById("stat-unpaid").textContent = pendingPayment;

  document.getElementById("topbar-count").textContent =
    total + " Registration" + (total !== 1 ? "s" : "");
}

function renderRecent() {
  const data = getData().slice().reverse().slice(0, 10);
  const tbody = document.getElementById("recent-tbody");
  if (!data.length) {
    tbody.innerHTML =
      '<tr><td colspan="6"><div class="empty-state"><span class="ei">📭</span><p>No registrations yet. Share the registration link!</p></div></td></tr>';
    return;
  }
  tbody.innerHTML = data
    .map(
      (r, i) => `
  <tr>
    <td style="color:var(--text-muted);font-family:'JetBrains Mono',monospace;font-size:12px">${i + 1}</td>
    <td><strong>${esc(r.fullName)}</strong></td>
    <td style="color:var(--text-muted)">${esc(r.email)}</td>
    <td style="color:var(--text-muted);font-size:12px">${esc(r.college)}</td>
    <td><span class="badge ${r.plan === "Workshop Only" ? "badge-workshop" : "badge-internship"}">${esc(r.plan)}</span></td>
    <td style="color:var(--text-muted);font-size:12px;font-family:'JetBrains Mono',monospace">${fmtDate(r.timestamp)}</td>
  </tr>
`,
    )
    .join("");
}

// ══════════════════════════
// STUDENTS TABLE
// ══════════════════════════
let studentPage = 1;
const PAGE_SIZE = 20;

function renderStudents() {
  const query = document.getElementById("student-search").value.toLowerCase();
  const planF = document.getElementById("plan-filter").value;
  const yearF = document.getElementById("year-filter").value;

  let data = getData().slice().reverse();
  if (query)
    data = data.filter((r) =>
      (r.fullName + r.email + r.source).toLowerCase().includes(query),
    );
  if (planF) data = data.filter((r) => r.plan === planF);
  if (yearF) data = data.filter((r) => r.yearOfStudy === yearF);
  
  const statusF = document.getElementById("status-filter")?.value;
  if (statusF) data = data.filter((r) => r.paymentStatus === statusF);

  const total = data.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (studentPage > pages) studentPage = 1;
  const slice = data.slice(
    (studentPage - 1) * PAGE_SIZE,
    studentPage * PAGE_SIZE,
  );

  document.getElementById("student-count-label").textContent =
    total + " students";

  const tbody = document.getElementById("students-tbody");
  if (!slice.length) {
    tbody.innerHTML =
      '<tr><td colspan="9"><div class="empty-state"><span class="ei">🔍</span><p>No students found</p></div></td></tr>';
  } else {
    tbody.innerHTML = slice
      .map(
        (r, i) => `
    <tr style="cursor:pointer" onclick="openStudentModal('${esc(r.email)}')">
      <td style="color:var(--text-muted);font-size:12px;font-family:'JetBrains Mono',monospace">${(studentPage - 1) * PAGE_SIZE + i + 1}</td>
      <td><strong>${esc(r.fullName)}</strong></td>
      <td style="color:var(--text-muted);font-size:12px">${esc(r.email)}</td>
      <td style="font-family:'JetBrains Mono',monospace;font-size:12px">${esc(r.phone)}</td>
      <td><span class="badge ${r.plan === "Workshop Only" ? "badge-workshop" : "badge-internship"}">${esc(r.plan)}</span></td>
      <td><span class="badge badge-${r.paymentStatus === "paid" ? "success" : "warning"}">${esc(r.paymentStatus)}</span></td>
      <td style="font-size:11px;color:var(--text-muted);font-family:'JetBrains Mono',monospace">${fmtDate(r.timestamp)}</td>
    </tr>
  `,
      )
      .join("");
  }

  // Pagination
  const pg = document.getElementById("student-pagination");
  pg.innerHTML = "";
  for (let p = 1; p <= pages; p++) {
    const btn = document.createElement("button");
    btn.className = "pg-btn" + (p === studentPage ? " active" : "");
    btn.textContent = p;
    btn.onclick = () => {
      studentPage = p;
      renderStudents();
    };
    pg.appendChild(btn);
  }
}

// ══════════════════════════
// INTERNSHIP TABLE
// ══════════════════════════
let reviewingId = null;

function renderInternship() {
  const approvals = getApprovals();
  const statusF = document.getElementById("approval-filter").value;

  let data = getData()
    .filter((r) => r.plan === "Workshop + Internship" && r.paymentStatus === "paid")
    .slice()
    .reverse();

  if (statusF === "pending")
    data = data.filter(
      (r) => !approvals[r.id] || approvals[r.id] === "pending",
    );
  else if (statusF === "approved")
    data = data.filter((r) => approvals[r.id] === "approved");
  else if (statusF === "rejected")
    data = data.filter((r) => approvals[r.id] === "rejected");

  const tbody = document.getElementById("internship-tbody");
  if (!data.length) {
    tbody.innerHTML =
      '<tr><td colspan="8"><div class="empty-state"><span class="ei">🎓</span><p>No internship applications yet</p></div></td></tr>';
    return;
  }
  tbody.innerHTML = data
    .map((r, i) => {
      const status = approvals[r.email] || "pending";
      return `
  <tr>
    <td style="color:var(--text-muted);font-size:12px">${i + 1}</td>
    <td><strong>${esc(r.fullName)}</strong></td>
    <td style="color:var(--text-muted);font-size:12px">${esc(r.email)}</td>
    <td style="font-size:11px;color:var(--text-muted);font-family:'JetBrains Mono',monospace">${fmtDate(r.timestamp)}</td>
    <td><span class="badge badge-${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></td>
    <td>
      <button class="action-btn btn-info" style="padding:5px 12px;font-size:11px" onclick="openReviewModal('${esc(r.email)}')">Review</button>
    </td>
  </tr>
`;
    })
    .join("");
}

function openReviewModal(email) {
  const data = getData();
  const r = data.find((d) => d.email == email);
  if (!r) return;
  reviewingId = email;
  const approvals = getApprovals();
  const status = approvals[email] || "pending";
  document.getElementById("review-modal-title").textContent =
    "Internship: " + r.fullName;
  document.getElementById("review-modal-sub").textContent =
    "Current status: " + status;
  document.getElementById("review-modal-fields").innerHTML = `
  <div class="modal-field"><label>Email</label><div class="val">${esc(r.email)}</div></div>
  <div class="modal-field"><label>Phone</label><div class="val">${esc(r.phone)}</div></div>
  <div class="modal-field"><label>Registered</label><div class="val">${fmtDate(r.timestamp)}</div></div>
  <div class="modal-field"><label>Motivation</label><div class="val" style="font-size:13px;color:var(--text-muted)">${esc(r.motivation || "Not provided")}</div></div>
`;
  document.getElementById("review-modal").classList.add("open");
}

function approveInternship() {
  if (!reviewingId) return;
  const a = getApprovals();
  a[reviewingId] = "approved";
  setApprovals(a);
  closeReviewModal();
  renderInternship();
  renderStats();
  showToast("✅ Internship approved!", "success");
}

function rejectInternship() {
  if (!reviewingId) return;
  const a = getApprovals();
  a[reviewingId] = "rejected";
  setApprovals(a);
  closeReviewModal();
  renderInternship();
  renderStats();
  showToast("❌ Internship rejected", "info");
}

function closeReviewModal() {
  document.getElementById("review-modal").classList.remove("open");
  reviewingId = null;
}

// ══════════════════════════
// STUDENT MODAL
// ══════════════════════════
function openStudentModal(email) {
  const data = getData();
  const r = data.find((d) => d.email == email);
  if (!r) return;
  document.getElementById("modal-subtitle").textContent =
    "Registered: " + fmtDate(r.timestamp);
  document.getElementById("modal-fields").innerHTML = `
  <div class="modal-field"><label>Full Name</label><div class="val">${esc(r.fullName)}</div></div>
  <div class="modal-field"><label>Email</label><div class="val">${esc(r.email)}</div></div>
  <div class="modal-field"><label>Phone</label><div class="val">${esc(r.phone)}</div></div>
  <div class="modal-field"><label>Plan</label><div class="val">${esc(r.plan)}</div></div>
  <div class="modal-field"><label>Payment Status</label><div class="val"><span class="badge badge-${r.paymentStatus === "paid" ? "success" : "warning"}">${esc(r.paymentStatus)}</span></div></div>
  <div class="modal-field"><label>Programming Experience</label><div class="val">${esc(r.programmingExperience)}</div></div>
  <div class="modal-field"><label>Source</label><div class="val">${esc(r.source || "Not specified")}</div></div>
  <div class="modal-field"><label>Motivation</label><div class="val" style="font-size:13px;color:var(--text-muted)">${esc(r.motivation || "Not provided")}</div></div>
`;
  document.getElementById("student-modal").classList.add("open");
}

function closeModal() {
  document.getElementById("student-modal").classList.remove("open");
}

// Close modals on overlay click
document
  .getElementById("student-modal")
  .addEventListener("click", function (e) {
    if (e.target === this) closeModal();
  });
document.getElementById("review-modal").addEventListener("click", function (e) {
  if (e.target === this) closeReviewModal();
});

// ══════════════════════════
// CSV EXPORT
// ══════════════════════════
function exportCSV() {
  const data = getData();
  if (!data.length) {
    showToast("No data to export", "info");
    return;
  }
  const headers = [
    "#",
    "Full Name",
    "Email",
    "Phone",
    "Plan",
    "Programming Exp",
    "Motivation",
    "Source",
    "Payment Status",
    "Payment Date",
    "Timestamp",
  ];
  const rows = data.map((r, i) => [
    i + 1,
    r.fullName,
    r.email,
    r.phone,
    r.plan,
    r.programmingExperience,
    r.motivation,
    r.source,
    r.paymentStatus,
    r.paymentDate,
    r.timestamp,
  ]);
  downloadCSV([headers, ...rows], "cps_registrations.csv");
  showToast("✅ CSV downloaded!", "success");
}

function exportInternshipCSV() {
  const approvals = getApprovals();
  const data = getData().filter((r) => r.plan === "Workshop + Internship");
  if (!data.length) {
    showToast("No internship data to export", "info");
    return;
  }
  const headers = [
    "#",
    "Name",
    "Email",
    "Phone",
    "College",
    "Year",
    "Status",
    "Timestamp",
  ];
  const rows = data.map((r, i) => [
    i + 1,
    r.fullName,
    r.email,
    r.phone,
    r.college,
    r.yearOfStudy,
    approvals[r.id] || "pending",
    r.timestamp,
  ]);
  downloadCSV([headers, ...rows], "cps_internship.csv");
  showToast("✅ Internship CSV downloaded!", "success");
}

function downloadCSV(rows, filename) {
  const csv = rows
    .map((r) =>
      r.map((v) => '"' + String(v || "").replace(/"/g, '""') + '"').join(","),
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ══════════════════════════
// ANNOUNCEMENTS
// ══════════════════════════
function sendAnnouncement() {
  const recipients = document.getElementById("ann-recipients").value;
  const title = document.getElementById("ann-title").value.trim();
  const body = document.getElementById("ann-body").value.trim();
  if (!title || !body) {
    showToast("Please fill in title and message", "info");
    return;
  }

  const data = getData();
  let targets = data;
  if (recipients === "workshop")
    targets = data.filter((r) => r.plan === "Workshop Only");
  else if (recipients === "internship")
    targets = data.filter((r) => r.plan === "Workshop + Internship");
  else if (recipients === "approved") {
    const a = getApprovals();
    targets = data.filter((r) => a[r.id] === "approved");
  }

  // Log the announcement
  saveAnnouncement({
    title,
    body,
    recipients,
    count: targets.length,
    timestamp: new Date().toISOString(),
  });

  document.getElementById("ann-title").value = "";
  document.getElementById("ann-body").value = "";
  renderAnnouncements();
  showToast(
    `📤 Announcement logged for ${targets.length} student(s)`,
    "success",
  );
}

function renderAnnouncements() {
  const list = getAnnouncements();
  const log = document.getElementById("announce-log");
  if (!list.length) {
    log.innerHTML =
      '<div class="empty-state" style="padding:24px"><span class="ei">📭</span><p>No announcements sent yet</p></div>';
    return;
  }
  log.innerHTML =
    "<h4>Sent Announcements</h4>" +
    list
      .map(
        (a) => `
  <div class="log-item">
    <div class="log-item-hdr">
      <div class="log-item-title">${esc(a.title)}</div>
      <div class="log-item-meta">${fmtDate(a.timestamp)} · ${a.count} recipients</div>
    </div>
    <div class="log-item-body">${esc(a.body.substring(0, 120))}${a.body.length > 120 ? "…" : ""}</div>
  </div>
`,
      )
      .join("");
}

// ══════════════════════════
// UTILS
// ══════════════════════════
function esc(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fmtDate(ts) {
  if (!ts) return "—";
  try {
    const d = new Date(ts);
    return (
      d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      }) +
      " " +
      d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  } catch {
    return ts;
  }
}

let toastTimer;
function showToast(msg, type = "info") {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "toast show " + type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3000);
}

function getAnnouncements() {
  return JSON.parse(localStorage.getItem("cps_announcements") || "[]");
}

function saveAnnouncement(ann) {
  const list = getAnnouncements();
  list.unshift(ann);
  localStorage.setItem("cps_announcements", JSON.stringify(list));
}

// Init
// addDemoData removed
