
// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize variables
    let currentPage = 'home';
    let isLoading = true;
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    let clickedObjects = [];
    let composer, bloomPass, unrealBloomPass;
    
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
    let scene, camera, renderer, objects = [];
    let clock = new THREE.Clock();
    
    // Initialize Three.js Scene
    function initThreeJS() {
        // Create scene
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.001);
        
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
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        renderer.outputEncoding = THREE.sRGBEncoding;
        
        // Setup post-processing
        setupPostProcessing();
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x111111, 1);
        scene.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // Add point lights for glow effect
        addPointLights();
        
        // Create 3D objects
        createObjects();
        
        // Start animation loop
        animate();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            composer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
            
            // Update mouse position for raycaster
            mouse.x = mouseX;
            mouse.y = mouseY;
        });
        
        // Handle clicks
        document.addEventListener('click', onDocumentClick);
    }
    
    // Setup post-processing for bloom effects
    function setupPostProcessing() {
        composer = new THREE.EffectComposer(renderer);
        
        const renderPass = new THREE.RenderPass(scene, camera);
        composer.addPass(renderPass);
        
        // Add bloom pass for glow effect
        unrealBloomPass = new THREE.UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            2,    // strength
            0.9,    // radius
            0.85    // threshold
        );
        composer.addPass(unrealBloomPass);
    }
    
    // Add point lights for glow effect
    function addPointLights() {
        const colors = [0x9900ff, 0xff00ff, 0x00ffff, 0x3644ff];
        
        for (let i = 0; i < 4; i++) {
            const light = new THREE.PointLight(colors[i], 1, 0);
            light.position.set(
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 40
            );
            scene.add(light);
            
            // Animate the lights
            gsap.to(light.position, {
                x: (Math.random() - 0.5) * 40,
                y: (Math.random() - 0.5) * 40,
                z: (Math.random() - 0.5) * 40,
                duration: 20,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
    }
    
    // Create various 3D objects
    function createObjects() {
        // Clear any existing objects
        objects.forEach(obj => scene.remove(obj));
        objects = [];
        
        // Define materials with metallic and glowy properties
        const materials = [
            // Metallic purple material
            new THREE.MeshStandardMaterial({ 
                color: 0x9900ff,
                roughness: 0.2,
                metalness: 0.9,
                emissive: 0x330066,
                emissiveIntensity: 0.2
            }),
            // Metallic blue material
            new THREE.MeshStandardMaterial({ 
                color: 0x3644ff,
                roughness: 0.3,
                metalness: 0.8,
                emissive: 0x0000ff,
                emissiveIntensity: 0.1
            }),
            // Glowy purple material
            new THREE.MeshPhysicalMaterial({
                color: 0xff00ff,
                transmission: 0.9,
                roughness: 0.1,
                metalness: 0.2,
                clearcoat: 1,
                clearcoatRoughness: 0.1,
                emissive: 0xff00ff,
                emissiveIntensity: 0.5
            }),
            // Glowy cyan material
            new THREE.MeshPhysicalMaterial({
                color: 0x00ffff,
                transmission: 0.8,
                roughness: 0.1,
                metalness: 0.3,
                clearcoat: 1,
                clearcoatRoughness: 0.1,
                emissive: 0x00ffff,
                emissiveIntensity: 0.5
            })
        ];
        
        // Load texture for more complex materials
        const textureLoader = new THREE.TextureLoader();
        const normalMap = textureLoader.load('https://threejs.org/examples/textures/waternormals.jpg');
        normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
        
        // Create more complex material with normal map
        const complexMaterial = new THREE.MeshStandardMaterial({
            color: 0x9900ff,
            roughness: 0.2,
            metalness: 0.9,
            normalMap: normalMap,
            normalScale: new THREE.Vector2(0.5, 0.5),
            emissive: 0x330066,
            emissiveIntensity: 0.2
        });
        
        materials.push(complexMaterial);
        
        // Create torus knots - more complex with more segments
        for (let i = 0; i < 3; i++) {
            const geometry = new THREE.TorusKnotGeometry(
                Math.random() * 2 + 1.5, // radius
                Math.random() * 0.4 + 0.2, // tube
                128, // tubularSegments - increased for more detail
                16 // radialSegments - increased for more detail
            );
            const material = materials[Math.floor(Math.random() * materials.length)];
            const torusKnot = new THREE.Mesh(geometry, material);
            
            // Position randomly in 3D space
            torusKnot.position.x = (Math.random() - 0.5) * 40;
            torusKnot.position.y = (Math.random() - 0.5) * 40;
            torusKnot.position.z = (Math.random() - 0.5) * 20 - 10;
            
            // Make objects interactive
            torusKnot.userData = { 
                clickable: true,
                originalScale: new THREE.Vector3(1, 1, 1),
                originalColor: material.color.clone(),
                type: 'torusKnot'
            };
            
            // Add to scene and objects array
            scene.add(torusKnot);
            objects.push(torusKnot);
        }
        
        // Create icosahedrons (20-sided polyhedron) - more complex than octahedrons
        for (let i = 0; i < 5; i++) {
            const geometry = new THREE.IcosahedronGeometry(Math.random() * 1.5 + 0.8, 1); // Added subdivision
            const material = materials[Math.floor(Math.random() * materials.length)];
            const icosahedron = new THREE.Mesh(geometry, material);
            
            // Position randomly in 3D space
            icosahedron.position.x = (Math.random() - 0.5) * 50;
            icosahedron.position.y = (Math.random() - 0.5) * 50;
            icosahedron.position.z = (Math.random() - 0.5) * 20 - 10;
            
            // Make objects interactive
            icosahedron.userData = { 
                clickable: true,
                originalScale: new THREE.Vector3(1, 1, 1),
                originalColor: material.color.clone(),
                type: 'icosahedron'
            };
            
            // Add to scene and objects array
            scene.add(icosahedron);
            objects.push(icosahedron);
        }
        
        // Create custom geometry - more complex shape
        for (let i = 0; i < 3; i++) {
            const geometry = new THREE.BufferGeometry();
            const vertices = [];
            const size = Math.random() * 2 + 1;
            
            // Create a more complex shape with vertices
            for (let j = 0; j < 100; j++) {
                const theta = THREE.MathUtils.randFloatSpread(360) * Math.PI / 180;
                const phi = THREE.MathUtils.randFloatSpread(360) * Math.PI / 180;
                
                const x = size * Math.sin(theta) * Math.cos(phi);
                const y = size * Math.sin(theta) * Math.sin(phi);
                const z = size * Math.cos(theta);
                
                vertices.push(x, y, z);
            }
            
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            
            // Create a custom shader material for more advanced effects
            const customMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0xff00ff) }
                },
                vertexShader: `
                    uniform float time;
                    void main() {
                        vec3 newPosition = position;
                        newPosition.x += sin(position.z * 10.0 + time) * 0.1;
                        newPosition.y += cos(position.x * 10.0 + time) * 0.1;
                        newPosition.z += sin(position.y * 10.0 + time) * 0.1;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                        gl_PointSize = 3.0;
                    }
                `,
                fragmentShader: `
                    uniform vec3 color;
                    void main() {
                        gl_FragColor = vec4(color, 1.0);
                    }
                `
            });
            
            const points = new THREE.Points(geometry, customMaterial);
            
            // Position randomly in 3D space
            points.position.x = (Math.random() - 0.5) * 50;
            points.position.y = (Math.random() - 0.5) * 50;
            points.position.z = (Math.random() - 0.5) * 20 - 10;
            
            // Make objects interactive
            points.userData = { 
                clickable: true,
                originalScale: new THREE.Vector3(1, 1, 1),
                originalColor: new THREE.Color(0xff00ff),
                type: 'points',
                material: customMaterial
            };
            
            // Add to scene and objects array
            scene.add(points);
            objects.push(points);
        }
        
        // Add some spheres with glass-like material
        for (let i = 0; i < 6; i++) {
            const geometry = new THREE.SphereGeometry(Math.random() * 0.8 + 0.4, 32, 32);
            const material = new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                transmission: 0.95,
                roughness: 0.05,
                metalness: 0.1,
                clearcoat: 1,
                clearcoatRoughness: 0.1,
                ior: 2.33,
                reflectivity: 0.5,
                iridescence: 1,
                iridescenceIOR: 1.3,
                thickness: 5
            });
            const sphere = new THREE.Mesh(geometry, material);
            
            // Position randomly in 3D space
            sphere.position.x = (Math.random() - 0.5) * 50;
            sphere.position.y = (Math.random() - 0.5) * 50;
            sphere.position.z = (Math.random() - 0.5) * 20 - 10;
            
            // Make objects interactive
            sphere.userData = { 
                clickable: true,
                originalScale: new THREE.Vector3(1, 1, 1),
                originalColor: material.color.clone(),
                type: 'sphere'
            };
            
            // Add to scene and objects array
            scene.add(sphere);
            objects.push(sphere);
        }
        
        // Create a particle system for background atmosphere
        const particleCount = 1000;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        const color1 = new THREE.Color(0x9900ff);
        const color2 = new THREE.Color(0x00ffff);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
            
            // Interpolate between two colors
            const mixedColor = color1.clone().lerp(color2, Math.random());
            colors[i * 3] = mixedColor.r;
            colors[i * 3 + 1] = mixedColor.g;
            colors[i * 3 + 2] = mixedColor.b;
            
            sizes[i] = Math.random() * 2;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            transparent: true,
            opacity: 0.8,
            vertexColors: true,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);
        objects.push(particles);
    }
    
    // Handle document click
    function onDocumentClick(event) {
        // Calculate mouse position in normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);
        
        // Calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(objects);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            
            // Check if object is clickable
            if (object.userData && object.userData.clickable) {
                // Add to clicked objects array if not already there
                if (!clickedObjects.includes(object)) {
                    clickedObjects.push(object);
                    
                    // Create explosion effect
                    createExplosion(object.position.clone());
                    
                    // Animate the object
                    animateClickedObject(object);
                }
            }
        }
    }
    
    // Create explosion effect at position
    function createExplosion(position) {
        const particleCount = 100;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        const color = new THREE.Color(0xff00ff);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = position.x;
            positions[i * 3 + 1] = position.y;
            positions[i * 3 + 2] = position.z;
            
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.2,
            transparent: true,
            opacity: 1,
            vertexColors: true,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        scene.add(particles);
        
        // Animate explosion
        const positionArray = particles.geometry.attributes.position.array;
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const x = positionArray[i3];
            const y = positionArray[i3 + 1];
            const z = positionArray[i3 + 2];
            
            gsap.to(positionArray, {
                [i3]: x + (Math.random() - 0.5) * 10,
                [i3 + 1]: y + (Math.random() - 0.5) * 10,
                [i3 + 2]: z + (Math.random() - 0.5) * 10,
                duration: 2,
                ease: "power2.out",
                onUpdate: () => {
                    particles.geometry.attributes.position.needsUpdate = true;
                }
            });
        }
        
        // Fade out and remove
        gsap.to(material, {
            opacity: 0,
            duration: 2,
            ease: "power2.in",
            onComplete: () => {
                scene.remove(particles);
            }
        });
    }
    
    // Animate clicked object
    function animateClickedObject(object) {
        // Different animations based on object type
        if (object.userData.type === 'torusKnot') {
            // Scale up and change color
            gsap.to(object.scale, {
                x: 1.5,
                y: 1.5,
                z: 1.5,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)",
                yoyo: true,
                repeat: 1
            });
            
            // Change color
            if (object.material.color) {
                gsap.to(object.material.color, {
                    r: 1,
                    g: 0,
                    b: 1,
                    duration: 0.5,
                    yoyo: true,
                    repeat: 1,
                    onComplete: () => {
                        object.material.color.copy(object.userData.originalColor);
                    }
                });
            }
            
            // Increase emissive intensity
            if (object.material.emissiveIntensity !== undefined) {
                gsap.to(object.material, {
                    emissiveIntensity: 1,
                    duration: 0.5,
                    yoyo: true,
                    repeat: 1
                });
            }
        } 
        else if (object.userData.type === 'icosahedron') {
            // Rotate rapidly
            gsap.to(object.rotation, {
                x: object.rotation.x + Math.PI * 2,
                y: object.rotation.y + Math.PI * 2,
                duration: 1,
                ease: "power2.inOut"
            });
            
            // Pulse scale
            gsap.to(object.scale, {
                x: 1.3,
                y: 1.3,
                z: 1.3,
                duration: 0.3,
                yoyo: true,
                repeat: 3,
                ease: "sine.inOut"
            });
            
            // Change material properties
            if (object.material.metalness !== undefined) {
                gsap.to(object.material, {
                    metalness: 1,
                    roughness: 0,
                    duration: 0.5,
                    yoyo: true,
                    repeat: 1
                });
            }
        }
        else if (object.userData.type === 'points') {
            // Explode points outward
            gsap.to(object.scale, {
                x: 2,
                y: 2,
                z: 2,
                duration: 0.5,
                yoyo: true,
                repeat: 1,
                ease: "power2.out"
            });
            
            // Change color in shader
            if (object.userData.material && object.userData.material.uniforms.color) {
                gsap.to(object.userData.material.uniforms.color.value, {
                    r: 0,
                    g: 1,
                    b: 1,
                    duration: 0.5,
                    yoyo: true,
                    repeat: 1,
                    onComplete: () => {
                        object.userData.material.uniforms.color.value.copy(object.userData.originalColor);
                    }
                });
            }
        }
        else if (object.userData.type === 'sphere') {
            // Make it bounce
            gsap.to(object.position, {
                y: object.position.y + 5,
                duration: 0.5,
                ease: "power2.out",
                yoyo: true,
                repeat: 1
            });
            
            // Change transmission and ior for glass effect
            if (object.material.transmission !== undefined) {
                gsap.to(object.material, {
                    transmission: 0.5,
                    ior: 3,
                    duration: 0.5,
                    yoyo: true,
                    repeat: 1
                });
            }
        }
    }
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();
        
        // Smooth mouse tracking
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;
        
        // Update shader uniforms
        objects.forEach(obj => {
            if (obj.userData && obj.userData.material && obj.userData.material.uniforms) {
                if (obj.userData.material.uniforms.time) {
                    obj.userData.material.uniforms.time.value = elapsedTime;
                }
            }
        });
        
        // Rotate and animate all objects
        objects.forEach((obj, index) => {
            // Different rotation speeds for variety
            if (obj.rotation) {
                obj.rotation.x += delta * (0.2 + index * 0.01);
                obj.rotation.y += delta * (0.3 + index * 0.01);
                
                // Add subtle movement based on mouse position
                obj.rotation.x += targetY * 0.001;
                obj.rotation.y += targetX * 0.001;
            }
            
            // Add some floating motion
            if (obj instanceof THREE.Mesh) {
                obj.position.y += Math.sin(elapsedTime * 0.5 + index) * 0.01;
                obj.position.x += Math.cos(elapsedTime * 0.3 + index) * 0.01;
            }
        });
        
        // Slowly rotate camera based on mouse
        camera.position.x += (targetX * 5 - camera.position.x) * 0.01;
        camera.position.y += (targetY * 5 - camera.position.y) * 0.01;
        camera.lookAt(scene.position);
        
        // Pulse the bloom effect
        if (unrealBloomPass) {
            unrealBloomPass.strength = 1.5 + Math.sin(elapsedTime) * 0.5;
        }
        
        // Render scene with post-processing
        composer.render();
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
        
        // Create a ripple effect in the 3D scene when changing pages
        createRippleEffect();
    }
    
    // Create ripple effect in 3D scene
    function createRippleEffect() {
        const geometry = new THREE.RingGeometry(0.1, 0.5, 32);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xff00ff,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide
        });
        
        const ring = new THREE.Mesh(geometry, material);
        ring.position.z = 10;
        ring.rotation.x = Math.PI / 2;
        scene.add(ring);
        
        // Animate the ring
        gsap.to(ring.scale, {
            x: 50,
            y: 50,
            z: 1,
            duration: 2,
            ease: "power2.out"
        });
        
        gsap.to(material, {
            opacity: 0,
            duration: 2,
            ease: "power2.out",
            onComplete: () => {
                scene.remove(ring);
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