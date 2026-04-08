async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
            // Execute scripts in the component if any
            const scripts = element.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                if (script.src) {
                    newScript.src = script.src;
                } else {
                    newScript.textContent = script.textContent;
                }
                document.body.appendChild(newScript);
                script.remove();
            });
        }
    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
    }
}

// Initialize all features once components are loaded
function initializeFeatures() {
    // Mobile menu toggle
    const mobileMenuButton = document.querySelector(".mobile-menu-button");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll(".mobile-menu a").forEach((link) => {
            link.addEventListener("click", () => {
                mobileMenu.classList.add("hidden");
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: "smooth",
                });
            }
        });
    });

    // Initialize 3D Background (if Three.js is loaded)
    if (typeof THREE !== 'undefined') {
        initThreeJS();
    }
}

function initThreeJS() {
    const container = document.getElementById("threejs-container");
    if (!container) return;
    
    // Clear previous if any
    container.innerHTML = '';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshBasicMaterial({
        color: 0x00fff7,
        wireframe: true,
        transparent: true,
        opacity: 0.2,
    });

    const shapes = [];
    const count = 8;

    for (let i = 0; i < count; i++) {
        const shape = new THREE.Mesh(geometry, material);
        shape.position.x = Math.random() * 20 - 10;
        shape.position.y = Math.random() * 20 - 10;
        shape.position.z = Math.random() * 10 - 20;
        const scale = Math.random() * 2 + 0.5;
        shape.scale.set(scale, scale, scale);
        shape.userData = {
            speed: {
                x: Math.random() * 0.02 - 0.01,
                y: Math.random() * 0.02 - 0.01,
                z: Math.random() * 0.02 - 0.01,
            },
        };
        scene.add(shape);
        shapes.push(shape);
    }

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        shapes.forEach((shape) => {
            shape.rotation.x += shape.userData.speed.x;
            shape.rotation.y += shape.userData.speed.y;
            shape.rotation.z += shape.userData.speed.z;
        });
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Load all components sequentially then initialize
document.addEventListener('DOMContentLoaded', async () => {
    const components = [
        { id: 'nav-component', path: 'components/nav.html' },
        { id: 'hero-component', path: 'components/hero.html' },
        { id: 'about-component', path: 'components/about.html' },
        { id: 'skills-component', path: 'components/skills.html' },
        { id: 'experience-component', path: 'components/experience.html' },
        { id: 'projects-component', path: 'components/projects.html' },
        { id: 'contact-component', path: 'components/contact.html' },
        { id: 'footer-component', path: 'components/footer.html' }
    ];

    // Load components in order or in parallel?
    // Parallel is faster, but order might matter if they depend on each other (some don't here).
    await Promise.all(components.map(comp => loadComponent(comp.id, comp.path)));
    
    initializeFeatures();
});