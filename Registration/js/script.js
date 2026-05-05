const ALBATO_WEBHOOK_URL = "https://h.albato.com/wh/38/1lfvfuc/P8dQFE_HzIRbObMx-xQOn4r78v572zT-7lXhsOzIt2c/";

function selectPlanAndUpdatePayment(plan) {
  document.querySelectorAll('.plan-opt').forEach(el => el.classList.remove('selected'));
  document.getElementById(plan === 'internship' ? 'opt-internship' : 'opt-workshop').classList.add('selected');
  document.querySelector(`input[name="plan"][value="${plan}"]`).checked = true;
  document.getElementById('pay-amount').textContent = plan === 'internship' ? '₹299' : '₹199';
}

function goToPayment() {
  alert('Add your actual payment gateway URL inside goToPayment() to redirect users. For now, use “Already paid?” to continue testing the form.');
}

function markAsPaid() {
  sessionStorage.setItem('cps_payment_done', 'true');
  document.getElementById('payment-done-badge').style.display = 'block';
  document.getElementById('pay-section').style.background = '#ecfdf5';
  document.getElementById('pay-section').style.borderColor = '#10b981';
  document.getElementById('pay-btn').textContent = '✅ Payment Done';
  document.getElementById('pay-btn').disabled = true;
  document.getElementById('step-2').className = 'step done';
  document.getElementById('step-3').className = 'step active';
  document.getElementById('fullName').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

async function handleSubmit() {
  const fullName = document.getElementById('fullName').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const motivation = document.getElementById('motivation').value.trim();
  const source = document.getElementById('source').value;
  const selectedPlan = document.querySelector('input[name="plan"]:checked')?.value || '';
  const exp = document.querySelector('input[name="exp"]:checked')?.value || '';
  const paymentDone = sessionStorage.getItem('cps_payment_done') === 'true';
  const errMsg = document.getElementById('err-msg');
  const btn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');

  if (!fullName || !phone || !email || !exp || !selectedPlan) {
    errMsg.textContent = '⚠️ Please fill all required fields correctly.';
    errMsg.style.display = 'block';
    return;
  }
  errMsg.style.display = 'none';
  btn.disabled = true;
  btnText.textContent = 'Submitting...';

  const payload = {
    full_name: fullName,
    phone_whatsapp: phone,
    email: email,
    selected_plan: selectedPlan,
    payment_status: paymentDone ? 'paid' : 'pending',
    programming_experience: exp,
    motivation: motivation,
    lead_source: source,
    submitted_at: new Date().toISOString()
  };

  try {
    const response = await fetch(ALBATO_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Webhook submission failed');
    document.getElementById('success-name').textContent = fullName;
    document.getElementById('success-plan').textContent =
      selectedPlan === 'internship' ? 'Workshop + Internship Plan' : 'Workshop Only Plan';
    document.getElementById('form-card').style.display = 'none';
    document.getElementById('success-screen').style.display = 'block';
    if (!paymentDone) document.getElementById('payment-reminder').style.display = 'block';
  } catch (error) {
    errMsg.textContent = '⚠️ Submission failed. Please try again.';
    errMsg.style.display = 'block';
  } finally {
    btn.disabled = false;
    btnText.textContent = '🚀 Complete Registration';
  }
}

(function init() {
  const target = new Date();
  target.setDate(target.getDate() + 3);
  setInterval(() => {
    const diff = target - new Date();
    const d = Math.max(0, Math.floor(diff / 86400000));
    const h = Math.max(0, Math.floor(diff / 3600000) % 24);
    const m = Math.max(0, Math.floor(diff / 60000) % 60);
    const s = Math.max(0, Math.floor(diff / 1000) % 60);
    document.getElementById('s-d').textContent = String(d).padStart(2, '0');
    document.getElementById('s-h').textContent = String(h).padStart(2, '0');
    document.getElementById('s-m').textContent = String(m).padStart(2, '0');
    document.getElementById('s-s').textContent = String(s).padStart(2, '0');
  }, 1000);
  selectPlanAndUpdatePayment('workshop');
  if (sessionStorage.getItem('cps_payment_done') === 'true') markAsPaid();
})();
