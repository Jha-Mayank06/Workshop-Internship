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
// ===== COUNTDOWN TIMER =====

// 🔴 Set your deadline here
const deadline = new Date("2026-05-15T00:00:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const gap = deadline - now;

  // stop at zero
  if (gap <= 0) {
    document.getElementById("cd-d").innerText = "00";
    document.getElementById("cd-h").innerText = "00";
    document.getElementById("cd-m").innerText = "00";
    document.getElementById("cd-s").innerText = "00";
    return;
  }

  const days = Math.floor(gap / (1000 * 60 * 60 * 24));
  const hours = Math.floor((gap / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((gap / (1000 * 60)) % 60);
  const seconds = Math.floor((gap / 1000) % 60);

  document.getElementById("cd-d").innerText = String(days).padStart(2, "0");
  document.getElementById("cd-h").innerText = String(hours).padStart(2, "0");
  document.getElementById("cd-m").innerText = String(minutes).padStart(2, "0");
  document.getElementById("cd-s").innerText = String(seconds).padStart(2, "0");
}

// run every second
setInterval(updateCountdown, 1000);

// run immediately
updateCountdown();
// ═══════════════════════════════════════════════════════════════════
// STACKED PODIUM CAROUSEL  —  append to the bottom of script.js
// ═══════════════════════════════════════════════════════════════════

(function () {
  // State classes assigned to cards by their position relative to center
  const STATE_CLASSES = [
    "is-far-left", // center - 2  (off-stage left)
    "is-left", // center - 1
    "is-center", // center
    "is-right", // center + 1
    "is-far-right", // center + 2  (off-stage right)
  ];

  const stage = document.getElementById("podiumStage");
  const dotsWrap = document.getElementById("podiumDots");
  const prevBtn = document.getElementById("podiumPrev");
  const nextBtn = document.getElementById("podiumNext");

  if (!stage || !dotsWrap || !prevBtn || !nextBtn) return; // bail if section absent

  const cards = Array.from(stage.querySelectorAll(".podium-card"));
  const total = cards.length;

  if (total === 0) return;

  let current = 0; // index of the center card
  let isAnimating = false;

  // ── Build dot indicators ───────────────────────────────────────
  cards.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "podium-dot";
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.querySelectorAll(".podium-dot"));

  // ── Core: assign position classes ─────────────────────────────
  function applyStates(centerIndex) {
    cards.forEach((card, i) => {
      // Remove all state classes
      card.classList.remove(...STATE_CLASSES);

      // Offset from center: -2, -1, 0, +1, +2
      // Wrap-around using modular arithmetic
      let offset = i - centerIndex;

      // Bring into range [-floor(total/2) … +floor(total/2)]
      if (offset > Math.floor(total / 2)) offset -= total;
      if (offset < -Math.floor(total / 2)) offset += total;

      // Map offset to STATE_CLASSES index (center = 2)
      const stateIdx = offset + 2; // maps -2→0, -1→1, 0→2, +1→3, +2→4

      if (stateIdx >= 0 && stateIdx < STATE_CLASSES.length) {
        card.classList.add(STATE_CLASSES[stateIdx]);
      }
      // Cards beyond ±2 get no visible class → stay hidden (opacity:0 default)
    });

    // Dots
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === centerIndex);
    });

    // Video autoplay management
    manageVideos(centerIndex);
  }

  // ── Video: play center, pause sides ───────────────────────────
  function manageVideos(centerIndex) {
    cards.forEach((card, i) => {
      const video = card.querySelector("video");
      if (!video) return;

      if (i === centerIndex) {
        // Small delay so transition has started — avoids janky seek
        setTimeout(() => {
          video.play().catch(() => {}); // catch AbortError on rapid clicks
        }, 120);
      } else {
        video.pause();
      }
    });
  }

  // ── Navigate ──────────────────────────────────────────────────
  function goTo(index, skipAnimation) {
    if (isAnimating && !skipAnimation) return;
    isAnimating = true;

    current = ((index % total) + total) % total; // safe modulo
    applyStates(current);

    // Re-enable after transition duration (500ms matches CSS)
    clearTimeout(goTo._timer);
    goTo._timer = setTimeout(() => {
      isAnimating = false;
    }, 520);
  }

  // ── Clicking a side card jumps to it ──────────────────────────
  cards.forEach((card, i) => {
    card.addEventListener("click", () => {
      if (!card.classList.contains("is-center")) {
        goTo(i);
      }
    });
  });

  // ── Arrow buttons ─────────────────────────────────────────────
  prevBtn.addEventListener("click", () => goTo(current - 1));
  nextBtn.addEventListener("click", () => goTo(current + 1));

  // ── Keyboard navigation (when focused inside section) ─────────
  document.addEventListener("keydown", (e) => {
    const section = document.getElementById("glimpse");
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inViewport) return;

    if (e.key === "ArrowLeft") goTo(current - 1);
    if (e.key === "ArrowRight") goTo(current + 1);
  });

  // ── Touch / swipe support ─────────────────────────────────────
  let touchStartX = null;

  stage.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
    },
    { passive: true },
  );

  stage.addEventListener(
    "touchend",
    (e) => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) {
        // 40px threshold
        dx < 0 ? goTo(current + 1) : goTo(current - 1);
      }
      touchStartX = null;
    },
    { passive: true },
  );

  // ── Auto-advance every 5 seconds ─────────────────────────────
  // Pauses on hover / touch
  let autoTimer = setInterval(() => goTo(current + 1), 5000);

  const wrap = document.querySelector(".podium-carousel-wrap");
  if (wrap) {
    wrap.addEventListener("mouseenter", () => clearInterval(autoTimer));
    wrap.addEventListener("mouseleave", () => {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current + 1), 5000);
    });
    wrap.addEventListener("touchstart", () => clearInterval(autoTimer), {
      passive: true,
    });
  }

  // ── Initial render ────────────────────────────────────────────
  goTo(0, true);
})(); // end IIFE — no global pollution
