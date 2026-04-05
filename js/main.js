/* ═══════════════════════════════════════════════════
   TYPING ANIMATION
═══════════════════════════════════════════════════ */
const roles = [
  'Full-Stack Software Engineer',
  'Embedded Systems Developer',
  'ML & Privacy Researcher',
  'Open Source Contributor',
];

const typingEl = document.getElementById('typing-text');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reducedMotion) {
  // Skip animation — just show the first role statically
  typingEl.textContent = roles[0];
} else {
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  function type() {
    const current = roles[roleIndex];

    if (isDeleting) {
      typingEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;
    } else {
      typingEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 50 : 90;

    if (!isDeleting && charIndex === current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  // Start typing after hero animations settle
  setTimeout(type, 1200);
}


/* ═══════════════════════════════════════════════════
   NAVBAR: scroll behaviour + active link spy
═══════════════════════════════════════════════════ */
const navbar  = document.getElementById('navbar');
const navLinksAll = document.querySelectorAll('.nav-links li a:not(.btn-resume)');
const sections = document.querySelectorAll('section[id]');

function onScroll() {
  // Solid background after scrolling 50px
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link highlighting via scroll spy
  let currentId = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      currentId = section.getAttribute('id');
    }
  });

  navLinksAll.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentId}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run on load


/* ═══════════════════════════════════════════════════
   MOBILE NAV TOGGLE
═══════════════════════════════════════════════════ */
const navToggle = document.getElementById('nav-toggle');
const navLinksList = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const isOpen = navLinksList.classList.toggle('open');
  navToggle.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close mobile nav when a link is clicked
navLinksList.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinksList.classList.remove('open');
  });
});


/* ═══════════════════════════════════════════════════
   SCROLL REVEAL (IntersectionObserver)
═══════════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Also reveal children inside this section
      entry.target.querySelectorAll('.reveal-child').forEach(child => {
        child.classList.add('visible');
      });

      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});


/* ═══════════════════════════════════════════════════
   SMOOTH SCROLL for anchor links (fallback)
═══════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = document.getElementById('navbar').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
