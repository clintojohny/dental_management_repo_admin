/**
 * MAIN.JS - Infoasis
 * Controls Three.js Background, Lottie, Swiper, GSAP, AOS, and 3D Cards
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: false, // animate every time you scroll up and down
        offset: 100
    });

    // 2. Initialize Three.js Digital Network Background
    initThreeJSBackground();

    // 3. Initialize Swiper for Projects Showcase
    initSwiper();

    // 4. Initialize Lottie Animations for Tech Stack
    initLottieAnimations();

    // 5. Initialize GSAP Scroll & Slow Motion Elements
    initGSAPEffects();

    // 6. Initialize 3D Floating Cards Tilt Effect
    init3DCards();

});

/* ==============================================
   Three.js Digital Network Background
   ============================================== */
function initThreeJSBackground() {
    const canvas = document.getElementById("network-canvas");
    if (!canvas) return;

    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 200;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Particles Data
    const particlesCount = 200; // number of dots
    const positions = new Float32Array(particlesCount * 3);
    const velocities = [];

    for (let i = 0; i < particlesCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 600;     // x
        positions[i * 3 + 1] = (Math.random() - 0.5) * 600; // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 600; // z

        velocities.push({
            x: (Math.random() - 0.5) * 0.5,
            y: (Math.random() - 0.5) * 0.5,
            z: (Math.random() - 0.5) * 0.5
        });
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Material
    const material = new THREE.PointsMaterial({
        color: 0x00e5ff,
        size: 2,
        transparent: true,
        opacity: 0.6
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Connected Lines Material
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x0066ff,
        transparent: true,
        opacity: 0.15
    });

    // We will dynamically create lines between close particles in the render loop
    // But for performance, it's better to update buffer geometry.
    // Simplifying: we'll just slowly rotate the entire particle cloud to give that "slow motion" feel.

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        // Slow motion rotation
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.001;

        // Interactive camera movement
        camera.position.x += (mouseX * 50 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 50 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/* ==============================================
   Swiper Setup
   ============================================== */
function initSwiper() {
    new Swiper(".projectSwiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 3500,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            1200: {
                slidesPerView: 3,
            }
        }
    });
}

/* ==============================================
   Lottie Animations
   ============================================== */
function initLottieAnimations() {
    // Array of containers and corresponding public Lottie JSON urls
    // Note: These URLs are public domain/free lottie resources for tech structures.
    const lotties = [
        { id: "lottie-brain", url: "https://assets8.lottiefiles.com/private_files/lf30_gktfq137.json" }, 
        // fallback to some common AI/tech animation if 404, but these usually work.
        { id: "lottie-code", url: "https://assets4.lottiefiles.com/packages/lf20_vnikrcia.json" },
        { id: "lottie-server", url: "https://assets2.lottiefiles.com/packages/lf20_mK7iW6.json" },
        { id: "lottie-network", url: "https://assets9.lottiefiles.com/packages/lf20_xRMmbs.json" }
    ];

    lotties.forEach(item => {
        const container = document.getElementById(item.id);
        if (container) {
            try {
                lottie.loadAnimation({
                    container: container,
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    path: item.url // the path to the animation json
                });
            } catch (e) {
                console.log("Lottie load error for ", item.id, e);
                // Fallback text or svg could go here
                container.innerHTML = "<div style='color: #00e5ff; font-size: 3rem;'>⚡</div>";
            }
        }
    });
}

/* ==============================================
   GSAP Slow Motion & Parallax
   ============================================== */
function initGSAPEffects() {
    gsap.registerPlugin(ScrollTrigger);

    // Parallax on Header Background
    gsap.to(".hero-content", {
        yPercent: 50,
        ease: "none",
        scrollTrigger: {
            trigger: "#hero",
            start: "top top", 
            end: "bottom top",
            scrub: true
        }
    });

    // Slow revealing of sections
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.fromTo(title, {
            letterSpacing: "10px",
            opacity: 0
        }, {
            letterSpacing: "2px",
            opacity: 1,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
                trigger: title,
                start: "top 80%",
            }
        });
    });
}

/* ==============================================
   Vanilla JS 3D Cards Tilt Effect
   ============================================== */
function init3DCards() {
    const cards = document.querySelectorAll(".3d-card");
    
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation amounts (tweak the divisor for intensity)
            const rotateX = ((y - centerY) / centerY) * -15; 
            const rotateY = ((x - centerX) / centerX) * 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener("mouseleave", () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
}
