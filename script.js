// ============ HERO PARTICLES CANVAS ============
const canvas = document.getElementById('hero-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticle() {
    return {
      x: rand(0, canvas.width),
      y: rand(0, canvas.height),
      r: rand(0.5, 2),
      alpha: rand(0.2, 0.8),
      speed: rand(0.1, 0.4),
      dir: rand(0, Math.PI * 2),
    };
  }

  for (let i = 0; i < 140; i++) particles.push(createParticle());

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 200, 255, ${p.alpha})`;
      ctx.fill();

      // Move
      p.x += Math.cos(p.dir) * p.speed;
      p.y += Math.sin(p.dir) * p.speed;

      // Drift twinkle
      p.alpha += rand(-0.005, 0.005);
      p.alpha = Math.max(0.1, Math.min(0.9, p.alpha));

      // Wrap around
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ============ REVEAL ON SCROLL ============
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

const targets = document.querySelectorAll(
  '.section-head, .cat-card, .feature__copy, .feature__media, .stat, .about__copy, .cta__box'
);
targets.forEach((el) => {
  el.classList.add('reveal');
  io.observe(el);
});

// ============ NAV SCROLL ============
const nav = document.querySelector('.nav');
const onScroll = () => {
  if (window.scrollY > 20) nav.style.boxShadow = '0 2px 12px rgba(0,0,0,.08)';
  else nav.style.boxShadow = '';
};
window.addEventListener('scroll', onScroll, { passive: true });

// ============ WHATSAPP: APP EN MÓVIL ============
document.addEventListener('click', function(e) {
  const a = e.target.closest('a[href*="wa.me"]');
  if (!a) return;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    e.preventDefault();
    const url = new URL(a.href);
    const phone = url.pathname.replace('/', '');
    const text = url.searchParams.get('text') || '';
    window.location.href = 'whatsapp://send?phone=' + phone + '&text=' + encodeURIComponent(text);
  }
});

// ============ MOBILE MENU ============
const burger = document.querySelector('.nav__burger');
const links  = document.querySelector('.nav__links');
if (burger && links) {
  burger.addEventListener('click', () => {
    const open = links.style.display === 'flex';
    links.style.display    = open ? '' : 'flex';
    links.style.position   = 'absolute';
    links.style.top        = '100%';
    links.style.left       = '0';
    links.style.right      = '0';
    links.style.flexDirection = 'column';
    links.style.background = '#fff';
    links.style.padding    = '20px';
    links.style.borderBottom = '1px solid #e2e8f0';
  });
}
