const revealItems = document.querySelectorAll("[data-reveal]");

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach(item => revealObserver.observe(item));

const counters = document.querySelectorAll("[data-count]");
let countersStarted = false;

function animateCounter(element) {
  const target = Number(element.dataset.count);
  const duration = 1300;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);

    element.textContent = target === 9999 ? value.toLocaleString("en-IN") : `${value}+`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

const metricsObserver = new IntersectionObserver(
  entries => {
    const isVisible = entries.some(entry => entry.isIntersecting);
    if (isVisible && !countersStarted) {
      countersStarted = true;
      counters.forEach(animateCounter);
    }
  },
  { threshold: 0.4 }
);

const metrics = document.querySelector(".hero-metrics");
if (metrics) {
  metricsObserver.observe(metrics);
}

const header = document.querySelector(".site-header");
const cursorGlow = document.querySelector(".cursor-glow");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const sections = navLinks
  .map(link => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function syncHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 18);
}

window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();

if (cursorGlow && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.addEventListener("pointermove", event => {
    cursorGlow.style.transform = `translate3d(${event.clientX - 180}px, ${event.clientY - 180}px, 0)`;
  });
}

const navObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-35% 0px -50% 0px", threshold: 0.01 }
);

sections.forEach(section => navObserver.observe(section));

const tiltCards = document.querySelectorAll(".hero-metrics article, .timeline-item, .dashboard, .skill-groups article, .credential-grid article");

tiltCards.forEach(card => {
  card.addEventListener("pointermove", event => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 7;
    const rotateX = ((0.5 - y / rect.height)) * 7;

    card.classList.add("is-tilting");
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.classList.remove("is-tilting");
    card.style.transform = "";
  });
});
