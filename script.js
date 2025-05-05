//imports

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize variables
    let currentPage = 'home';
    let isLoading = true;
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    // DOM Elements
    const loadingScreen = document.querySelector('.loading-screen');
    const startButton = document.querySelector('.start-button');
    const loadingProgress = document.querySelector('.loading-progress');
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const ctaButton = document.querySelector('.cta-button');
    const viewButtons = document.querySelectorAll('.view-button');
    const projectModal = document.querySelector('.project-modal');
    const closeModalButton = document.querySelector('.close-modal');
    const contactButton = document.querySelector('.contact-button');
    
    // Three.js Scene Setup
    let scene, camera, renderer, particles;
    
    // Initialize Three.js Scene
    function initThreeJS() {
        // Create scene
        scene = new THREE.Scene();
        
        // Create camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;
        
        // Create renderer
        renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('background-canvas'),
            antialias: true,
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
        
        // Create particles
        createParticles();
        
        // Start animation loop
        animate();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });
    }
    
    // Create particles for background
    function createParticles() {
        const particleCount = 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            // Position
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
            
            // Size
            sizes[i] = Math.random() * 2;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // Create material
        const material = new THREE.PointsMaterial({
            color: 0x3644ff,
            size: 0.1,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });
        
        // Create particle system
        particles = new THREE.Points(geometry, material);
        scene.add(particles);
    }
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Smooth mouse tracking
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;
        
        // Rotate particles based on mouse position
        if (particles) {
            particles.rotation.x += 0.001;
            particles.rotation.y += 0.002;
            
            // Add subtle movement based on mouse position
            particles.rotation.x += targetY * 0.001;
            particles.rotation.y += targetX * 0.001;
        }
        
        // Render scene
        renderer.render(scene, camera);
    }
    
    // Simulate loading progress
    function simulateLoading() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // Enable start button
                startButton.classList.add('active');
                isLoading = false;
            }
            loadingProgress.style.width = `${progress}%`;
        }, 200);
    }
    
    // Handle page navigation
    function navigateTo(pageName) {
        // Update current page
        currentPage = pageName;
        
        // Update navigation
        navLinks.forEach(link => {
            if (link.dataset.page === pageName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Update page visibility with animation
        pages.forEach(page => {
            if (page.id === pageName) {
                // Animate page in
                gsap.fromTo(page, 
                    { opacity: 0, y: 20 }, 
                    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", display: 'flex' }
                );
            } else {
                // Animate page out
                gsap.to(page, { opacity: 0, y: -20, duration: 0.5, ease: "power2.in", display: 'none' });
            }
        });
    }
    
    
    // Show project modal
    function showProjectModal(index) {
        const projects = [
            {
                title: 'Website Nature Photography',
                image: 'naturewebsite.png',
                description: 'A modern shopping experience with seamless checkout flow and product visualization. Built with React, Three.js, and a headless CMS for content management.',
                role: 'Developer',
                year: '2025',
                technologies: 'HTML, CSS, JavaScript',
                url: 'https://genesisreyes18.github.io/Website-NaturePhotography/'
            },
            {
                title: 'Catculus Crisis',
                image: 'catculus.png',
                description: 'Interactive journey planner with 3D visualizations of destinations. Users can explore locations in an immersive environment before booking their trips.',
                role: 'Frontend Developer',
                year: '2022',
                technologies: 'Vue.js, WebGL, MapBox, Node.js',
                url: 'https://ariannevt.github.io/Cactulus-Crisis/'
            },
            {
                title: 'Echoes of a day',
                image: 'echoes.png',
                description: 'Brand identity and website for a creative studio specializing in digital experiences. The site features custom animations and interactive elements.',
                role: 'Creative Developer',
                year: '2023',
                technologies: 'HTML, CSS, JavaScript, GSAP',
                url: 'https://alinoorisnerd.github.io/commlab_assign3/'
            },
            {
                title: 'The Hunger Games',
                image: 'hungergames.png',
                description: 'Audio-reactive 3D experience for artists to showcase their music. The visualizer responds to frequency and amplitude data from the audio track.',
                role: 'Technical Lead',
                year: '2022',
                technologies: 'Three.js, Web Audio API, React',
                url: 'https://genesisreyes18.github.io/TheHungerGames/'
            }
        ];
        
        const project = projects[index];
        
        // Update modal content
        document.querySelector('.modal-title').textContent = project.title;
        
        // Update the modal image - create an img element
        const modalImage = document.querySelector('.modal-image');
        modalImage.innerHTML = ''; // Clear any existing content
        const img = document.createElement('img');
        img.src = project.image;
        img.alt = project.title;
        modalImage.appendChild(img);
        
        document.querySelector('.modal-description p').textContent = project.description;
        document.querySelector('.detail:nth-child(1) p').textContent = project.role;
        document.querySelector('.detail:nth-child(2) p').textContent = project.year;
        document.querySelector('.detail:nth-child(3) p').textContent = project.technologies;
        document.querySelector('.visit-site').href = project.url;
        
        // Show modal with animation
        gsap.fromTo(projectModal, 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, duration: 0.5, display: 'flex' }
        );
    }
    
    // Hide project modal
    function hideProjectModal() {
        gsap.to(projectModal, { opacity: 0, y: 20, duration: 0.3, display: 'none' });
    }
    
    // Initialize application
    function init() {
        // Initialize Three.js
        initThreeJS();
        
        // Simulate loading
        simulateLoading();
        
        // Event Listeners
        startButton.addEventListener('click', () => {
            if (!isLoading) {
                // Hide loading screen
                gsap.to(loadingScreen, { opacity: 0, duration: 1, display: 'none' });
                
                // Show content
                gsap.fromTo('header', 
                    { opacity: 0, y: -20 }, 
                    { opacity: 1, y: 0, duration: 0.8, delay: 0.5 }
                );
                
                // Navigate to home page
                navigateTo('home');
            }
        });
        
        // Navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo(link.dataset.page);
            });
        });
        
        // CTA button
        if (ctaButton) {
            ctaButton.addEventListener('click', () => {
                navigateTo(ctaButton.dataset.page);
            });
        }
        
        // View project buttons
        viewButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                showProjectModal(index);
            });
        });
        
        // Close modal button
        closeModalButton.addEventListener('click', hideProjectModal);
        
        // Contact button
        if (contactButton) {
            contactButton.addEventListener('click', () => {
                alert('Contact form would open here. This is a placeholder for the demo.');
            });
        }
    }
    
    // Start the application
    init();
});