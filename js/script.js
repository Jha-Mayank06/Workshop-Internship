// ══════════════════════════════════════════
// COUNTDOWN — set your actual deadline date here
// ══════════════════════════════════════════
const target = new Date("2025-08-01T09:00:00");
function tick() {
  const diff = target - new Date();
  if (diff <= 0) {
    ["cd-d", "cd-h", "cd-m", "cd-s"].forEach(
      (id) => (document.getElementById(id).textContent = "00"),
    );
    return;
  }
  const d = Math.floor(diff / 86400000),
    h = Math.floor((diff % 86400000) / 3600000),
    m = Math.floor((diff % 3600000) / 60000),
    s = Math.floor((diff % 60000) / 1000);
  document.getElementById("cd-d").textContent = String(d).padStart(2, "0");
  document.getElementById("cd-h").textContent = String(h).padStart(2, "0");
  document.getElementById("cd-m").textContent = String(m).padStart(2, "0");
  document.getElementById("cd-s").textContent = String(s).padStart(2, "0");
}
tick();
setInterval(tick, 1000);

// ══════════════════════════════════════════
// PLAN TOGGLE
// ══════════════════════════════════════════
function switchPlan(plan, el) {
  document
    .querySelectorAll(".plan-tab")
    .forEach((t) => t.classList.remove("active"));
  document
    .querySelectorAll(".plan-price")
    .forEach((p) => p.classList.remove("active"));
  el.classList.add("active");
  document.getElementById("plan-" + plan).classList.add("active");
}

// ══════════════════════════════════════════
// FAQ TOGGLE
// ══════════════════════════════════════════
function toggleFaq(btn) {
  const item = btn.closest(".faq-item"),
    ans = item.querySelector(".faq-a"),
    isOpen = btn.classList.contains("open");
  document.querySelectorAll(".faq-q.open").forEach((b) => {
    b.classList.remove("open");
    b.closest(".faq-item").querySelector(".faq-a").style.maxHeight = "0";
  });
  if (!isOpen) {
    btn.classList.add("open");
    ans.style.maxHeight = ans.scrollHeight + "px";
  }
}

// ══════════════════════════════════════════
// SCROLL FADE ANIMATION
// ══════════════════════════════════════════
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add("visible"), i * 60);
        obs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.07 },
);
document.querySelectorAll(".fade-in").forEach((el) => obs.observe(el));
let lastScrollY = window.scrollY;

const bottomCTA = document.querySelector(".bottom-cta");

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  // Only mobile
  if (window.innerWidth < 768) {
    const stickyHeader = document.getElementById("sticky-header");
    const bottomCTA = document.querySelector(".bottom-cta");
    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling DOWN — hide header, show bottom CTA
          stickyHeader.classList.add("hide");
          bottomCTA.classList.add("show");
        } else {
          // Scrolling UP — show header, hide bottom CTA
          stickyHeader.classList.remove("hide");
          bottomCTA.classList.remove("show");
        }

        if (currentScrollY < 100) {
          stickyHeader.classList.remove("hide");
          bottomCTA.classList.remove("show");
        }
      }

      lastScrollY = currentScrollY;
    });
  }
});
// ===== PHASE ACCORDION =====
const phases = document.querySelectorAll(".phase-block");

phases.forEach((phase) => {
  const header = phase.querySelector(".phase-header");

  header.addEventListener("click", () => {
    // close others (optional but recommended)
    phases.forEach((p) => {
      if (p !== phase) p.classList.remove("open");
    });

    // toggle current
    phase.classList.toggle("open");
  });
});
