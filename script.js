/*
   ==========================================================================
   1. ROUTER LOGIC (SPA ENGINE)
   ==========================================================================
*/
const router = {
    pages: document.querySelectorAll('.page'),
    navItems: document.querySelectorAll('.nav-item'),
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

        // Update Nav UI
        this.navItems.forEach(item => item.classList.remove('active'));
        this.navItems[targetIndex].classList.add('active');

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

router.init();

/*
   ==========================================================================
   2. UI INTERACTIVITY
   ==========================================================================
*/
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

window.addEventListener('mousemove', (e) => {
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;

    cursorRing.animate({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`
    }, { duration: 500, fill: "forwards" });

    document.getElementById('coords').innerText =
        `${e.clientX.toString().padStart(4, '0')}:${e.clientY.toString().padStart(4, '0')}`;
});

const hoverTargets = document.querySelectorAll('.hover-trigger, a, button');
hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

// Lightbox Logic
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

function openLightbox(element) {
    // Check if it's a gallery card or a photo slot
    let url = "";
    const bgDiv = element.querySelector('.card-bg');

    if (bgDiv) {
        // Extract URL from style
        const bgStyle = bgDiv.style.backgroundImage;
        if(bgStyle) {
            url = bgStyle.slice(5, -2).replace(/['"]/g, "");
        } else {
            return; // No image
        }
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

// Accordion (Critique)
const logs = document.querySelectorAll('.log-entry');
logs.forEach(log => {
    log.querySelector('.log-header').addEventListener('click', () => {
        log.classList.toggle('active');
    });
});

// Photography Toggle (Bio Page)
function togglePhotoGallery() {
    const gallery = document.getElementById('photo-gallery');
    gallery.classList.toggle('open');
}

/*
   ==========================================================================
   3. BACKGROUND PARTICLES
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
        this.size = Math.random() * 2;
        this.alpha = Math.random() * 0.5;
        this.life = Math.random() * 100;
    }
    update() {
        this.x += this.vx; this.y += this.vy; this.life--;
        if (this.life <= 0 || this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 242, ${this.alpha})`;
        ctx.fill();
    }
}

for (let i = 0; i < 100; i++) particles.push(new Particle());

function animate() {
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 0.2;
    ctx.strokeStyle = 'rgba(0, 255, 242, 0.1)';

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
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}
animate();