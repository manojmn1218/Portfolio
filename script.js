/* ==========================================================================
   MANOJ PORTFOLIO — INTERACTIVE ENGINE
   High-Fidelity Animations, Fluid Canvas, Spotlight Effects & Lightbox
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ========== 1. SCROLL PROGRESS INDICATOR ==========
  const progressBar = document.getElementById('scroll-progress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight > 0) {
      const scrolled = (scrollTop / docHeight) * 100;
      if (progressBar) progressBar.style.width = `${scrolled}%`;
    }
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // ========== 2. FLOATING NAVBAR SCROLL BEHAVIOR ==========
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function handleNavbarScroll() {
    const scrollY = window.scrollY;
    if (navbar) {
      if (scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Active Section Tracking
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === currentSectionId) {
        link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  // Mobile Menu Toggle
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ========== 3. FLUID AURORA CANVAS REACTOR ==========
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: null, y: null, radius: 140 };

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resizeCanvas();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class AuroraParticle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.55;
        this.vy = (Math.random() - 0.5) * 0.55;
        this.size = Math.random() * 2.5 + 1;
        this.colorType = Math.random();
        this.baseAlpha = Math.random() * 0.4 + 0.15;
        this.alpha = this.baseAlpha;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Interaction with mouse
        if (mouse.x !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 3;
            this.y -= (dy / dist) * force * 3;
            this.alpha = Math.min(this.baseAlpha + 0.35, 0.9);
          } else {
            this.alpha = this.baseAlpha;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        if (this.colorType < 0.5) {
          ctx.fillStyle = `rgba(0, 242, 254, ${this.alpha})`; // Cyan
        } else if (this.colorType < 0.85) {
          ctx.fillStyle = `rgba(138, 43, 226, ${this.alpha})`; // Violet
        } else {
          ctx.fillStyle = `rgba(0, 245, 160, ${this.alpha})`; // Mint
        }
        ctx.fill();
      }
    }

    function initParticles() {
      const count = Math.min(Math.floor((width * height) / 14000), 100);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new AuroraParticle());
      }
    }
    initParticles();

    function drawMeshConnections() {
      const maxDist = 125;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.16;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function renderAurora() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      drawMeshConnections();
      requestAnimationFrame(renderAurora);
    }
    renderAurora();
  }

  // ========== 4. INTERACTIVE HERO DEV TERMINAL ==========
  const terminalTabs = document.querySelectorAll('.terminal-tab');
  const terminalContent = document.getElementById('terminal-content');
  const terminalCopyBtn = document.getElementById('terminal-copy-btn');

  const snippets = {
    profile: `<code><span class="token-keyword">const</span> developer: <span class="token-property">Engineer</span> = {
  <span class="token-property">name</span>: <span class="token-string">'Manoj M N'</span>,
  <span class="token-property">role</span>: <span class="token-string">'Full-Stack Software Engineer'</span>,
  <span class="token-property">specialties</span>: [
    <span class="token-string">'High-Performance Frontends'</span>,
    <span class="token-string">'Scalable REST & Auth Architectures'</span>,
    <span class="token-string">'Interactive Systems & Generative AI'</span>
  ],
  <span class="token-property">philosophy</span>: <span class="token-string">'Crafting clean code with relentless UX care'</span>,
  <span class="token-property">status</span>: <span class="token-string">'⚡ Shipping products that delight users'</span>
};</code>`,

    stack: `<code>{
  <span class="token-property">"coreLanguages"</span>: [<span class="token-string">"TypeScript"</span>, <span class="token-string">"JavaScript (ES2026)"</span>, <span class="token-string">"SQL"</span>],
  <span class="token-property">"frontendEcosystem"</span>: [<span class="token-string">"React 19"</span>, <span class="token-string">"Next.js"</span>, <span class="token-string">"Tailwind CSS"</span>, <span class="token-string">"Framer Motion"</span>],
  <span class="token-property">"backendInfrastructure"</span>: [<span class="token-string">"Node.js"</span>, <span class="token-string">"Express"</span>, <span class="token-string">"Prisma ORM"</span>, <span class="token-string">"PostgreSQL"</span>],
  <span class="token-property">"aiAndCloud"</span>: [<span class="token-string">"Google Cloud GenAI Studio"</span>, <span class="token-string">"Docker"</span>, <span class="token-string">"Vercel Edge"</span>]
}</code>`,

    terminal: `<code><span class="token-comment"># Initializing Manoj M N Developer Environment...</span>
<span class="token-keyword">$</span> npx manoj-mn --status
<span class="token-string">✔ Systems Operational: Ready for deployment</span>
<span class="token-string">✔ Location: India [Available Worldwide / Remote]</span>
<span class="token-string">✔ Passion: Engineering elegant, robust web systems</span>
<span class="token-keyword">$</span> echo <span class="token-string">"Let's build something extraordinary together."</span></code>`
  };

  terminalTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      terminalTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const tabKey = tab.getAttribute('data-tab');
      if (terminalContent && snippets[tabKey]) {
        terminalContent.innerHTML = snippets[tabKey];
      }
    });
  });

  if (terminalCopyBtn && terminalContent) {
    terminalCopyBtn.addEventListener('click', () => {
      const textToCopy = terminalContent.innerText;
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('Code copied to clipboard! 📋');
      });
    });
  }

  // ========== 5. SPOTLIGHT CARDS EFFECT ==========
  const spotlightCards = document.querySelectorAll('.spotlight-card, .bento-card');
  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // ========== 6. 3D HOLOGRAPHIC TILT ON CREDENTIAL CARDS ==========
  const holoCards = document.querySelectorAll('.holo-cert-card');
  holoCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  // ========== 7. ANIMATED METRIC COUNTERS (BENTO GRID) ==========
  const counters = document.querySelectorAll('.counter');
  let countersTriggered = false;

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      let count = 0;
      const duration = 1600;
      const stepTime = Math.abs(Math.floor(duration / target));

      const timer = setInterval(() => {
        count += 1;
        counter.textContent = count + '+';
        if (count >= target) {
          clearInterval(timer);
          counter.textContent = target + '+';
        }
      }, Math.max(stepTime, 40));
    });
  }

  const statsSection = document.querySelector('.bento-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersTriggered) {
          countersTriggered = true;
          animateCounters();
        }
      });
    }, { threshold: 0.4 });
    statsObserver.observe(statsSection);
  }

  // ========== 8. PROJECTS CATEGORY FILTERING ==========
  const projectFilters = document.querySelectorAll('.filter-pill[data-filter]');
  const projectCards = document.querySelectorAll('.spotlight-card[data-category]');

  projectFilters.forEach(pill => {
    pill.addEventListener('click', () => {
      projectFilters.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ========== 9. TECH MATRIX FILTERING ==========
  const skillFilters = document.querySelectorAll('.filter-pill[data-skill-filter]');
  const skillItems = document.querySelectorAll('.skill-matrix-item[data-category]');

  skillFilters.forEach(pill => {
    pill.addEventListener('click', () => {
      skillFilters.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-skill-filter');
      skillItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 40);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(15px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // ========== 10. LIGHTBOX MODAL CONTROLLER ==========
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxClose = document.getElementById('lightbox-close');
  const certPreviews = document.querySelectorAll('.holo-cert-preview[data-lightbox-src]');

  function openLightbox(src, title) {
    if (lightboxImg && lightboxModal && lightboxTitle) {
      lightboxImg.src = src;
      lightboxTitle.textContent = title || 'Credential Preview';
      lightboxModal.classList.add('active');
      lightboxModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lightboxImg) lightboxImg.src = '';
    }
  }

  certPreviews.forEach(preview => {
    preview.addEventListener('click', () => {
      const src = preview.getAttribute('data-lightbox-src');
      const title = preview.getAttribute('data-lightbox-title');
      openLightbox(src, title);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });

  // ========== 11. 1-CLICK EMAIL COPY & TOAST NOTIFICATION ==========
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const toastNotice = document.getElementById('toast-notice');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer = null;

  function showToast(msg) {
    if (!toastNotice) return;
    if (toastMessage) toastMessage.textContent = msg;
    toastNotice.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 2800);
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'manojmn1218@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        copyEmailBtn.textContent = 'Copied! ✨';
        showToast('Email copied to clipboard! 📋');
        setTimeout(() => {
          copyEmailBtn.textContent = 'Copy';
        }, 2200);
      });
    });
  }

  // ========== 12. CONTACT FORM SUBMISSION SIMULATION ==========
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
        <span>Dispatching...</span>
      `;
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span>Dispatched Successfully!</span>
        `;
        showToast('Message sent! I will respond promptly. 🚀');
        contactForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 3000);
      }, 1200);
    });
  }

  // Add keyframe for spin if not already present
  const style = document.createElement('style');
  style.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);

  // ========== 13. INTERSECTION OBSERVER FOR SCROLL REVEAL ==========
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

});
