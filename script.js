// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {

  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- 1. SKELETON LOADING LOGIC ---
  const bentoCards = document.querySelectorAll('.bento-card');
  bentoCards.forEach(card => card.classList.add('skeleton-active'));
  
  setTimeout(() => {
    bentoCards.forEach(card => {
      card.classList.remove('skeleton-active');
      card.querySelectorAll('*').forEach(child => {
        child.style.opacity = '1';
      });
    });
  }, 1500);

  // --- 2. INFINITE CONTINUOUS TYPING ANIMATION ---
  const typingElement = document.getElementById('typing-text');
  if (typingElement) {
    const textToType = "AI | Aspiring Software Engineer | Video Editor";
    let typeIndex = 0;
    let isDeleting = false;

    function typeWriter() {
      if (!isDeleting && typeIndex <= textToType.length) {
        // Typing
        typingElement.textContent = textToType.slice(0, typeIndex);
        typeIndex++;
        setTimeout(typeWriter, 100);
      } else if (isDeleting && typeIndex >= 0) {
        // Deleting
        typingElement.textContent = textToType.slice(0, typeIndex);
        typeIndex--;
        setTimeout(typeWriter, 50);
      } else {
        // Pause at the end or beginning before switching directions
        isDeleting = !isDeleting;
        setTimeout(typeWriter, 1200);
      }
    }
    
    // Start typing just before skeletons disappear
    setTimeout(typeWriter, 1000); 
  }

  // --- 3. HERO SCROLL FADE LOGIC ---
  const heroSection = document.getElementById('hero');
  window.addEventListener('scroll', () => {
    if (heroSection) {
      const scrollY = window.scrollY;
      const opacityOut = Math.max(0, 1 - (scrollY / 500));
      heroSection.style.opacity = opacityOut;
    }
  });

  // --- 4. INTERSECTION OBSERVER FOR HUD BENTO CARDS ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  // --- 5. NAV BAR SMOOTH SCROLLING ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({ 
          behavior: 'smooth' 
        });
        
        // If mobile overlay is open, close it on click
        const mobileNav = document.getElementById('mobileNav');
        if (mobileNav.classList.contains('active')) {
          mobileNav.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  });

  // --- 6. MOBILE HUD MENU TOGGLE ---
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const mobileNav = document.getElementById('mobileNav');

  if (mobileMenuBtn && closeMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNav.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });

    closeMenuBtn.addEventListener('click', () => {
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // --- 7. VANILLA JS AMBIENT PARTICLE SYSTEM (CANVAS) ---
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;
    
    function initCanvas() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', initCanvas);
    initCanvas();
    
    class Particle {
      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = Math.random() * 0.8 - 0.4;
        this.speedY = Math.random() * 0.8 - 0.4;
        // Spiderman colors: faint red or cyan
        this.color = Math.random() > 0.5 ? 'rgba(226, 54, 54, 0.4)' : 'rgba(80, 139, 249, 0.4)';
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off edges
        if (this.x < 0 || this.x > w) this.speedX *= -1;
        if (this.y < 0 || this.y > h) this.speedY *= -1;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
      }
    }
    
    // Create 70 particles
    for (let i = 0; i < 70; i++) {
      particles.push(new Particle());
    }
    
    function animateParticles() {
      ctx.clearRect(0, 0, w, h);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
  }

});
