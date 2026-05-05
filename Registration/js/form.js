// ══════════════════════════════════════════════════════════════════
// CPS & ROBOTICS WORKSHOP — REGISTRATION FORM
// Version: 2.0 (with CRM + Payment integration)
// ══════════════════════════════════════════════════════════════════

// ── CONFIG: Change these URLs if they ever change ─────────────────
const CONFIG = {
  // Your Albato webhook (already working, keep as backup)
  WEBHOOK_ALBATO:
    "https://h.albato.com/wh/38/1lfvfuc/P8dQFE_HzIRbObMx-xQOn4r78v572zT-7lXhsOzIt2c/",

  // AuraCRM webhook endpoint (Pi2 CRM on Railway)
  // HOW TO GET THIS:
  //   1. Go to https://student-crm-production.up.railway.app/
  //   2. Click "Webhooks" in the left menu
  //   3. Create a new incoming webhook → copy the URL and paste it below
  CRM_WEBHOOK: "YOUR_CRM_WEBHOOK_URL_HERE",

  // PayU payment links (already working!)
  PAYMENT_WORKSHOP: "https://payu.in/web/6FA008C5D64868F877D542B31F86F9C3",
  PAYMENT_INTERNSHIP: "https://payu.in/web/6FA008C5D64868F877D542B31F86F9C3", // Use same or a different PayU link for ₹299

  // Registration deadline countdown
  DEADLINE: "2026-05-15T23:59:59",
};

// ══════════════════════════════════════════════════════════════════
// PLAN SELECTION
// ══════════════════════════════════════════════════════════════════
let selectedPlan = "workshop";

function selectPlan(plan) {
  selectedPlan = plan;

  // Remove all selected states
  document.querySelectorAll(".plan-opt").forEach((el) => {
    el.classList.remove("selected-workshop", "selected-internship");
    el.querySelector(".plan-opt-check").textContent = "";
  });

  // Apply selected state
  const el = document.getElementById("opt-" + plan);
  el.classList.add("selected-" + plan);
  el.querySelector(".plan-opt-check").textContent = "✓";
  el.querySelector('input[type="radio"]').checked = true;
}

// ══════════════════════════════════════════════════════════════════
// COUNTDOWN TIMER
// ══════════════════════════════════════════════════════════════════
function updateCountdown() {
  const dEl = document.getElementById("s-d");
  const hEl = document.getElementById("s-h");
  const mEl = document.getElementById("s-m");
  const sEl = document.getElementById("s-s");
  if (!dEl || !hEl || !mEl || !sEl) return;

  const now = new Date().getTime();
  const gap = new Date(CONFIG.DEADLINE).getTime() - now;

  if (gap <= 0) {
    dEl.innerText = hEl.innerText = mEl.innerText = sEl.innerText = "00";
    return;
  }

  dEl.innerText = String(Math.floor(gap / (1000 * 60 * 60 * 24))).padStart(
    2,
    "0",
  );
  hEl.innerText = String(Math.floor((gap / (1000 * 60 * 60)) % 24)).padStart(
    2,
    "0",
  );
  mEl.innerText = String(Math.floor((gap / (1000 * 60)) % 60)).padStart(2, "0");
  sEl.innerText = String(Math.floor((gap / 1000) % 60)).padStart(2, "0");
}
setInterval(updateCountdown, 1000);
updateCountdown();

// ══════════════════════════════════════════════════════════════════
// FORM VALIDATION
// ══════════════════════════════════════════════════════════════════
function validateForm() {
  let valid = true;

  // Check required text/select fields
  const required = ["fullName", "phone", "email", "college", "dept", "year"];
  required.forEach((id) => {
    const el = document.getElementById(id);
    if (!el || !el.value.trim()) {
      el && el.classList.add("err");
      el &&
        el.addEventListener("input", () => el.classList.remove("err"), {
          once: true,
        });
      valid = false;
    }
  });

  // Validate email format
  const emailEl = document.getElementById("email");
  if (
    emailEl &&
    emailEl.value &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)
  ) {
    emailEl.classList.add("err");
    valid = false;
  }

  // Validate phone format
  const phoneEl = document.getElementById("phone");
  if (phoneEl && phoneEl.value && !/^[+\d\s\-]{8,15}$/.test(phoneEl.value)) {
    phoneEl.classList.add("err");
    valid = false;
  }

  // Check programming experience radio
  if (!document.querySelector('input[name="exp"]:checked')) {
    valid = false;
  }

  return valid;
}

// ══════════════════════════════════════════════════════════════════
// SEND DATA TO CRM (AuraCRM / Pi2)
// ══════════════════════════════════════════════════════════════════
async function sendToCRM(payload) {
  // Skip if CRM webhook URL is not configured yet
  if (
    CONFIG.CRM_WEBHOOK ===
    "https://h.albato.com/wh/38/1lfvfuc/P8dQFE_HzIRbObMx-xQOn4r78v572zT-7lXhsOzIt2c/  "
  ) {
    console.log("ℹ️ CRM webhook not configured yet. Skipping CRM save.");
    console.log("📋 Data that would be sent:", payload);
    return;
  }

  try {
    await fetch(CONFIG.CRM_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      mode: "no-cors",
    });
    console.log("✅ Data sent to CRM");
  } catch (err) {
    console.warn("⚠️ CRM send failed (data still saved locally):", err);
  }
}

// ══════════════════════════════════════════════════════════════════
// SEND DATA TO ALBATO WEBHOOK (Google Sheets / Email backup)
// ══════════════════════════════════════════════════════════════════
async function sendToAlbato(payload) {
  try {
    await fetch(CONFIG.WEBHOOK_ALBATO, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      mode: "no-cors",
    });
    console.log("✅ Data sent to Albato");
  } catch (err) {
    console.warn("⚠️ Albato send failed:", err);
  }
}

// ══════════════════════════════════════════════════════════════════
// SAVE TO LOCALSTORAGE (admin dashboard backup)
// ══════════════════════════════════════════════════════════════════
function saveToLocalStorage(payload) {
  try {
    const registrations = JSON.parse(
      localStorage.getItem("cps_registrations") || "[]",
    );
    const entry = { ...payload, id: Date.now() };
    registrations.push(entry);
    localStorage.setItem("cps_registrations", JSON.stringify(registrations));
    console.log("✅ Data saved to localStorage");
    return entry.id;
  } catch (err) {
    console.warn("⚠️ localStorage save failed:", err);
    return Date.now();
  }
}

// ══════════════════════════════════════════════════════════════════
// MAIN SUBMIT HANDLER
// ══════════════════════════════════════════════════════════════════
async function handleSubmit() {
  // Hide previous error
  const errMsg = document.getElementById("err-msg");
  errMsg.style.display = "none";

  // Validate
  if (!validateForm()) {
    errMsg.style.display = "block";
    document
      .querySelector(".err")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // Show loading state
  const btn = document.getElementById("submit-btn");
  const btnText = document.getElementById("btn-text");
  btn.disabled = true;
  btnText.innerHTML = '<div class="spinner"></div> Saving your registration...';

  // Build registration payload
  const payload = {
    timestamp: new Date().toISOString(),
    plan:
      selectedPlan === "internship" ? "Workshop + Internship" : "Workshop Only",
    price: selectedPlan === "internship" ? "₹299" : "₹199",
    fullName: document.getElementById("fullName").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    college: document.getElementById("college").value.trim(),
    department: document.getElementById("dept").value.trim(),
    yearOfStudy: document.getElementById("year").value,
    rollNumber:
      document.getElementById("rollNo").value.trim() || "Not provided",
    programmingExperience:
      document.querySelector('input[name="exp"]:checked')?.value || "",
    motivation:
      document.getElementById("motivation").value.trim() || "Not provided",
    source: document.getElementById("source").value || "Not specified",
    // Payment tracking
    paymentStatus: checkPaymentDone() ? "paid" : "pending",
    registrationSource: "website",
  };

  // ── Save everywhere in parallel ─────────────────────────────────
  await Promise.allSettled([sendToAlbato(payload), sendToCRM(payload)]);

  // Always save to localStorage (admin dashboard uses this)
  saveToLocalStorage(payload);

  // ── Show success screen ─────────────────────────────────────────
  const firstName = payload.fullName.split(" ")[0];
  document.getElementById("success-name").textContent = firstName;
  document.getElementById("success-plan").textContent = payload.plan;

  // Show payment reminder if not yet paid
  const paymentReminder = document.getElementById("payment-reminder");
  if (paymentReminder) {
    paymentReminder.style.display = checkPaymentDone() ? "none" : "block";
  }

  document.getElementById("form-card").style.display = "none";
  document.getElementById("success-screen").style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ══════════════════════════════════════════════════════════════════
// PAYMENT FLOW
// Marks in URL/localStorage that payment was completed
// ══════════════════════════════════════════════════════════════════

// Check if student already paid (PayU sets ?payment=success in URL after redirect)
function checkPaymentDone() {
  const urlParams = new URLSearchParams(window.location.search);
  return (
    urlParams.get("payment") === "success" ||
    sessionStorage.getItem("cps_payment_done") === "true"
  );
}

// Open PayU payment page (opens in same tab so PayU can redirect back)
function goToPayment() {
  const link =
    selectedPlan === "internship"
      ? CONFIG.PAYMENT_INTERNSHIP
      : CONFIG.PAYMENT_WORKSHOP;

  // Mark intent in sessionStorage before leaving page
  sessionStorage.setItem("cps_payment_plan", selectedPlan);

  // Open PayU payment page
  window.open(link, "_blank");

  // Show a "I've paid, continue to form" message
  const payBtn = document.getElementById("pay-btn");
  if (payBtn) {
    payBtn.textContent = "✅ Paid? Continue to Fill Form Below ↓";
    payBtn.style.background = "#10B981";
    sessionStorage.setItem("cps_payment_done", "true");
  }
}

// Restore plan from sessionStorage if returning from payment
function restorePlanAfterPayment() {
  const savedPlan = sessionStorage.getItem("cps_payment_plan");
  if (savedPlan) {
    selectPlan(savedPlan);
  }
  if (checkPaymentDone()) {
    // Show a subtle "payment received" indicator
    const payBadge = document.getElementById("payment-done-badge");
    if (payBadge) payBadge.style.display = "flex";
  }
}

// Run on page load
restorePlanAfterPayment();
