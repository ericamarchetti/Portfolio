document.addEventListener('DOMContentLoaded', () => {
  // Page Fade In
  document.body.classList.add('loaded');

  const isDesktop = window.innerWidth > 860;

  /* ── AMBIENT BACKGROUND BLOBS (all pages) ── */
  const bgBlur = document.createElement('div');
  bgBlur.className = 'background-blur';
  document.body.insertBefore(bgBlur, document.body.firstChild);

  /* ── CURSOR + GLOW ── */
  const cur  = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');

  if (cur && ring && isDesktop) {
    let mx = 0, my = 0;
    let rx = 0, ry = 0;
    let gx = window.innerWidth / 2, gy = window.innerHeight / 2;

    /* cursor glow orb */
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cur.style.left = mx + 'px'; cur.style.top = my + 'px';
    });

    (function animLoop() {
      /* ring follows with lag */
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';

      /* glow orb follows with heavier lag */
      gx += (mx - gx) * 0.06; gy += (my - gy) * 0.06;
      glow.style.left = gx + 'px'; glow.style.top = gy + 'px';

      requestAnimationFrame(animLoop);
    })();

    document.querySelectorAll('a, button, input, textarea').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
  }

  /* ── HERO PARALLAX (index only) ── */
  if (isDesktop) {
    const hero       = document.querySelector('.hero');
    const heroName   = document.querySelector('.hero-name');
    const heroTag    = document.querySelector('.hero-tagline');

    if (hero && heroName) {
      hero.addEventListener('mousemove', e => {
        const r  = hero.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width  / 2)) / r.width;
        const dy = (e.clientY - (r.top  + r.height / 2)) / r.height;
        heroName.style.transform = `translate(${dx * 8}px, ${dy * 4}px)`;
        if (heroTag) heroTag.style.transform = `translate(${dx * 5}px, ${dy * 3}px)`;
      });

      hero.addEventListener('mouseleave', () => {
        heroName.style.transform = '';
        if (heroTag) heroTag.style.transform = '';
      });
    }
  }

  /* ── CARD 3D TILT ── */
  if (isDesktop) {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r  = card.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
        const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
        card.style.transition = 'transform 0.08s ease, border-color 0.35s ease';
        card.style.transform  = `perspective(900px) rotateY(${dx * 3}deg) rotateX(${-dy * 2}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.7s cubic-bezier(0.23,1,0.32,1), border-color 0.35s ease';
        card.style.transform  = '';
      });
    });
  }

  /* ── SCROLL REVEAL ── */
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('vis'), i * 65);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));

  /* ── SMOOTH SCROLL ── */
  const exploreBtn = document.querySelector('.hero-cta');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', e => {
      const target = document.getElementById('projectsSection');
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  }

  /* ── PAGE TRANSITIONS ── */
  document.querySelectorAll('a').forEach(link => {
    if (link.hostname === window.location.hostname && !link.hash && !link.target) {
      link.addEventListener('click', e => {
        e.preventDefault();
        const href = link.href;
        document.body.classList.remove('loaded');
        setTimeout(() => { window.location.href = href; }, 500);
      });
    }
  });
});
