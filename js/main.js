/**
 * Modern Portfolio 2025 - Enhanced JavaScript
 * 
 * This file contains all the interactive functionality for the portfolio website
 * including animations, theme toggling, navigation, particle effects,
 * custom cursor, 3D elements, and more modern interactive features.
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animation library with enhanced settings
    AOS.init({
        duration: 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        once: false,
        offset: 50,
        delay: 100,
        mirror: true
    });
    
    // Preloader with enhanced animation
    setTimeout(function() {
        const preloader = document.querySelector('.preloader');
        preloader.style.opacity = '0';
        setTimeout(function() {
            preloader.style.display = 'none';
        }, 500);
    }, 1000);
    
    // Variables
    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.querySelector('.theme-toggle');
    const backToTop = document.querySelector('.back-to-top');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const portfolioLinks = document.querySelectorAll('.portfolio-link[data-project]');
    const projectModal = document.getElementById('projectModal');
    const modalClose = document.querySelector('.modal-close');
    const modalBody = document.querySelector('.modal-body');
    const contactForm = document.getElementById('contactForm');
    const scrollProgressBar = document.querySelector('.scroll-progress-bar');
    const customCursor = document.querySelector('.custom-cursor');
    const heroTitle = document.querySelector('.hero-title');
    const skillProgressBars = document.querySelectorAll('.skill-progress-bar');
    
    // Initialize Three.js for particles
    initParticles();
    
    // Initialize 3D floating cube
    initFloatingCube();
    
    // Custom cursor
    if (customCursor && window.innerWidth > 768) {
        document.addEventListener('mousemove', updateCustomCursor);
        document.addEventListener('mousedown', () => customCursor.classList.add('active'));
        document.addEventListener('mouseup', () => customCursor.classList.remove('active'));
        
        // Add hover effect to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn, .portfolio-card, .nav-toggle, .theme-toggle');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => customCursor.classList.add('hover'));
            element.addEventListener('mouseleave', () => customCursor.classList.remove('hover'));
        });
    }
    
    // Text animation for hero title
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.innerHTML = '';
        
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i];
            span.style.animationDelay = `${i * 0.05}s`;
            span.classList.add('animate-letter');
            heroTitle.appendChild(span);
        }
    }
    
    // Scroll progress bar
    window.addEventListener('scroll', function() {
        updateScrollProgress();
        
        // Header scroll effect
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Back to top button visibility
        if (window.scrollY > 500) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
        
        // Active nav link based on scroll position
        updateActiveNavLink();
    });
    
    // Mobile Navigation Toggle
    navToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Theme Toggle with enhanced animation
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        // Save theme preference to localStorage
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    } else if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
    }
    // If no saved preference, use system preference
    else {
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        if (prefersDarkScheme.matches) {
            document.body.classList.add('dark-theme');
        }
    }
    
    // Portfolio Filtering with enhanced animations
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter portfolio items with staggered animations
            portfolioItems.forEach((item, index) => {
                const categories = item.getAttribute('data-category').split(' ');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    setTimeout(() => {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1) translateY(0)';
                        }, 50);
                    }, index * 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8) translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Project Modal with enhanced animations
    portfolioLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const projectId = this.getAttribute('data-project');
            
            // Get project data
            const projectData = getProjectData(projectId);
            
            // Populate modal with project data
            modalBody.innerHTML = `
                <div class="modal-project">
                    <h2 class="modal-project-title">${projectData.title}</h2>
                    <div class="modal-project-img">
                        <img src="${projectData.image}" alt="${projectData.title}">
                    </div>
                    <div class="modal-project-info">
                        <div class="modal-project-tags">
                            ${projectData.tags.map(tag => `<span class="portfolio-tag">${tag}</span>`).join('')}
                        </div>
                        <div class="modal-project-description">
                            ${projectData.description}
                        </div>
                        <div class="modal-project-features">
                            <h3>Key Features</h3>
                            <ul>
                                ${projectData.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="modal-project-links">
                            <a href="${projectData.github}" class="btn btn-primary" target="_blank">
                                <i class="fab fa-github"></i>
                                <span>View on GitHub</span>
                            </a>
                            ${projectData.demo ? `
                                <a href="${projectData.demo}" class="btn btn-outline" target="_blank">
                                    <i class="fas fa-external-link-alt"></i>
                                    <span>Live Demo</span>
                                </a>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
            
            // Show modal with animation
            projectModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal
    modalClose.addEventListener('click', function() {
        projectModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Close modal when clicking outside
    projectModal.addEventListener('click', function(e) {
        if (e.target === this) {
            projectModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && projectModal.classList.contains('active')) {
            projectModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Contact Form Submission with enhanced validation and feedback
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formValues = Object.fromEntries(formData.entries());
            
            // Validate form (enhanced validation)
            let isValid = true;
            const requiredFields = ['name', 'email', 'subject', 'message'];
            
            requiredFields.forEach(field => {
                const input = document.getElementById(field);
                if (!formValues[field].trim()) {
                    isValid = false;
                    input.classList.add('error');
                    
                    // Add shake animation
                    input.classList.add('shake');
                    setTimeout(() => {
                        input.classList.remove('shake');
                    }, 500);
                } else {
                    input.classList.remove('error');
                }
            });
            
            // Email validation
            if (formValues.email && !validateEmail(formValues.email)) {
                isValid = false;
                const emailInput = document.getElementById('email');
                emailInput.classList.add('error');
                
                // Add shake animation
                emailInput.classList.add('shake');
                setTimeout(() => {
                    emailInput.classList.remove('shake');
                }, 500);
                
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            if (!isValid) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // In a real project, you would send this data to a server
            // For demo purposes, we'll just show a success message
            showNotification('Your message has been sent successfully!', 'success');
            
            // Reset form
            this.reset();
        });
        
        // Real-time validation feedback
        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('blur', function() {
                if (this.id === 'email' && this.value && !validateEmail(this.value)) {
                    this.classList.add('error');
                } else if (!this.value.trim() && this.hasAttribute('required')) {
                    this.classList.add('error');
                } else {
                    this.classList.remove('error');
                }
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    if (this.id === 'email') {
                        if (validateEmail(this.value)) {
                            this.classList.remove('error');
                        }
                    } else if (this.value.trim()) {
                        this.classList.remove('error');
                    }
                }
            });
        });
    }
    
    // Back to Top button with enhanced animation
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Skill animation on scroll with enhanced progress bars
    const skillSections = document.querySelectorAll('.skill-category');
    
    const observerOptions = {
        threshold: 0.2
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Animate progress bars
                const progressBars = entry.target.querySelectorAll('.skill-progress-bar');
                progressBars.forEach((bar, index) => {
                    setTimeout(() => {
                        const progress = bar.getAttribute('data-progress');
                        bar.style.setProperty('--progress', `${progress}%`);
                        bar.classList.add('animated');
                    }, index * 100);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    skillSections.forEach(section => {
        observer.observe(section);
    });
    
    // Initialize skill progress bars
    skillProgressBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        bar.style.setProperty('--progress', '0%');
        bar.setAttribute('aria-valuenow', progress);
        bar.setAttribute('aria-valuemin', '0');
        bar.setAttribute('aria-valuemax', '100');
    });
    
    // Initialize scroll progress
    updateScrollProgress();
});

// Helper Functions

// Update custom cursor position
function updateCustomCursor(e) {
    const customCursor = document.querySelector('.custom-cursor');
    if (customCursor) {
        customCursor.style.left = `${e.clientX}px`;
        customCursor.style.top = `${e.clientY}px`;
    }
}

// Update scroll progress bar
function updateScrollProgress() {
    const scrollProgressBar = document.querySelector('.scroll-progress-bar');
    if (scrollProgressBar) {
        const scrollPosition = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (scrollPosition / scrollHeight) * 100;
        scrollProgressBar.style.width = `${scrollPercentage}%`;
    }
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const scrollPosition = window.scrollY;
    const navLinks = document.querySelectorAll('.nav-link');
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Initialize particle background using Three.js
function initParticles() {
    const particleContainer = document.querySelector('.particles');
    if (!particleContainer) return;
    
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    particleContainer.appendChild(renderer.domElement);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = window.innerWidth < 768 ? 1000 : 2000;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Create material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: document.body.classList.contains('dark-theme') ? 0x3b82f6 : 0x3b82f6,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    // Create mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Position camera
    camera.position.z = 2;
    
    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    
    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - window.innerWidth / 2) / 100;
        mouseY = (event.clientY - window.innerHeight / 2) / 100;
    }
    
    document.addEventListener('mousemove', onDocumentMouseMove);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        particlesMesh.rotation.x += 0.0003;
        particlesMesh.rotation.y += 0.0003;
        
        // Mouse interaction
        particlesMesh.rotation.x += mouseY * 0.0003;
        particlesMesh.rotation.y += mouseX * 0.0003;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Update particle color when theme changes
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            particlesMaterial.color.set(
                document.body.classList.contains('dark-theme') ? 0x3b82f6 : 0x3b82f6
            );
        });
    }
}

// Initialize 3D floating cube
function initFloatingCube() {
    const floatingCube = document.querySelector('.floating-cube');
    if (!floatingCube) return;
    
    // Add mouse interaction to the cube
    document.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
        const mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
        
        floatingCube.style.transform = `rotateX(${10 + mouseY}deg) rotateY(${30 + mouseX}deg) translateY(0)`;
    });
}

// Show notification with enhanced animations
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Email validation
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Get project data (mock data for demo purposes)
function getProjectData(projectId) {
    const projects = {
        'project1': {
            title: 'PayNext Payment System',
            image: 'assets/projects/paynext.jpg',
            tags: ['Java', 'Docker', 'Kubernetes', 'AWS', 'Terraform'],
            description: `
                <p>PayNext is a cloud-native, scalable, and automated FinTech payment platform designed to handle high-volume transactions with robust security measures. The system leverages containerization and orchestration technologies to ensure high availability and fault tolerance.</p>
                <p>The architecture follows microservices principles, with separate services for authentication, transaction processing, fraud detection, and reporting. Each service is independently deployable and scalable, communicating through RESTful APIs and message queues.</p>
            `,
            features: [
                'Secure payment processing with end-to-end encryption',
                'Real-time transaction monitoring and fraud detection',
                'Auto-scaling infrastructure based on transaction volume',
                'Multi-region deployment for disaster recovery',
                'Comprehensive audit logging and compliance reporting'
            ],
            github: 'https://github.com/abrar2030/PayNext',
            demo: null
        },
        'project2': {
            title: 'FinovaBank Platform',
            image: 'assets/projects/finovabank.jpg',
            tags: ['Java', 'JavaScript', 'GitHub Actions', 'Terraform', 'Ansible'],
            description: `
                <p>FinovaBank is a secure and scalable digital banking platform designed for modern financial services. It provides a comprehensive suite of banking functionalities including account management, fund transfers, bill payments, and financial analytics.</p>
                <p>The platform implements a layered security architecture with multi-factor authentication, transaction monitoring, and anomaly detection. The infrastructure is deployed using Infrastructure as Code (IaC) principles with Terraform and configured using Ansible for consistent environments.</p>
            `,
            features: [
                'Secure user authentication with biometric options',
                'Real-time transaction processing and notifications',
                'Automated CI/CD pipeline with security scanning',
                'Comprehensive financial analytics dashboard',
                'Integration with third-party payment processors'
            ],
            github: 'https://github.com/abrar2030/FinovaBank',
            demo: null
        },
        'project3': {
            title: 'BlockGuardian Fraud Detection',
            image: 'assets/projects/blockguardian.jpg',
            tags: ['Solidity', 'React.js', 'TensorFlow', 'FastAPI', 'PostgreSQL'],
            description: `
                <p>BlockGuardian is a blockchain-based fraud detection system for DeFi transactions using smart contracts. It leverages machine learning algorithms to identify suspicious patterns and anomalies in transaction data, providing real-time alerts and preventive measures.</p>
                <p>The system combines on-chain and off-chain data analysis to create a comprehensive view of transaction patterns. Smart contracts implement automated risk scoring and transaction verification, while the machine learning models continuously improve through feedback loops.</p>
            `,
            features: [
                'Real-time transaction monitoring and risk assessment',
                'Machine learning models for anomaly detection',
                'Smart contract-based transaction verification',
                'Decentralized alert system for suspicious activities',
                'Comprehensive dashboard for security analytics'
            ],
            github: 'https://github.com/abrar2030/BlockGuardian',
            demo: null
        },
        'project4': {
            title: 'BlockScore Credit Scoring',
            image: 'assets/projects/blockscore.jpg',
            tags: ['Solidity', 'Node.js', 'XGBoost', 'React.js', 'MongoDB'],
            description: `
                <p>BlockScore is an AI-driven credit scoring platform that analyzes on-chain financial behavior to provide decentralized credit scores. It uses machine learning algorithms to evaluate transaction patterns, DeFi interactions, and wallet history to generate comprehensive credit profiles.</p>
                <p>The platform enables users to build credit history through their blockchain activities, opening up DeFi lending opportunities for those without traditional credit access. Smart contracts ensure data privacy and user consent throughout the scoring process.</p>
            `,
            features: [
                'On-chain data analysis for credit scoring',
                'Machine learning models for risk assessment',
                'Privacy-preserving data processing',
                'Decentralized identity verification',
                'Integration with DeFi lending protocols'
            ],
            github: 'https://github.com/abrar2030/BlockScore',
            demo: null
        },
        'project5': {
            title: 'CarbonXchange Marketplace',
            image: 'assets/projects/carbonxchange.jpg',
            tags: ['Solidity', 'Flask', 'LSTM', 'PostgreSQL', 'Web3.js'],
            description: `
                <p>CarbonXchange is a blockchain-based carbon credit trading platform that enables fractional ownership of carbon credits. It provides a transparent and efficient marketplace for individuals and organizations to offset their carbon footprint through verified carbon reduction projects.</p>
                <p>The platform uses smart contracts to tokenize carbon credits, ensuring their authenticity and preventing double-counting. An integrated analytics dashboard helps users track their environmental impact and carbon offset history.</p>
            `,
            features: [
                'Tokenized carbon credits with fractional ownership',
                'Transparent verification of carbon reduction projects',
                'Automated carbon credit retirement process',
                'Real-time carbon credit pricing using market data',
                'Environmental impact analytics dashboard'
            ],
            github: 'https://github.com/abrar2030/CarbonXchange',
            demo: null
        },
        'project6': {
            title: 'LendSmart Micro Lending',
            image: 'assets/projects/lendsmart.jpg',
            tags: ['Solidity', 'Flask', 'MongoDB'],
            description: `
                <p>LendSmart is a decentralized micro-lending protocol designed for emerging markets. It enables peer-to-peer lending without traditional intermediaries, reducing costs and increasing access to financial services for underbanked populations.</p>
                <p>The platform implements risk assessment algorithms and collateral management systems to ensure loan security while maintaining accessibility. Smart contracts automate loan disbursement, repayment tracking, and collateral management.</p>
            `,
            features: [
                'Peer-to-peer micro-lending without intermediaries',
                'Automated collateral management system',
                'Flexible loan terms and repayment options',
                'Risk assessment for borrowers without credit history',
                'Integration with local payment systems'
            ],
            github: 'https://github.com/abrar2030/LendSmart',
            demo: null
        }
    };
    
    return projects[projectId];
}

// Add CSS animation classes
document.addEventListener('DOMContentLoaded', function() {
    // Add shake animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .shake {
            animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        
        @keyframes letterFadeIn {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-letter {
            display: inline-block;
            opacity: 0;
            animation: letterFadeIn 0.5s forwards;
        }
        
        .skill-progress-bar.animated::after {
            width: var(--progress);
        }
    `;
    document.head.appendChild(style);
    
    // Initialize skill progress bars
    document.querySelectorAll('.skill-progress-bar').forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        bar.style.setProperty('--progress', `${progress}%`);
    });
});
