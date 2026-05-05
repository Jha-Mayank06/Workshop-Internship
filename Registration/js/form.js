/**
 * ══════════════════════════════════════════════════════════════════
 * CPS & ROBOTICS WORKSHOP — REGISTRATION FORM LOGIC
 * Version: 2.2 (Database Field Mapping Fix)
 * ══════════════════════════════════════════════════════════════════
 */

const CONFIG = {
  WEBHOOK_ALBATO: "https://h.albato.com/wh/38/1lfvfuc/P8dQFE_HzIRbObMx-xQOn4r78v572zT-7lXhsOzIt2c/",
  CRM_WEBHOOK: "YOUR_CRM_WEBHOOK_URL_HERE", 
  PAYMENT_WORKSHOP: "https://payu.in/web/6FA008C5D64868F877D542B31F86F9C3",
  PAYMENT_INTERNSHIP: "https://payu.in/web/6FA008C5D64868F877D542B31F86F9C3",
  DEADLINE: "2026-05-15T23:59:59",
};

let selectedPlan = "workshop";

/** 
 * ── PLAN SELECTION ──
 */
function selectPlan(plan) {
  selectedPlan = plan;

  document.querySelectorAll(".plan-opt").forEach((el) => {
    el.classList.remove("selected-workshop", "selected-internship");
    el.querySelector(".plan-opt-check").textContent = "";
  });

  const el = document.getElementById("opt-" + plan);
  if (el) {
    el.classList.add("selected-" + plan);
    el.querySelector(".plan-opt-check").textContent = "✓";
    const radio = el.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;
  }

  const amountDisplay = document.getElementById("pay-amount");
  if (amountDisplay) {
    amountDisplay.textContent = plan === "internship" ? "₹299" : "₹199";
  }
}

/** 
 * ── COUNTDOWN TIMER ──
 */
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

  dEl.innerText = String(Math.floor(gap / (1000 * 60 * 60 * 24))).padStart(2, "0");
  hEl.innerText = String(Math.floor((gap / (1000 * 60 * 60)) % 24)).padStart(2, "0");
  mEl.innerText = String(Math.floor((gap / (1000 * 60)) % 60)).padStart(2, "0");
  sEl.innerText = String(Math.floor((gap / 1000) % 60)).padStart(2, "0");
}

/** 
 * ── PAYMENT LOGIC ──
 */
function checkPaymentDone() {
  return sessionStorage.getItem("cps_payment_done") === "true";
}

function goToPayment() {
  const link = selectedPlan === "internship" ? CONFIG.PAYMENT_INTERNSHIP : CONFIG.PAYMENT_WORKSHOP;
  window.open(link, "_blank");
  
  const payBtn = document.getElementById("pay-btn");
  if (payBtn) {
    payBtn.textContent = "✅ Paid? Continue to Form ↓";
    payBtn.style.background = "#10B981";
    sessionStorage.setItem("cps_payment_done", "true");
    markAsPaid();
  }
}

function markAsPaid() {
  sessionStorage.setItem("cps_payment_done", "true");
  const badge = document.getElementById("payment-done-badge");
  if (badge) badge.style.display = "block";
  
  const paySection = document.getElementById("pay-section");
  if (paySection) {
    paySection.style.background = "#ecfdf5";
    paySection.style.borderColor = "#10b981";
  }

  const payBtn = document.getElementById("pay-btn");
  if (payBtn) {
    payBtn.textContent = "✅ Payment Done";
    payBtn.disabled = true;
  }

  const step2 = document.getElementById("step-2");
  const step3 = document.getElementById("step-3");
  if (step2) step2.className = "step done";
  if (step3) step3.className = "step active";
}

/** 
 * ── FORM SUBMISSION ──
 */
async function handleSubmit() {
  const errMsg = document.getElementById("err-msg");
  if (errMsg) errMsg.style.display = "none";

  const fields = {
    fullName: document.getElementById("fullName"),
    phone: document.getElementById("phone"),
    email: document.getElementById("email"),
    college: document.getElementById("college"),
    dept: document.getElementById("dept"),
    year: document.getElementById("year"),
    exp: document.querySelector('input[name="exp"]:checked')
  };

  let valid = true;
  for (const key in fields) {
    if (!fields[key] || (fields[key].value === undefined ? !fields[key] : !fields[key].value.trim())) {
      valid = false;
      if (fields[key] && fields[key].classList) {
        fields[key].classList.add("err");
        fields[key].addEventListener("input", () => fields[key].classList.remove("err"), { once: true });
      }
    }
  }

  if (!valid) {
    if (errMsg) errMsg.style.display = "block";
    window.scrollTo({ top: document.querySelector(".err")?.offsetTop - 100, behavior: "smooth" });
    return;
  }

  const btn = document.getElementById("submit-btn");
  const btnText = document.getElementById("btn-text");
  btn.disabled = true;
  btnText.textContent = "Submitting...";

  // ── MAPPING PAYLOAD TO DATABASE FIELDS (from script.js) ──
  const payload = {
    full_name: fields.fullName.value.trim(),
    phone_whatsapp: fields.phone.value.trim(),
    email: fields.email.value.trim(),
    selected_plan: selectedPlan,
    payment_status: checkPaymentDone() ? "paid" : "pending",
    programming_experience: fields.exp.value,
    motivation: document.getElementById("motivation").value.trim() || "N/A",
    lead_source: document.getElementById("source").value || "N/A",
    submitted_at: new Date().toISOString(),
    // Additional fields for Version 2.0 structure
    college_name: fields.college.value.trim(),
    department: fields.dept.value.trim(),
    year_of_study: fields.year.value,
    roll_number: document.getElementById("rollNo").value.trim() || "N/A"
  };

  try {
    const response = await fetch(CONFIG.WEBHOOK_ALBATO, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error("Webhook failed");

    document.getElementById("success-name").textContent = payload.full_name.split(" ")[0];
    document.getElementById("success-plan").textContent = 
      selectedPlan === "internship" ? "Workshop + Internship Plan" : "Workshop Only Plan";
    
    document.getElementById("form-card").style.display = "none";
    document.getElementById("success-screen").style.display = "block";
    
    const reminder = document.getElementById("payment-reminder");
    if (reminder) reminder.style.display = checkPaymentDone() ? "none" : "block";
    
    window.scrollTo({ top: 0, behavior: "smooth" });

  } catch (error) {
    if (errMsg) {
      errMsg.textContent = "⚠️ Submission failed. Please try again.";
      errMsg.style.display = "block";
    }
  } finally {
    btn.disabled = false;
    btnText.textContent = "🚀 Complete Registration";
  }
}

/** 
 * ── INITIALIZATION ──
 */
(function init() {
  setInterval(updateCountdown, 1000);
  updateCountdown();
  selectPlan("workshop");
  if (checkPaymentDone()) {
    markAsPaid();
  }
})();
