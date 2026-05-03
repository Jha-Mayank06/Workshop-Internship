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

// ══════════════════════════════════════════
// SCROLL — STICKY HEADER + BOTTOM CTA
// Bug fixes:
//   - Removed outer scroll listener that was wrapping the inner one
//     (caused infinite listener stacking on every scroll event)
//   - Removed duplicate let declarations of stickyHeader, bottomCTA, lastScrollY
//   - bottomCTA is now declared once and reused
// ══════════════════════════════════════════
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
// STACKED PODIUM CAROUSEL
// ═══════════════════════════════════════════════════════════════════

(function () {
  const STATE_CLASSES = [
    "is-far-left",
    "is-left",
    "is-center",
    "is-right",
    "is-far-right",
  ];

  // Bug fix: was getElementById("podiumStage") but HTML had no such id.
  // Fixed by adding id="podiumStage" to the wrap div in index.html.
  const stage = document.getElementById("podiumStage");
  const dotsWrap = document.getElementById("podiumDots");
  const prevBtn = document.getElementById("podiumPrev");
  const nextBtn = document.getElementById("podiumNext");

  if (!stage || !dotsWrap || !prevBtn || !nextBtn) return;

  const cards = Array.from(stage.querySelectorAll(".podium-card"));
  const total = cards.length;

  if (total === 0) return;

  let current = 0;
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
      card.classList.remove(...STATE_CLASSES);

      let offset = i - centerIndex;

      if (offset > Math.floor(total / 2)) offset -= total;
      if (offset < -Math.floor(total / 2)) offset += total;

      const stateIdx = offset + 2;

      if (stateIdx >= 0 && stateIdx < STATE_CLASSES.length) {
        card.classList.add(STATE_CLASSES[stateIdx]);
      }
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === centerIndex);
    });

    manageVideos(centerIndex);
  }

  // ── Video: play center, pause sides ───────────────────────────
  function manageVideos(centerIndex) {
    cards.forEach((card, i) => {
      const video = card.querySelector("video");
      if (!video) return;

      const source = video.querySelector("source");

      if (i === centerIndex) {
        if (source && !source.src) {
          source.src = source.dataset.src;
          video.load();
        }
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }

  // ── Navigate ──────────────────────────────────────────────────
  function goTo(index, skipAnimation) {
    if (isAnimating && !skipAnimation) return;
    isAnimating = true;

    current = ((index % total) + total) % total;
    applyStates(current);

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

  // ── Keyboard navigation ───────────────────────────────────────
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
        dx < 0 ? goTo(current + 1) : goTo(current - 1);
      }
      touchStartX = null;
    },
    { passive: true },
  );

  // ── Auto-advance every 5 seconds ─────────────────────────────
  let autoTimer = setInterval(() => goTo(current + 1), 5000);

  const wrap = document.getElementById("podiumStage");
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
})();

// ══════════════════════════════════════════
// PHOTO STRIP — drag to scroll
// ══════════════════════════════════════════
(function () {
  const strip = document.querySelector(".photo-strip-inner");
  if (!strip) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  strip.addEventListener("mousedown", (e) => {
    isDown = true;
    strip.classList.add("is-dragging");
    startX = e.pageX - strip.offsetLeft;
    scrollLeft = strip.scrollLeft;
  });

  strip.addEventListener("mouseleave", () => {
    isDown = false;
    strip.classList.remove("is-dragging");
  });

  strip.addEventListener("mouseup", () => {
    isDown = false;
    strip.classList.remove("is-dragging");
  });

  strip.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - strip.offsetLeft;
    const walk = (x - startX) * 1.5;
    strip.scrollLeft = scrollLeft - walk;
  });
})();
