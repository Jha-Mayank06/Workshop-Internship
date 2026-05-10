/**
 * ══════════════════════════════════════════════════════════════════
 * CPS & ROBOTICS WORKSHOP — REGISTRATION FORM LOGIC
 * Version: 2.3 (Simplified Fields)
 * ══════════════════════════════════════════════════════════════════
 */

const CONFIG = {
  WEBHOOK_ALBATO: "https://h.albato.com/wh/38/1lfio9j/gvosNMW4h5LB_cSBacc5Dv5T900Yp8vhpfdAZD0nNFg/",
  RAZORPAY_BUTTON_ID: "pl_SnALRE7FDQxX6q",
  DEADLINE: "2026-05-15T23:59:59",
};

let selectedPlan = "workshop";
const errMsg = document.getElementById("err-msg");

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

  // Update payment amount in Step 3
  const finalAmt = document.getElementById("final-amount");
  if (finalAmt) {
    finalAmt.textContent = plan === "internship" ? "₹299" : "₹199";
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

/** 
 * ── PAYMENT HANDLING ──
 */


function markAsPaid() {
  sessionStorage.setItem("cps_payment_done", "true");

  // Show Success Screen
  document.getElementById("form-card").style.display = "none";
  document.getElementById("success-screen").style.display = "block";

  // Restore name/plan from session storage if available
  const savedName = sessionStorage.getItem("cps_user_name");
  const savedPlan = sessionStorage.getItem("cps_user_plan");
  if (savedName) document.getElementById("success-name").textContent = savedName;
  if (savedPlan) document.getElementById("success-plan").textContent = savedPlan;

  // SHOW WHATSAPP LINK ONLY NOW
  const waContainer = document.getElementById("whatsapp-container");
  if (waContainer) waContainer.style.display = "block";

  window.scrollTo({ top: 0, behavior: "smooth" });

  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");
  const step3 = document.getElementById("step-3");
  if (step1) step1.className = "step done";
  if (step2) step2.className = "step done";
  if (step3) step3.className = "step done";
}

/** 
 * ── RAZORPAY INTEGRATION ──
 */
function openRazorpay() {
  const amount = selectedPlan === "internship" ? 2 : 1;
  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;

  const options = {
    "key": "rzp_live_SnFtD0dQcw1cPz", // Live Key ID integrated
    "amount": amount * 100, // Amount in paise
    "currency": "INR",
    "name": "PiSquare Academy",
    "description": "CPS & Robotics Workshop - " + (selectedPlan === "internship" ? "Internship" : "Workshop"),
    "handler": async function (response) {
      // Payment Successful
      console.log("Payment Success:", response.razorpay_payment_id);
      
      // Send Unified Update
      await sendUnifiedWebhook("Paid", response.razorpay_payment_id);

      // Show Success Screen
      markAsPaid();
    },
    "prefill": {
      "name": fullName,
      "email": email,
      "contact": phone
    },
    "theme": {
      "color": "#FF6B00"
    },
    "modal": {
      "ondismiss": function () {
        // Payment Cancelled
        document.getElementById("cancel-msg").style.display = "block";
        window.scrollTo({ top: document.getElementById("cancel-msg").offsetTop - 100, behavior: "smooth" });
      }
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}

/** 
 * ── UNIFIED WEBHOOK ──
 */
async function sendUnifiedWebhook(status, paymentId = "") {
  const fullNameField = document.getElementById("fullName");
  const phoneField = document.getElementById("phone");
  const emailField = document.getElementById("email");
  const sourceField = document.getElementById("source");

  const rawPhone = "+91" + phoneField.value.replace(/\D/g, "").replace(/^0+/, "").replace(/^91/, "");
  
  const payload = {
    timestamp: new Date().toISOString(),
    plan: selectedPlan === "internship" ? "Workshop + Internship" : "Workshop Only",
    fullName: fullNameField.value.trim(),
    email: emailField.value.trim(),
    phone: rawPhone,
    source: sourceField ? sourceField.value : "Not specified",
    paymentStatus: status,
    paymentDate: paymentId ? new Date().toISOString() : "",
    paymentId: paymentId,
    wpLinkSent: "FALSE",
    followUpSent: "FALSE"
  };

  try {
    await fetch(CONFIG.WEBHOOK_ALBATO, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error("Webhook failed:", err);
  }
}

/** 
 * ── FORM SUBMISSION ──
 */
async function handleSubmit() {
  if (errMsg) errMsg.style.display = "none";
  const cancelMsg = document.getElementById("cancel-msg");
  if (cancelMsg) cancelMsg.style.display = "none";

  const fields = {
    fullName: document.getElementById("fullName"),
    phone: document.getElementById("phone"),
    email: document.getElementById("email")
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
    const firstErr = document.querySelector(".err");
    if (firstErr) window.scrollTo({ top: firstErr.offsetTop - 100, behavior: "smooth" });
    return;
  }

  const btn = document.getElementById("submit-btn");
  const btnText = document.getElementById("btn-text");
  btn.disabled = true;
  btnText.textContent = "Processing Lead...";

  const rawPhone = "+91" + fields.phone.value
    .replace(/\D/g, "")
    .replace(/^0+/, "")
    .replace(/^91/, "");

  try {
    // Send Unified Pending Lead
    await sendUnifiedWebhook("pending");

    // Success: details captured. Now move to payment.
    const firstName = fields.fullName.value.trim().split(" ")[0];
    const planText = selectedPlan === "internship" ? "Workshop + Internship Plan" : "Workshop Only Plan";

    // Store for persistence
    sessionStorage.setItem("cps_user_name", firstName);
    sessionStorage.setItem("cps_user_plan", planText);

    document.getElementById("success-name").textContent = firstName;
    document.getElementById("success-plan").textContent = planText;

    // UI Transition to Step 3
    document.getElementById("details-section").style.display = "none";
    const paySection = document.getElementById("pay-section");
    paySection.style.display = "block";
    paySection.style.opacity = "1";
    paySection.style.pointerEvents = "auto";

    const step2 = document.getElementById("step-2");
    const step3 = document.getElementById("step-3");
    if (step2) step2.className = "step done";
    if (step3) step3.className = "step active";

    window.scrollTo({ top: paySection.offsetTop - 100, behavior: "smooth" });

  } catch (error) {
    if (errMsg) {
      errMsg.textContent = "⚠️ Lead capture failed. Please check your connection.";
      errMsg.style.display = "block";
    }
  } finally {
    btn.disabled = false;
    btnText.textContent = "Proceed to Payment →";
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
