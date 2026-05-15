/* ═══════════════════════════════════════════════════
   MOHAMED ZEINA / PORTFOLIO v2 / MAIN
═══════════════════════════════════════════════════ */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── typing animation ───────────────────────────── */
const roles = [
  'full_stack.engineer',
  'embedded.developer',
  'ml.privacy.researcher',
  'open_source.contributor',
];

const typingEl = document.getElementById('typing-text');

if (typingEl) {
  if (reducedMotion) {
    typingEl.textContent = roles[0];
  } else {
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const current = roles[roleIndex];
      typingEl.textContent = isDeleting
        ? current.slice(0, --charIndex)
        : current.slice(0, ++charIndex);

      let delay = isDeleting ? 45 : 85;

      if (!isDeleting && charIndex === current.length) {
        delay = 1800;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 400;
      }
      setTimeout(type, delay);
    }
    setTimeout(type, 900);
  }
}


/* ─── system clock (top bar) ─────────────────────── */
const sysTime = document.getElementById('sys-time');
if (sysTime) {
  const tick = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    sysTime.textContent = `${hh}:${mm}:${ss} UTC+3`;
  };
  tick();
  setInterval(tick, 1000);
}


/* ─── scroll progress bar ────────────────────────── */
const progressBar = document.getElementById('scroll-progress');
function updateProgress() {
  const scrolled = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const pct = height > 0 ? (scrolled / height) * 100 : 0;
  if (progressBar) progressBar.style.width = pct + '%';
}


/* ─── navbar scroll behaviour + scroll progress ──── */
const navbar = document.getElementById('navbar');
const navLinksAll = document.querySelectorAll('.nav-links li a:not(.btn-resume)');
const sections = document.querySelectorAll('section[id]');

function onScroll() {
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateProgress();
}

let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    onScroll();
    scrollTicking = false;
  });
}, { passive: true });
onScroll();


/* ─── active link spy via IntersectionObserver ───── */
const linkByHash = new Map();
navLinksAll.forEach(link => {
  const href = link.getAttribute('href') || '';
  if (href.startsWith('#') && href.length > 1) linkByHash.set(href.slice(1), link);
});

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const link = linkByHash.get(entry.target.id);
    if (!link) return;
    navLinksAll.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(section => spyObserver.observe(section));


/* ─── mobile nav toggle ──────────────────────────── */
const navToggle = document.getElementById('nav-toggle');
const navLinksList = document.getElementById('nav-links');

if (navToggle && navLinksList) {
  navToggle.addEventListener('click', () => {
    const open = navLinksList.classList.toggle('open');
    navToggle.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });
  navLinksList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinksList.classList.remove('open');
    });
  });
}


/* ─── scroll reveal (IntersectionObserver) ───────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      entry.target.querySelectorAll('.reveal-child').forEach(child => {
        child.classList.add('visible');
      });
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ─── stat counter (animates on enter) ───────────── */
function formatStat(value, target) {
  const t = target !== undefined ? target : value;
  if (String(t).includes('.')) return value.toFixed(2);
  return Math.floor(value).toString();
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.count);
    if (Number.isNaN(target)) return;

    if (reducedMotion) {
      el.textContent = formatStat(target);
      statObserver.unobserve(el);
      return;
    }

    const duration = 1100;
    const start = performance.now();
    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = formatStat(target * eased, target);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = formatStat(target);
    }
    requestAnimationFrame(step);
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));


/* ─── custom cursor (desktop only) ───────────────── */
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (cursorDot && cursorRing && supportsHover && !reducedMotion) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let active = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!active) {
      document.body.classList.add('cursor-active');
      active = true;
    }
  });

  window.addEventListener('mouseleave', () => {
    document.body.classList.remove('cursor-active');
    active = false;
  });

  function tick() {
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  }
  tick();

  // expand on interactive elements
  const interactive = 'a, button, .skill-group, .exp-card, .edu-card, .project-card, .stat-cell, .contact-socials a';
  document.querySelectorAll(interactive).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}


/* ─── copy-to-clipboard buttons ──────────────────── */
document.querySelectorAll('.btn-copy').forEach(btn => {
  btn.addEventListener('click', async () => {
    const text = btn.dataset.copy;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch {}
      document.body.removeChild(ta);
    }
    const label = btn.querySelector('.copy-label');
    const icon = btn.querySelector('i');
    if (!label) return;
    const originalText = label.textContent;
    const originalIcon = icon ? icon.className : '';
    label.textContent = 'copied_';
    if (icon) icon.className = 'fas fa-check';
    btn.classList.add('copied');
    setTimeout(() => {
      label.textContent = originalText;
      if (icon) icon.className = originalIcon;
      btn.classList.remove('copied');
    }, 1500);
  });
});


/* ─── smooth scroll for in-page anchors ──────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href');
    if (id.length <= 1) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const sysH = document.querySelector('.sys-bar')?.offsetHeight || 0;
    const navH = document.getElementById('navbar')?.offsetHeight || 0;
    const top = target.getBoundingClientRect().top + window.scrollY - sysH - navH + 1;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
