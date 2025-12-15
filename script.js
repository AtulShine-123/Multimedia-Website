/* =========================================
   1. CUSTOM CURSOR
   ========================================= */
const cursorDot = document.querySelector('.cursor-dot');
const cursorCircle = document.querySelector('.cursor-circle');
const hoverTargets = document.querySelectorAll('.hover-target, a');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Dot follows instantly
    if(cursorDot) {
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
    }

    // Circle follows with lag
    if(cursorCircle) {
        cursorCircle.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    }
});

hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    target.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

/* =========================================
   2. SCROLL REVEAL (Intersection Observer)
   ========================================= */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';

            // Trigger Text Glitch if available
            const glitchTarget = entry.target.querySelector('.glitch-target');
            if(glitchTarget) scrambleText(glitchTarget);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal-up, .hero').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'all 1s cubic-bezier(0.2, 1, 0.3, 1)';
    observer.observe(el);
});

/* =========================================
   3. TEXT SCRAMBLE EFFECT
   ========================================= */
function scrambleText(element) {
    const originalText = element.getAttribute('data-text');
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    let iteration = 0;

    let interval = setInterval(() => {
        element.innerText = originalText
            .split("")
            .map((letter, index) => {
                if(index < iteration) return originalText[index];
                return chars[Math.floor(Math.random() * chars.length)]
            })
            .join("");

        if(iteration >= originalText.length) clearInterval(interval);
        iteration += 1/3;
    }, 30);
}

/* =========================================
   4. ACCORDION LOGIC
   ========================================= */
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        item.classList.toggle('active');
    });
});

/* =========================================
   5. 3D TILT EFFECT FOR CARDS
   ========================================= */
document.querySelectorAll('.art-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const inner = card.querySelector('.card-inner');
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate rotation (max 15deg)
        const xRotation = -1 * ((y - rect.height/2) / rect.height * 20);
        const yRotation = (x - rect.width/2) / rect.width * 20;

        inner.style.transform = `rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        const inner = card.querySelector('.card-inner');
        inner.style.transform = 'rotateX(0) rotateY(0)';
    });
});

/* =========================================
   6. LIGHTBOX FUNCTIONALITY
   ========================================= */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

function openLightbox(cardElement) {
    // Get background image URL from clicked card
    const bgDiv = cardElement.querySelector('.card-bg');
    const bgStyle = window.getComputedStyle(bgDiv).backgroundImage;

    // Extract URL (removes 'url("' and '")')
    const imgUrl = bgStyle.slice(5, -2).replace(/['"]/g, "");

    lightboxImg.src = imgUrl;
    lightbox.classList.add('active');
}

if(lightboxClose) {
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });
}

// Close on escape key
document.addEventListener('keydown', (e) => {
    if(e.key === "Escape" && lightbox) lightbox.classList.remove('active');
});

/* =========================================
   7. CANVAS FLUID BACKGROUND
   ========================================= */
const canvas = document.getElementById('fluid-canvas');

if(canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;

    // Resize
    const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Particles
    const particles = [];
    for(let i=0; i<50; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 200 + 50,
            color: Math.random() > 0.5 ? '#00ffcc' : '#7000ff'
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'screen'; // Blending mode

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // Bounce
            if(p.x < 0 || p.x > width) p.vx *= -1;
            if(p.y < 0 || p.y > height) p.vy *= -1;

            // Draw gradient blob
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            g.addColorStop(0, p.color + '44'); // Hex + Alpha
            g.addColorStop(1, 'transparent');

            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    animate();
}