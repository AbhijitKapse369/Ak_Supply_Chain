const revealItems = document.querySelectorAll("[data-reveal]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

window.addEventListener("load", () => {
  document.body.classList.add("is-ready");
});

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 70, 420)}ms`;
});

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
const scrollProgress = document.querySelector(".scroll-progress");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const magneticItems = document.querySelectorAll(".magnetic");
const parallaxWrap = document.querySelector("[data-parallax-wrap]");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const heroSection = document.querySelector(".hero");
const spotlightCards = document.querySelectorAll(".hero-metrics article, .timeline-item, .skill-groups article, .credential-grid article, .impact-strip article, .case-flow article, .contact-row a, .contact-row span");
const heroContent = document.querySelector(".hero-content");
const projectTabs = document.querySelectorAll("[data-project-tab]");
const projectPanels = document.querySelectorAll("[data-project-panel]");
const projectCopyLabel = document.querySelector("[data-project-copy-label]");
const projectCopyTitle = document.querySelector("[data-project-copy-title]");
const projectCopyText = document.querySelector("[data-project-copy-text]");
const dashboard = document.querySelector(".dashboard");
const sections = navLinks
  .map(link => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const projectContent = {
  overview: {
    label: "Overview Mode",
    title: "9,999 orders across 5 markets",
    text: "Late delivery, shipping mode, discount impact, and customer segment behavior in one analytical frame."
  },
  delivery: {
    label: "Delivery Risk",
    title: "53.7% late deliveries surfaced quickly",
    text: "The dashboard isolates hotspot markets, delayed shipping patterns, and performance drift before they become reporting surprises."
  },
  profit: {
    label: "Profit Lens",
    title: "Discount and margin tradeoffs made visible",
    text: "It connects customer segments, discount intensity, and profitability so action can balance volume and margin."
  }
};

function syncHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 18);

  if (scrollProgress) {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    scrollProgress.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
  }
}

window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();

if (cursorGlow && !prefersReducedMotion.matches) {
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

const tiltCards = document.querySelectorAll(".portrait-card, .hero-metrics article, .timeline-item, .dashboard, .skill-groups article, .credential-grid article");

tiltCards.forEach(card => {
  card.addEventListener("pointermove", event => {
    if (prefersReducedMotion.matches) return;

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

spotlightCards.forEach(card => {
  card.addEventListener("pointermove", event => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--spot-x", `${x}%`);
    card.style.setProperty("--spot-y", `${y}%`);
  });
});

magneticItems.forEach(item => {
  item.addEventListener("pointermove", event => {
    if (prefersReducedMotion.matches) return;

    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    item.style.transform = `translate3d(${x * 0.08}px, ${y * 0.08}px, 0)`;
  });

  item.addEventListener("pointerleave", () => {
    item.style.transform = "";
  });
});

if (heroContent && !prefersReducedMotion.matches) {
  window.addEventListener("pointermove", event => {
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const moveX = ((event.clientX / viewportWidth) - 0.5) * 10;
    const moveY = ((event.clientY / viewportHeight) - 0.5) * 10;

    heroContent.style.transform = `translate3d(${moveX * -0.55}px, ${moveY * -0.35}px, 0)`;
  });
}

projectTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const key = tab.dataset.projectTab;
    const next = projectContent[key];
    if (!next) return;

    if (dashboard) {
      dashboard.classList.add("is-switching");
    }

    projectTabs.forEach(button => {
      button.classList.toggle("is-active", button === tab);
    });

    projectPanels.forEach(panel => {
      panel.classList.toggle("is-active", panel.dataset.projectPanel === key);
    });

    if (projectCopyLabel) projectCopyLabel.textContent = next.label;
    if (projectCopyTitle) projectCopyTitle.textContent = next.title;
    if (projectCopyText) projectCopyText.textContent = next.text;

    window.setTimeout(() => {
      dashboard?.classList.remove("is-switching");
    }, 220);
  });
});

function updateParallax() {
  if (heroSection) {
    const heroHeight = heroSection.offsetHeight || 1;
    const heroProgress = Math.max(0, Math.min(window.scrollY / heroHeight, 1));
    heroSection.style.setProperty("--hero-progress", heroProgress.toFixed(3));
  }

  if (!parallaxWrap || prefersReducedMotion.matches) return;

  const rect = parallaxWrap.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
  const clampedProgress = Math.max(0, Math.min(progress, 1));

  parallaxItems.forEach(item => {
    const depth = Number(item.dataset.parallax || 0.12);
    const offsetY = (clampedProgress - 0.5) * 48 * depth * 10;
    item.style.setProperty("--parallax-shift", `${offsetY}px`);
  });
}

window.addEventListener("scroll", updateParallax, { passive: true });
window.addEventListener("resize", updateParallax);
updateParallax();
