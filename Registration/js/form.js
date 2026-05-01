// ══════════════════════════════════════════
// WEBHOOK URL — Replace with your actual webhook
// ══════════════════════════════════════════
const WEBHOOK_URL =
  "https://h.albato.com/wh/38/1lfvfuc/P8dQFE_HzIRbObMx-xQOn4r78v572zT-7lXhsOzIt2c/";

// COUNTDOWN
const target = new Date("2025-08-01T09:00:00");
function tick() {
  const diff = target - new Date();
  if (diff <= 0) return;
  const d = Math.floor(diff / 86400000),
    h = Math.floor((diff % 86400000) / 3600000),
    m = Math.floor((diff % 3600000) / 60000),
    s = Math.floor((diff % 60000) / 1000);
  document.getElementById("s-d").textContent = String(d).padStart(2, "0");
  document.getElementById("s-h").textContent = String(h).padStart(2, "0");
  document.getElementById("s-m").textContent = String(m).padStart(2, "0");
  document.getElementById("s-s").textContent = String(s).padStart(2, "0");
}
tick();
setInterval(tick, 1000);

// PLAN SELECTION
let selectedPlan = "workshop";
function selectPlan(plan) {
  selectedPlan = plan;
  document.querySelectorAll(".plan-opt").forEach((el) => {
    el.classList.remove("selected-workshop", "selected-internship");
    el.querySelector(".plan-opt-check").textContent = "";
  });
  const el = document.getElementById("opt-" + plan);
  el.classList.add("selected-" + plan);
  el.querySelector(".plan-opt-check").textContent = "✓";
  el.querySelector('input[type="radio"]').checked = true;
}

// VALIDATION
function validateForm() {
  let valid = true;
  const required = ["fullName", "phone", "email", "college", "dept", "year"];
  required.forEach((id) => {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      el.classList.add("err");
      el.addEventListener("input", () => el.classList.remove("err"), {
        once: true,
      });
      valid = false;
    }
  });
  const emailEl = document.getElementById("email");
  if (emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
    emailEl.classList.add("err");
    valid = false;
  }
  const phoneEl = document.getElementById("phone");
  if (phoneEl.value && !/^[+\d\s\-]{8,15}$/.test(phoneEl.value)) {
    phoneEl.classList.add("err");
    valid = false;
  }
  if (!document.querySelector('input[name="exp"]:checked')) valid = false;
  return valid;
}

// SUBMIT HANDLER
async function handleSubmit() {
  const errMsg = document.getElementById("err-msg");
  errMsg.style.display = "none";

  if (!validateForm()) {
    errMsg.style.display = "block";
    document
      .querySelector(".err")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const btn = document.getElementById("submit-btn");
  const btnText = document.getElementById("btn-text");
  btn.disabled = true;
  btnText.innerHTML = '<div class="spinner"></div> Submitting...';

  const payload = {
    timestamp: new Date().toISOString(),
    plan:
      selectedPlan === "internship" ? "Workshop + Internship" : "Workshop Only",
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
  };

  try {
    // Send to webhook
    if (WEBHOOK_URL !== "YOUR_WEBHOOK_URL_HERE") {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        mode: "no-cors", // Use 'cors' if your webhook supports it
      });
    }

    // Save to localStorage for admin dashboard
    const registrations = JSON.parse(
      localStorage.getItem("cps_registrations") || "[]",
    );
    registrations.push({ ...payload, id: Date.now() });
    localStorage.setItem("cps_registrations", JSON.stringify(registrations));

    // Show success
    const firstName = payload.fullName.split(" ")[0];
    document.getElementById("success-name").textContent = firstName;
    document.getElementById("success-plan").textContent = payload.plan;
    document.getElementById("form-card").style.display = "none";
    document.getElementById("success-screen").style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    console.error("Submission error:", err);
    // Still show success to user (webhook may be no-cors)
    const firstName = payload.fullName.split(" ")[0];
    document.getElementById("success-name").textContent = firstName;
    document.getElementById("success-plan").textContent = payload.plan;
    document.getElementById("form-card").style.display = "none";
    document.getElementById("success-screen").style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
// ===== COUNTDOWN TIMER (SAFE FOR MULTIPLE PAGES) =====

const deadline = new Date("2026-05-15T23:59:59").getTime();

function updateCountdown() {
  const dEl = document.getElementById("s-d");
  const hEl = document.getElementById("s-h");
  const mEl = document.getElementById("s-m");
  const sEl = document.getElementById("s-s");

  // 🔴 If elements not present → exit safely
  if (!dEl || !hEl || !mEl || !sEl) return;

  const now = new Date().getTime();
  const gap = deadline - now;

  if (gap <= 0) {
    dEl.innerText = "00";
    hEl.innerText = "00";
    mEl.innerText = "00";
    sEl.innerText = "00";
    return;
  }

  const days = Math.floor(gap / (1000 * 60 * 60 * 24));
  const hours = Math.floor((gap / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((gap / (1000 * 60)) % 60);
  const seconds = Math.floor((gap / 1000) % 60);

  dEl.innerText = String(days).padStart(2, "0");
  hEl.innerText = String(hours).padStart(2, "0");
  mEl.innerText = String(minutes).padStart(2, "0");
  sEl.innerText = String(seconds).padStart(2, "0");
}

setInterval(updateCountdown, 1000);
updateCountdown();
