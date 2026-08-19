const header = document.getElementById('header');
const menu = document.getElementById('mobileMenu');
const menuBtn = document.querySelector('.menu-btn');
const closeMenu = document.querySelector('.close-menu');
const backTop = document.getElementById('backTop');
const progress = document.querySelector('.scroll-progress span');
const fixedBook = document.getElementById('booking');
const footer = document.querySelector('footer');

function onScroll(){
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 60);
  backTop?.classList.toggle('visible', y > window.innerHeight * .65);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = (max ? y / max * 100 : 0) + '%';

  document.querySelectorAll('.parallax').forEach(el => {
    const r = el.getBoundingClientRect();
    const speed = Number(el.dataset.speed || .12);
    const center = r.top + r.height / 2 - window.innerHeight / 2;
    el.style.transform = `translate3d(0, ${center * -speed}px, 0)`;
  });

  const orb = document.querySelector('.orb-a');
  if (orb) orb.style.setProperty('--orb-shift', `${Math.min(y * .08, 100)}px`);
}
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

menuBtn?.addEventListener('click', () => menu.classList.add('open'));
closeMenu?.addEventListener('click', () => menu.classList.remove('open'));
document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

backTop?.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      if (entry.target.dataset.once !== 'false') observer.unobserve(entry.target);
    }
  });
}, {threshold:.12, rootMargin:'0px 0px -7% 0px'});

document.querySelectorAll(
  '.section-label,.display-title,.intro-copy,.intro-visual,.stats div,.canal-content,.canal-number,' +
  '.section-head,.res-card,.experience-intro,.experience-card,.exp-row,.split-image,.split-content,' +
  '.location-grid>div,.phase,.gallery-head,.g,.investment-bg,' +
  '.booking-inner,.contact-grid>div,footer>div'
).forEach((el,i) => {
  el.classList.add(i % 3 === 0 ? 'reveal-left' : i % 3 === 1 ? 'scroll-reveal' : 'reveal-right');
  el.style.transitionDelay = `${Math.min((i % 5) * 70, 280)}ms`;
  observer.observe(el);
});

document.querySelectorAll('.res-image,.g,.split-image,.canal-image,.hotel-image,.investment-bg,.intro-visual').forEach(el => {
  el.classList.add('zoom-reveal');
  observer.observe(el);
});

document.querySelectorAll('.floating-photo,.orb-a,.orb-b,.location-watermark,.gallery-watermark').forEach(el => {
  el.classList.add('parallax');
  el.dataset.speed = el.classList.contains('orb-a') ? '.08' : '.035';
});

const countObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    const start = performance.now(), duration = 1300;
    const tick = now => {
      const p = Math.min((now-start)/duration, 1);
      el.textContent = Math.floor((1-Math.pow(1-p,3))*target).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    obs.unobserve(el);
  });
}, {threshold:.7});
document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

document.querySelectorAll('.exp-row').forEach(row => {
  row.addEventListener('mouseenter', () => {
    document.querySelectorAll('.exp-row').forEach(r => r.classList.remove('active'));
    row.classList.add('active');
  });
});

document.querySelectorAll('.time').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.time').forEach(x => x.classList.remove('active'));
    item.classList.add('active');
  });
});

document.getElementById('bookBtn')?.addEventListener('click', () => {
  alert('Connect this button to the final hotel booking engine.');
});
document.querySelector('.contact-form button')?.addEventListener('click', () => {
  alert('Connect this form to your CRM / email endpoint.');
});

document.addEventListener('mousemove', e => {
  const c = document.querySelector('.cursor');
  if (!c) return;
  c.style.left = e.clientX + 'px';
  c.style.top = e.clientY + 'px';
});
document.querySelectorAll('a,button,.res-card,.experience-card,.exp-row,.g').forEach(el => {
  el.addEventListener('mouseenter', () => {
    const c = document.querySelector('.cursor');
    if (c) { c.style.width='34px'; c.style.height='34px'; }
  });
  el.addEventListener('mouseleave', () => {
    const c = document.querySelector('.cursor');
    if (c) { c.style.width='14px'; c.style.height='14px'; }
  });
});

const heroVideo = document.querySelector('.hero-video');
heroVideo?.addEventListener('error', () => heroVideo.style.display='none');

// Make the hero video subtly react to scrolling without disturbing playback.
window.addEventListener('scroll', () => {
  if (!heroVideo) return;
  const p = Math.min(window.scrollY / window.innerHeight, 1);
  heroVideo.style.transform = `scale(${1 + p * .06}) translateY(${p * 2}%)`;
  heroVideo.style.opacity = String(1 - p * .22);
}, {passive:true});


// Keep the fixed booking bar out of the footer area so the footer remains fully visible.
if (fixedBook && footer) {
  const footerObserver = new IntersectionObserver(([entry]) => {
    fixedBook.classList.toggle('is-hidden', entry.isIntersecting);
  }, {threshold: 0.02});
  footerObserver.observe(footer);
}


// Simple built-in online chat UI. Messages are kept in the current page session.
const chatWidget = document.getElementById('chatWidget');
const chatTrigger = document.getElementById('chatTrigger');
const chatClose = document.getElementById('chatClose');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

function setChat(open){
  if (!chatWidget) return;
  chatWidget.classList.toggle('open', open);
  chatWidget.setAttribute('aria-hidden', String(!open));
  if (open) setTimeout(() => chatInput?.focus(), 220);
}
chatTrigger?.addEventListener('click', () => setChat(!chatWidget.classList.contains('open')));
chatClose?.addEventListener('click', () => setChat(false));

chatForm?.addEventListener('submit', e => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;

  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble user';
  bubble.textContent = message;
  chatMessages.appendChild(bubble);
  chatInput.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Demo response until a live-chat backend is connected.
  setTimeout(() => {
    const reply = document.createElement('div');
    reply.className = 'chat-bubble agent';
    reply.textContent = 'Thank you. A VENICE team member will be happy to assist you.';
    chatMessages.appendChild(reply);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 650);
});

/* VENICE — linked cards and residence detail lightbox */
document.querySelectorAll('[data-page-link]').forEach(function(card){
  card.addEventListener('click', function(e){
    if(e.target.closest('a,button,input,select,textarea')) return;
    window.location.href = card.getAttribute('data-page-link');
  });
  card.addEventListener('keydown', function(e){
    if((e.key === 'Enter' || e.key === ' ') && !e.target.closest('a,button,input,select,textarea')){
      e.preventDefault();
      window.location.href = card.getAttribute('data-page-link');
    }
  });
});

(function(){
  const items = Array.from(document.querySelectorAll('.detail-gallery-item'));
  const box = document.getElementById('detailLightbox');
  if(!items.length || !box) return;
  const img = box.querySelector('.detail-lightbox-image');
  const count = box.querySelector('.detail-lightbox-count');
  let current = 0;
  function show(index){
    current=(index+items.length)%items.length;
    img.src=items[current].dataset.full;
    img.alt=items[current].dataset.alt || '';
    count.textContent=String(current+1).padStart(2,'0')+' / '+String(items.length).padStart(2,'0');
  }
  function open(index){show(index);box.classList.add('is-open');document.body.style.overflow='hidden';}
  function close(){box.classList.remove('is-open');document.body.style.overflow='';}
  items.forEach((item,i)=>item.addEventListener('click',()=>open(i)));
  box.querySelector('.detail-lightbox-close').addEventListener('click',close);
  box.querySelector('.detail-lightbox-prev').addEventListener('click',()=>show(current-1));
  box.querySelector('.detail-lightbox-next').addEventListener('click',()=>show(current+1));
  box.addEventListener('click',e=>{if(e.target===box) close();});
  document.addEventListener('keydown',e=>{
    if(!box.classList.contains('is-open')) return;
    if(e.key==='Escape') close();
    if(e.key==='ArrowLeft') show(current-1);
    if(e.key==='ArrowRight') show(current+1);
  });
})();
