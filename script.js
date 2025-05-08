// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    console.log("Portfolio script loaded")
  
    // Initialize variables
    let currentPage = "home"
    let isLoading = true
    let mouseX = 0
    let mouseY = 0
    let secondTorusKnot
  
    // DOM Elements
    const loadingScreen = document.querySelector(".loading-screen")
    const startButton = document.querySelector(".start-button")
    const loadingProgress = document.querySelector(".loading-progress")
    const navLinks = document.querySelectorAll(".nav-link")
    const pages = document.querySelectorAll(".page")
    const ctaButton = document.querySelector(".cta-button")
    const viewButtons = document.querySelectorAll(".view-button")
    const projectModal = document.querySelector(".project-modal")
    const closeModalButton = document.querySelector(".close-modal")
    const contactButton = document.querySelector(".contact-button")
  
    // Three.js Scene Setup
    let scene, camera, renderer
    let torusKnot
  
    // Import Three.js library (assumes it's available globally or via a module loader)
    // If using a module loader (e.g., Webpack, Parcel), replace with the appropriate import statement:
    // import * as THREE from 'three';
    // For global availability (e.g., included via a <script> tag), no import is needed.
    // However, we still need to declare the THREE variable if it's not already declared globally.
    if (typeof THREE === "undefined") {
      console.warn("THREE is not defined. Ensure Three.js is included in your HTML.")
    }
  
    // Initialize Three.js Scene
    function initThreeJS() {
      try {
        // Create scene
        scene = new THREE.Scene()
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.z = 30
  
        const canvas = document.getElementById("background-canvas")
        renderer = new THREE.WebGLRenderer({
          canvas: canvas,
          antialias: true,
          alpha: true,
        })
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  
        // Add lights
        const ambientLight = new THREE.AmbientLight(0x333333)
        scene.add(ambientLight)
  
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
        directionalLight.position.set(1, 1, 1)
        scene.add(directionalLight)
  
        // Add point lights for glow effect
        addPointLights()
  
        // Create background
        createBackground()
  
        // Create main object - simplified torus knot
        createMainObject()
  
        // Handle window resize
        window.addEventListener("resize", () => {
          camera.aspect = window.innerWidth / window.innerHeight
          camera.updateProjectionMatrix()
          renderer.setSize(window.innerWidth, window.innerHeight)
        })
  
        // Track mouse movement
        document.addEventListener("mousemove", (e) => {
          mouseX = (e.clientX / window.innerWidth) * 2 - 1
          mouseY = -(e.clientY / window.innerHeight) * 2 + 1
        })
  
        // Start animation loop
        animate()
      } catch (error) {
        console.error("Error initializing Three.js:", error)
        // Fallback background color if Three.js fails
        document.body.style.background = "linear-gradient(45deg, #1a0033, #000033)"
      }
    }
  
    // Add point lights for glow effect
    function addPointLights() {
      const colors = [0x9900ff, 0xff00ff, 0x00ffff, 0x3644ff, 0xff66ff]
  
      // Increase the number of lights from 5 to 8
      for (let i = 0; i < 8; i++) {
        const light = new THREE.PointLight(colors[i % colors.length], 1.5, 70) // Increased intensity and distance
        light.position.set((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50)
        scene.add(light)
      }
    }
  
    // Create background
    function createBackground() {
      const geometry = new THREE.PlaneGeometry(100, 100)
      const material = new THREE.MeshStandardMaterial({
        color: 0x000000,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0x330066,
        emissiveIntensity: 0.2,
      })
  
      const background = new THREE.Mesh(geometry, material)
      background.position.z = -50
      scene.add(background)
    }
  
    // Create main object - simplified torus knot
    function createMainObject() {
      // Create a more complex torus knot with more segments for smoother appearance
      const geometry = new THREE.TorusKnotGeometry(10, 3, 200, 32)
  
      // Create a more glowing material with higher emissive intensity
      const material = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0x660066,
        emissiveIntensity: 0.6, // Increased from 0.3 for more glow
      })
  
      torusKnot = new THREE.Mesh(geometry, material)
      scene.add(torusKnot)
  
      // Add a second, smaller torus knot with a different color for visual interest
      const geometry2 = new THREE.TorusKnotGeometry(5, 1.5, 150, 24)
      const material2 = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        metalness: 0.7,
        roughness: 0.3,
        emissive: 0x006666,
        emissiveIntensity: 0.5,
      })
  
      secondTorusKnot = new THREE.Mesh(geometry2, material2)
      scene.add(secondTorusKnot)
    }
  
    // Animation loop
    function animate() {
      requestAnimationFrame(animate)
  
      // Get elapsed time for smooth animations
      const time = Date.now() * 0.001
  
      // Rotate main object with more complex movement
      if (torusKnot) {
        // Base rotation
        torusKnot.rotation.x += 0.003
        torusKnot.rotation.y += 0.004
  
        // Add breathing effect (subtle scaling)
        const breathScale = 1 + Math.sin(time * 0.5) * 0.05
        torusKnot.scale.set(breathScale, breathScale, breathScale)
  
        // Add more responsive mouse movement - increased multiplier from 0.002 to 0.005
        torusKnot.rotation.x += mouseY * 0.005
        torusKnot.rotation.y += mouseX * 0.005
  
        // Slightly move position based on mouse
        torusKnot.position.x = mouseX * 3
        torusKnot.position.y = mouseY * 3
      }
  
      // Animate the second torus knot in a complementary way
      if (secondTorusKnot) {
        // Rotate in opposite direction
        secondTorusKnot.rotation.x -= 0.004
        secondTorusKnot.rotation.y -= 0.003
  
        // Out of phase breathing effect
        const breathScale = 1 + Math.sin(time * 0.5 + Math.PI) * 0.05
        secondTorusKnot.scale.set(breathScale, breathScale, breathScale)
  
        // Move in opposite direction to main torus
        secondTorusKnot.position.x = -mouseX * 2
        secondTorusKnot.position.y = -mouseY * 2
      }
  
      // Pulse the emissive intensity for a glowing effect
      if (torusKnot && torusKnot.material) {
        torusKnot.material.emissiveIntensity = 0.6 + Math.sin(time * 2) * 0.3
      }
  
      if (secondTorusKnot && secondTorusKnot.material) {
        secondTorusKnot.material.emissiveIntensity = 0.5 + Math.sin(time * 2 + Math.PI) * 0.3
      }
  
      // Slowly rotate camera based on mouse with increased responsiveness
      camera.position.x += (mouseX * 8 - camera.position.x) * 0.02 // Increased from 5 to 8 and 0.01 to 0.02
      camera.position.y += (mouseY * 8 - camera.position.y) * 0.02
      camera.lookAt(scene.position)
  
      renderer.render(scene, camera)
    }
  
    // Simulate loading progress
    function simulateLoading() {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 10
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
  
          // Enable start button
          startButton.classList.add("active")
          isLoading = false
        }
        loadingProgress.style.width = `${progress}%`
      }, 200)
    }
  
    // Handle page navigation
    function navigateTo(pageName) {
      // Update current page
      currentPage = pageName
  
      // Update navigation
      navLinks.forEach((link) => {
        if (link.dataset.page === pageName) {
          link.classList.add("active")
        } else {
          link.classList.remove("active")
        }
      })
  
      // Update page visibility with animation
      pages.forEach((page) => {
        if (page.id === pageName) {
          // Animate page in
          page.style.display = "flex"
          page.style.opacity = "0"
          page.style.transform = "translateY(20px)"
  
          setTimeout(() => {
            page.style.opacity = "1"
            page.style.transform = "translateY(0)"
            page.style.transition = "opacity 0.8s, transform 0.8s"
          }, 10)
        } else {
          // Animate page out
          page.style.opacity = "0"
          page.style.transform = "translateY(-20px)"
          page.style.transition = "opacity 0.5s, transform 0.5s"
  
          setTimeout(() => {
            page.style.display = "none"
          }, 500)
        }
      })
    }
  
    
    // Show project modal
    function showProjectModal(index) {
        const projects = [
            {
                title: 'Website Nature Photography',
                image: 'naturewebsite.png',
                description: 'A minimalist Portfolio website for Photographers',
                role: 'Developer',
                year: '2025',
                technologies: 'HTML, CSS, JavaScript',
                url: 'https://genesisreyes18.github.io/Website-NaturePhotography/'
            },
            {
                title: 'Catculus Crisis',
                image: 'catculus.png',
                description: 'Interactive Comic Storytelling - Group Project',
                role: 'Scene making and Wireframe',
                year: '2025',
                technologies: 'HTML, CSS, JavaScript',
                url: 'https://ariannevt.github.io/Cactulus-Crisis/'
            },
            {
                title: 'Echoes of a day',
                image: 'echoes.png',
                description: 'Experimenting Storytelling with Sounds',
                role: 'Sound Editor',
                year: '2025',
                technologies: 'HTML, CSS, JavaScript',
                url: 'https://alinoorisnerd.github.io/commlab_assign3/'
            },
            {
                title: 'The Hunger Games',
                image: 'hungergames.png',
                description: 'Audiovisual Storytelling Website',
                role: 'Developer',
                year: '2025',
                technologies: 'HTML, CSS, JavaScript',
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
        
        // Create a special effect when opening the modal
        createRippleEffect();
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
    }
    
    // Start the application
    init();
});