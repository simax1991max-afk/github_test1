/* ═══════════════════════════════════════════════════════════════
   НУМЕРОЛОГИЯ 7М · SHARED JAVASCRIPT
   Fire particles, copy helpers, nav active state
═══════════════════════════════════════════════════════════════ */

/* ── Fire Particle System ── */
(function initFireParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function() {
    this.x     = Math.random() * W;
    this.y     = H + 10;
    this.vx    = (Math.random() - 0.5) * 0.6;
    this.vy    = -(Math.random() * 1.5 + 0.5);
    this.life  = 0;
    this.maxLife = Math.random() * 120 + 60;
    this.r     = Math.random() * 2.5 + 0.5;
    const palettes = [
      [255, 180, 0], [255, 120, 10], [255, 80, 20],
      [255, 200, 50], [240, 140, 40]
    ];
    this.color = palettes[Math.floor(Math.random() * palettes.length)];
  };

  function init() {
    particles = Array.from({ length: 80 }, () => {
      const p = new Particle();
      p.y = Math.random() * H;
      p.life = Math.random() * p.maxLife;
      return p;
    });
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.life++;
      if (p.life > p.maxLife) { p.reset(); return; }
      p.x += p.vx + Math.sin(p.life * 0.05) * 0.3;
      p.y += p.vy;
      const progress = p.life / p.maxLife;
      const alpha = Math.sin(progress * Math.PI) * 0.55;
      const [r, g, b] = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * (1 - progress * 0.5), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }

  resize();
  init();
  animate();
  window.addEventListener('resize', () => { resize(); init(); });
})();

/* ── Copy to Clipboard ── */
function copyText(text, btnEl) {
  navigator.clipboard.writeText(text).then(() => {
    const original = btnEl.innerHTML;
    btnEl.innerHTML = '<i class="fas fa-check"></i> Скопировано!';
    btnEl.style.background = 'linear-gradient(135deg, #2d8a3e, #3aaa52)';
    setTimeout(() => {
      btnEl.innerHTML = original;
      btnEl.style.background = '';
    }, 2200);
  });
}

/* ── Toast notifications ── */
function showToast(message, type = 'info') {
  const colors = {
    info:    ['#6090d0', 'rgba(96,144,208,.15)'],
    success: ['#6dba7a', 'rgba(109,186,122,.15)'],
    error:   ['#e05050', 'rgba(224,80,80,.15)'],
    gold:    ['#f0b429', 'rgba(240,180,41,.15)'],
  };
  const [border, bg] = colors[type] || colors.info;
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 99999;
    background: ${bg}; border: 1px solid ${border};
    backdrop-filter: blur(12px); border-radius: 4px;
    padding: 14px 22px; color: #f5e8c8;
    font-family: 'Cinzel', serif; font-size: .85rem; letter-spacing: .04em;
    box-shadow: 0 8px 32px rgba(0,0,0,.5);
    animation: slideDown .3s ease; max-width: 320px; line-height: 1.5;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity .4s';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/* ── Active nav link ── */
(function setActiveNav() {
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.top-nav .nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href !== '#' && path.includes(href.replace('.html', ''))) {
      a.classList.add('active');
    }
  });
})();

/* ── Confetti burst ── */
function launchConfetti() {
  const colours = ['#f0b429','#ff8c00','#ffd870','#ff4500','#fff8e0'];
  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div');
    const size = Math.random() * 10 + 6;
    el.style.cssText = `
      position: fixed;
      left: ${Math.random() * 100}vw;
      top: -20px;
      width: ${size}px; height: ${size}px;
      background: ${colours[Math.floor(Math.random() * colours.length)]};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      z-index: 99999; pointer-events: none;
      animation: confettiFall ${Math.random() * 2 + 2}s ease-out ${Math.random() * 1}s forwards;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}

/* ── Simple countdown timer ── */
function startCountdown(elementId, targetDate) {
  function update() {
    const diff = new Date(targetDate) - new Date();
    if (diff <= 0) {
      const el = document.getElementById(elementId);
      if (el) el.textContent = 'Предложение истекло';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const el = document.getElementById(elementId);
    if (el) el.textContent = `${d}д ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }
  update();
  setInterval(update, 1000);
}
