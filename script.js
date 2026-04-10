// Reveal-on-scroll
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

// Nav background on scroll
const nav = document.querySelector('.nav');
const onScroll = () => {
  if (window.scrollY > 20) nav.style.borderBottomColor = 'rgba(59,130,246,.30)';
  else nav.style.borderBottomColor = '';
};
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile menu (basic toggle)
const burger = document.querySelector('.nav__burger');
const links = document.querySelector('.nav__links');
if (burger && links) {
  burger.addEventListener('click', () => {
    const open = links.style.display === 'flex';
    links.style.display = open ? '' : 'flex';
    links.style.position = 'absolute';
    links.style.top = '100%';
    links.style.left = '0';
    links.style.right = '0';
    links.style.flexDirection = 'column';
    links.style.background = '#0a0a0a';
    links.style.padding = '20px';
    links.style.borderBottom = '1px solid #2a2a2a';
  });
}
