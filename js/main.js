/* ============================================
   SERGOIT PRIMARY SCHOOL — MAIN JS v2
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Mobile Nav --- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => { navLinks.classList.remove('open'); hamburger.classList.remove('active'); })
    );
  }

  /* --- Active Nav Link --- */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  /* --- Hero Image Slider --- */
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  let current  = 0;
  let timer;

  function goSlide(n) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => goSlide(current + 1), 5000);
  }

  if (slides.length > 1) {
    goSlide(0);
    startTimer();
    dots.forEach((dot, i) => dot.addEventListener('click', () => { goSlide(i); startTimer(); }));
  } else if (slides.length === 1) {
    slides[0].classList.add('active');
  }

  /* --- Gallery Lightbox --- */
  const lightbox    = document.getElementById('lightbox');
  const lbImg       = document.getElementById('lb-img');
  const lbClose     = document.getElementById('lb-close');
  const lbPrev      = document.getElementById('lb-prev');
  const lbNext      = document.getElementById('lb-next');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item[data-src]'));
  let lbCurrent = 0;

  function openLightbox(idx) {
    lbCurrent = idx;
    lbImg.src = galleryItems[idx].dataset.src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  if (lbPrev)  lbPrev.addEventListener('click',  e => { e.stopPropagation(); openLightbox((lbCurrent - 1 + galleryItems.length) % galleryItems.length); });
  if (lbNext)  lbNext.addEventListener('click',  e => { e.stopPropagation(); openLightbox((lbCurrent + 1) % galleryItems.length); });
  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   openLightbox((lbCurrent - 1 + galleryItems.length) % galleryItems.length);
    if (e.key === 'ArrowRight')  openLightbox((lbCurrent + 1) % galleryItems.length);
  });

  /* --- Gallery Filter --- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryAll = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      galleryAll.forEach(item => {
        item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
      });
    });
  });

  /* ============================================
     GOOGLE SHEETS BACKEND
     Target sheet: https://docs.google.com/spreadsheets/d/1hNOq8ReAHYUByg8-c9pivjB0RJUUy5JJORMymk5IgUo/edit
     Paste the Web App URL you get after deploying
     google-apps-script/Code.gs (see README.md).
     ============================================ */
  const SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwi6mg8r7_QN9J0QiRf8p2fH_UmIimffOAkvUQpEebrYksBN-L_kls6NN731q53zKLpiw/exec';

  function sendToSheet(payload) {
    // Apps Script web apps don't reliably answer CORS preflight requests,
    // so we send as a "simple request" (text/plain body, no custom headers)
    // and use no-cors mode. We can't read the response, but the row still
    // gets written — we treat the fetch resolving (not throwing) as success.
    return fetch(SHEET_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
  }

  function isEndpointConfigured() {
    return SHEET_ENDPOINT && !SHEET_ENDPOINT.startsWith('PASTE_YOUR_');
  }

  /* --- Contact Form --- */
  const cForm = document.getElementById('contact-form');
  if (cForm) {
    cForm.addEventListener('submit', e => {
      e.preventDefault();
      const success = document.getElementById('form-success');
      const error   = document.getElementById('form-error');
      if (error) error.style.display = 'none';

      const payload = {
        formType: 'contact',
        timestamp: new Date().toISOString(),
        firstName: document.getElementById('fname').value,
        lastName:  document.getElementById('lname').value,
        email:     document.getElementById('email').value,
        phone:     document.getElementById('phone').value,
        subject:   document.getElementById('subject').value,
        message:   document.getElementById('message').value
      };

      if (!isEndpointConfigured()) {
        console.warn('SHEET_ENDPOINT is not configured yet. See README.md. Payload was:', payload);
        if (error) error.style.display = 'block';
        return;
      }

      sendToSheet(payload)
        .then(() => {
          if (success) { success.style.display = 'block'; cForm.reset(); setTimeout(() => success.style.display = 'none', 6000); }
        })
        .catch(err => {
          console.error('Contact form submission failed:', err);
          if (error) error.style.display = 'block';
        });
    });
  }

  /* --- Alumni Form --- */
  const aForm = document.getElementById('alumni-form');
  if (aForm) {
    aForm.addEventListener('submit', e => {
      e.preventDefault();
      const success = document.getElementById('alumni-success');
      const error   = document.getElementById('alumni-error');
      if (error) error.style.display = 'none';

      const payload = {
        formType: 'alumni',
        timestamp: new Date().toISOString(),
        firstName:      document.getElementById('a-fname').value,
        lastName:       document.getElementById('a-lname').value,
        graduationYear: document.getElementById('a-gradyear').value,
        phone:          document.getElementById('a-phone').value,
        email:          document.getElementById('a-email').value,
        profession:     document.getElementById('a-profession').value,
        location:       document.getElementById('a-location').value
      };

      if (!isEndpointConfigured()) {
        console.warn('SHEET_ENDPOINT is not configured yet. See README.md. Payload was:', payload);
        if (error) error.style.display = 'block';
        return;
      }

      sendToSheet(payload)
        .then(() => {
          if (success) { success.style.display = 'block'; aForm.reset(); setTimeout(() => success.style.display = 'none', 6000); }
        })
        .catch(err => {
          console.error('Alumni form submission failed:', err);
          if (error) error.style.display = 'block';
        });
    });
  }

  /* --- Animated Counters --- */
  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 2000;
    const step     = target / (duration / 16);
    let current    = 0;
    const t = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString() + suffix;
      if (current >= target) clearInterval(t);
    }, 16);
  }
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.done) {
        e.target.dataset.done = '1';
        animateCounter(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

  /* --- Navbar scroll effect --- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow = window.scrollY > 40
        ? '0 2px 0 #1a6b3a, 0 6px 32px rgba(0,0,0,.14)'
        : '0 2px 0 #1a6b3a, 0 4px 20px rgba(0,0,0,.08)';
    }, { passive: true });
  }

  /* --- Year in footer --- */
  document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear());

});
