/* ============================================
   AB3 VISUALS — main.js
   Nav · Hamburger · IntersectionObserver · Portfolio Filter · Cursor
   ============================================ */

/* --- Nav scroll state --- */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 40);
}, { passive: true });

/* --- Mobile hamburger --- */
const hamburger = document.querySelector('.nav__hamburger');
const mobileNav = document.getElementById('mobile-nav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('is-open');
    mobileNav.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  // Close on link click
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('is-open');
      mobileNav.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* --- IntersectionObserver fade-up --- */
const fadeEls = document.querySelectorAll('.fade-up');
if (fadeEls.length) {
  // Immediately show anything already in the viewport on load
  fadeEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) el.classList.add('is-visible');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });
  fadeEls.forEach(el => {
    if (!el.classList.contains('is-visible')) observer.observe(el);
  });
}

/* --- Custom cursor --- */
const cursor = document.querySelector('.cursor');
const cursorRing = document.querySelector('.cursor__ring');
if (cursor && cursorRing && window.matchMedia('(pointer: fine)').matches) {
  let cx = 0, cy = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; });
  function animateCursor() {
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    rx += (cx - rx) * 0.14;
    ry += (cy - ry) * 0.14;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top = ry + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.style.transform = 'translate(-50%,-50%) scale(1.6)');
    el.addEventListener('mouseleave', () => cursorRing.style.transform = 'translate(-50%,-50%) scale(1)');
  });
} else {
  if (cursor) cursor.style.display = 'none';
  if (cursorRing) cursorRing.style.display = 'none';
}

/* --- Portfolio filter (portfolio.html) --- */
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-all__item[data-category]');
if (filterBtns.length && portfolioItems.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;
      portfolioItems.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.display = show ? '' : 'none';
        if (show) item.classList.add('is-visible');
      });
    });
  });
}

/* --- Stats bar: count-up + character reveal --- */
const statsBar = document.querySelector('.stats-bar');
if (statsBar) {
  // Set initial display values
  statsBar.querySelectorAll('[data-count]').forEach(el => {
    el.textContent = '0' + (el.dataset.suffix || '');
  });
  // Split text stats into character spans (hidden initially)
  statsBar.querySelectorAll('[data-text]').forEach(el => {
    el.innerHTML = el.dataset.text.split('').map(ch =>
      `<span class="stat-char">${ch === ' ' ? '&nbsp;' : ch}</span>`
    ).join('');
  });

  let statsAnimated = false;
  const statsObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting || statsAnimated) return;
    statsAnimated = true;

    // Count-up for numeric stats
    statsBar.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const startTime = performance.now();
      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(eased * target).toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });

    // Staggered character reveal for text stats
    statsBar.querySelectorAll('[data-text] .stat-char').forEach((ch, i) => {
      ch.style.animationDelay = `${i * 55}ms`;
      ch.classList.add('stat-char--on');
    });
  }, { threshold: 0.4 });

  statsObserver.observe(statsBar);
}

/* --- FAQ accordion --- */
document.querySelectorAll('.faq__q').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    const answer = btn.nextElementSibling;
    btn.setAttribute('aria-expanded', !isOpen);
    answer.style.maxHeight = isOpen ? '0' : answer.scrollHeight + 'px';
  });
});

/* --- Service row link wrapper (make whole row clickable) --- */
document.querySelectorAll('.service-row').forEach(row => {
  row.addEventListener('click', e => {
    if (row.tagName === 'A') return; // already an anchor
    const link = row.querySelector('a');
    if (link) link.click();
  });
});
