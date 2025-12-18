/*
   ==========================================================================
   1. MATRIX TEXT SCRAMBLE (HOME TITLE)
   ==========================================================================
*/
function scrambleText(element) {
    if (!element) return;
    const finalState = element.getAttribute('data-value');
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/A.SHINE';
    let iterations = 0;

    clearInterval(element.interval);

    element.interval = setInterval(() => {
        element.innerText = finalState
            .split("")
            .map((letter, index) => {
                if (index < iterations) {
                    return finalState[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");

        if (iterations >= finalState.length) {
            clearInterval(element.interval);
        }

        iterations += 1/3;
    }, 30);
}

// Trigger on load
document.addEventListener('DOMContentLoaded', () => {
    const title = document.getElementById('scramble-title');
    scrambleText(title);

    // Also init router
    router.init();
});

/*
   ==========================================================================
   2. ROUTER LOGIC (SPA ENGINE) WITH RED STREAK
   ==========================================================================
*/
const router = {
    pages: document.querySelectorAll('.page'),
    navItems: document.querySelectorAll('.nav-item'),
    streak: document.getElementById('warp-streak'),
    currentPage: 0,
    isAnimating: false,

    init() {
        // Initial Page Load Animation
        setTimeout(() => {
            this.pages[0].classList.add('active');
        }, 100);
    },

    navigate(targetIndex) {
        if (this.isAnimating || targetIndex === this.currentPage) return;
        this.isAnimating = true;

        const oldPage = this.pages[this.currentPage];
        const newPage = this.pages[targetIndex];

        // Trigger Red Streak Animation
        this.streak.classList.remove('active');
        void this.streak.offsetWidth; // Trigger Reflow
        this.streak.classList.add('active');

        // Update Nav UI
        this.navItems.forEach(item => item.classList.remove('active'));
        if(this.navItems[targetIndex]) this.navItems[targetIndex].classList.add('active');

        // 1. Fade OUT old page
        oldPage.classList.remove('active');

        // 2. Wait for transition (matches CSS duration of 0.6s)
        setTimeout(() => {
            // 3. Fade IN new page
            newPage.classList.add('active');
            newPage.scrollTop = 0;

            this.currentPage = targetIndex;
            this.isAnimating = false;
        }, 600);
    }
};

/*
   ==========================================================================
   3. TRAILING CURSOR SYSTEM (PHYSICS-BASED)
   ==========================================================================
*/
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

// Mouse position (instant)
let mouseX = 0;
let mouseY = 0;

// Ring position (delayed)
let ringX = 0;
let ringY = 0;

// Lerp function for smooth trailing
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

// Update mouse position
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Update coordinates HUD
    document.getElementById('coords').innerText =
        `${mouseX.toString().padStart(4, '0')}:${mouseY.toString().padStart(4, '0')}`;
});

// Animation loop for cursor ring (trails behind)
function animateCursor() {
    // Instant dot position
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;

    // Smooth ring position (trails with 0.12 factor)
    ringX = lerp(ringX, mouseX, 0.12);
    ringY = lerp(ringY, mouseY, 0.12);

    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;

    requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover States
const hoverTargets = document.querySelectorAll('.hover-trigger, a, button');
hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

/*
   ==========================================================================
   4. LIGHTBOX
   ==========================================================================
*/
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

function openLightbox(element) {
    let url = "";
    const bgDiv = element.querySelector('.card-bg');
    if (bgDiv) {
        const bgStyle = bgDiv.style.backgroundImage;
        if(bgStyle) url = bgStyle.slice(5, -2).replace(/['"]/g, "");
    } else if (element.tagName === 'IMG') {
        url = element.src;
    }

    if (url) {
        lightboxImg.src = url;
        lightbox.classList.add('active');
    }
}

document.getElementById('lightbox-close').addEventListener('click', () => {
    lightbox.classList.remove('active');
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lightbox.classList.remove('active');
});

/*
   ==========================================================================
   5. ACCORDION
   ==========================================================================
*/
const logs = document.querySelectorAll('.log-entry');
logs.forEach(log => {
    log.querySelector('.log-header').addEventListener('click', () => {
        log.classList.toggle('active');
    });
});

/*
   ==========================================================================
   6. PHOTOGRAPHY MODULE TOGGLE & AUTO-SCROLL
   ==========================================================================
*/
const photoTrigger = document.getElementById('photo-trigger');
const photoGrid = document.getElementById('photo-grid');

if(photoTrigger && photoGrid) {
    photoTrigger.addEventListener('click', () => {
        photoTrigger.classList.toggle('active');
        photoGrid.classList.toggle('expanded');

        // Auto Scroll if opening
        if (photoGrid.classList.contains('expanded')) {
            setTimeout(() => {
                photoGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    });
}

/*
   ==========================================================================
   7. BACKGROUND PARTICLES (RED/BLACK THEME)
   ==========================================================================
*/
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let w, h;
let particles = [];

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2.5;
        this.alpha = Math.random() * 0.5;
        this.life = Math.random() * 100;
        // Color variation: Red or Grey
        this.color = Math.random() > 0.8 ? '255, 0, 85' : '100, 100, 100';
    }
    update() {
        this.x += this.vx; this.y += this.vy; this.life--;
        if (this.life <= 0 || this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.fill();
    }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function animate() {
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 0.2;

    for (let i = 0; i < particles.length; i++) {
        let p1 = particles[i];
        p1.update();
        p1.draw();
        for (let j = i; j < particles.length; j++) {
            let p2 = particles[j];
            let dx = p1.x - p2.x;
            let dy = p1.y - p2.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(${p1.color}, 0.1)`;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}
animate();