// EmailJS Configuration
const EMAILJS_CONFIG = {
    serviceId: 'YOUR_SERVICE_ID',     // Replace with your EmailJS service ID
    templateId: 'YOUR_TEMPLATE_ID',   // Replace with your EmailJS template ID
    publicKey: 'YOUR_PUBLIC_KEY'      // Replace with your EmailJS public key
};

// Initialize EmailJS
function initEmailJS() {
    if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log('EmailJS initialized');
        return true;
    }
    console.log('EmailJS not configured or not loaded');
    return false;
}

// Send email notification
async function sendEmailNotification(email, timestamp) {
    if (!initEmailJS()) {
        console.log('EmailJS not available, skipping email notification');
        return false;
    }
    
    try {
        const templateParams = {
            user_email: email,
            signup_time: new Date(timestamp).toLocaleString(),
            source: 'Filmmaker Tools Waitlist',
            website_url: window.location.origin
        };
        
        console.log('Sending email notification...', templateParams);
        
        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams
        );
        
        console.log('Email sent successfully:', response);
        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
}

// Embedded data as fallback for CORS issues
const FALLBACK_PORTFOLIO_DATA = [
  {
    "title": "AI-Powered Visual Storytelling System",
    "description": "An intelligent system that combines computer vision and generative AI to create dynamic visual narratives. Merging filmmaking principles with AI to generate compelling visual stories... <a href=\"https://github.com/govinda-vurjana/Ai-Champ-Data-Drift#readme\" style=\"color: #4CAF50; text-decoration: underline;\">Read more</a>",
    "technologies": "Python, Computer Vision, Generative AI, Storytelling",
    "category": "AI Art & Film",
    "image": null,
    "url": "https://github.com/govinda-vurjana/Ai-Champ-Data-Drift",
    "github": "https://github.com/govinda-vurjana/Ai-Champ-Data-Drift",
    "date": "2025-11-05"
  },
  {
    "title": "Creative AI Reinforcement Learning",
    "description": "A framework for training AI agents to make creative decisions using reinforcement learning. Bridging technical AI capabilities with artistic expression and creative problem-solving... <a href=\"https://github.com/govinda-vurjana/AiChamp-RLTask#readme\" style=\"color: #4CAF50; text-decoration: underline;\">Read more</a>",
    "technologies": "Python, Reinforcement Learning, Creative AI, Anthropic Claude API",
    "category": "Creative AI Systems",
    "image": null,
    "url": "https://github.com/govinda-vurjana/AiChamp-RLTask",
    "github": "https://github.com/govinda-vurjana/AiChamp-RLTask",
    "date": "2025-11-04"
  },
  {
    "title": "Intelligent Trading Cinematography",
    "description": "An algorithmic trading system that visualizes market movements like a film director captures scenes. Using AI to process financial data with cinematic storytelling principles... <a href=\"https://github.com/govinda-vurjana/Algorithmic-Trading-based-on-RL-#readme\" style=\"color: #4CAF50; text-decoration: underline;\">Read more</a>",
    "technologies": "Python, pandas, numpy, TA-Lib, Visual Analytics",
    "category": "AI Finance + Visual",
    "image": null,
    "url": "https://github.com/govinda-vurjana/Algorithmic-Trading-based-on-RL-",
    "github": "https://github.com/govinda-vurjana/Algorithmic-Trading-based-on-RL-",
    "date": "2025-11-04"
  },
  {
    "title": "AI Game Director",
    "description": "A reinforcement learning project where AI learns to direct gameplay like a film director. The agent navigates complex scenarios using cinematic principles and intelligent decision-making... <a href=\"https://github.com/govinda-vurjana/ZombieGame#readme\" style=\"color: #4CAF50; text-decoration: underline;\">Read more</a>",
    "technologies": "Python, Deep Reinforcement Learning, Game AI, Cinematic AI, CUDA",
    "category": "AI Game Direction",
    "image": null,
    "url": "https://github.com/govinda-vurjana/ZombieGame",
    "github": "https://github.com/govinda-vurjana/ZombieGame",
    "date": "2025-10-31"
  },
  {
    "title": "Smart Creative Trading Platform",
    "description": "An advanced platform that combines AI trading algorithms with visual storytelling. Features creative data visualization and AI-powered market narrative generation... <a href=\"https://github.com/govinda-vurjana/smart-trade#readme\" style=\"color: #4CAF50; text-decoration: underline;\">Read more</a>",
    "technologies": "Python, PyTorch, Creative Visualization, LSTM, API Integration",
    "category": "Creative FinTech",
    "image": null,
    "url": "https://github.com/govinda-vurjana/smart-trade",
    "github": "https://github.com/govinda-vurjana/smart-trade",
    "date": "2025-10-31"
  },
  {
    "title": "AI Content Creator & Storyteller",
    "description": "An AI-powered content creation tool that generates engaging stories and posts with filmmaker's eye for narrative. Combines technical AI capabilities with creative storytelling... <a href=\"https://github.com/govinda-vurjana/Linky#readme\" style=\"color: #4CAF50; text-decoration: underline;\">Read more</a>",
    "technologies": "Python, OpenAI, Creative Writing AI, Content Strategy",
    "category": "AI Content Creation",
    "image": null,
    "url": "https://github.com/govinda-vurjana/Linky",
    "github": "https://github.com/govinda-vurjana/Linky",
    "date": "2025-10-29"
  },
  {
    "title": "Visual AI Trading Assistant",
    "description": "An automated trading system that uses computer vision and AI to interpret visual market data like a cinematographer reads scenes. Combines technical analysis with visual intelligence... <a href=\"https://github.com/govinda-vurjana/Tradie#readme\" style=\"color: #4CAF50; text-decoration: underline;\">Read more</a>",
    "technologies": "Python, Computer Vision, OCR, AI Vision, Creative Analytics",
    "category": "Visual AI Finance",
    "image": null,
    "url": "https://github.com/govinda-vurjana/Tradie",
    "github": "https://github.com/govinda-vurjana/Tradie",
    "date": "2025-10-29"
  },
  {
    "title": "Intelligent Creative Organizer",
    "description": "A smart browser extension that organizes creative assets using AI. Applies filmmaker's organizational principles to digital content management with intelligent categorization... <a href=\"https://github.com/govinda-vurjana/smart-download-organizer#readme\" style=\"color: #4CAF50; text-decoration: underline;\">Read more</a>",
    "technologies": "Chrome Extension, JavaScript, AI Classification, Creative Workflow",
    "category": "Creative Tools",
    "image": null,
    "url": "https://github.com/govinda-vurjana/smart-download-organizer",
    "github": "https://github.com/govinda-vurjana/smart-download-organizer",
    "date": "2025-08-01"
  }
];

const FALLBACK_BLOG_DATA = [
  {
    "date": "Oct 7,2025",
    "title": "The Creative Ingredients of LLMs",
    "url": "https://govinda-vurjana.medium.com/ingredients-of-llms-30b141a5fce0",
    "excerpt": "Exploring how LLMs can be the creative ingredients for building world-class AI art and intelligent systems."
  },
  {
    "date": "Sep 27, 2025",
    "title": "From Filmmaker to AI Engineer: My $700 Upwork Journey",
    "url": "https://medium.com/@govinda-vurjana/how-i-made-my-first-700-on-upwork-ad20de98f803",
    "excerpt": "How my filmmaking background gave me a unique edge in landing AI engineering clients and building creative technical solutions."
  }
];

const FALLBACK_FILMS_DATA = [
  {
    "title": "Your First Film/Ad Title",
    "description": "A compelling description of your film or advertisement. Explain the creative vision, story, and impact.",
    "videoUrl": "data/film1.mp4",
    "thumbnail": "data/film1-thumbnail.jpg",
    "tools": "Adobe Premiere Pro, DaVinci Resolve, After Effects",
    "technologies": "Color Grading, Motion Graphics, Sound Design",
    "date": "2025-01",
    "duration": "2:30",
    "category": "Advertisement"
  },
  {
    "title": "Your Second Film/Ad Title",
    "description": "Another creative project showcasing your filmmaking skills. Describe the concept and execution.",
    "videoUrl": "data/film2.mp4",
    "thumbnail": "data/film2-thumbnail.jpg",
    "tools": "Final Cut Pro, Adobe Audition, Cinema 4D",
    "technologies": "3D Animation, Visual Effects, Cinematography",
    "date": "2024-12",
    "duration": "1:45",
    "category": "Short Film"
  }
];

// Theme functionality
function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Set dark theme as default
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Update the theme toggle button based on the current theme
    const updateThemeToggle = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const sunIcon = document.querySelector('.sun-icon');
        const moonIcon = document.querySelector('.moon-icon');
        
        if (currentTheme === 'dark') {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    };

    // Function to update the theme
    const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeToggle();
    };

    // Add click event listener to the theme toggle button
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        
        // Add keyboard navigation support
        themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
            }
        });
    }

    // Initial update of the theme toggle
    updateThemeToggle();

    // Listen for changes in the color scheme preference
    prefersDarkScheme.addEventListener('change', (e) => {
        // Only apply system preference if user hasn't explicitly set a preference
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateThemeToggle();
        }
    });
}

// Test data loading with simple fetch
async function testDataAccess() {
    console.log('Testing data file access...');
    
    try {
        // Test blogs.json
        const blogResponse = await fetch('data/blogs.json');
        console.log('Blogs response status:', blogResponse.status);
        if (blogResponse.ok) {
            const blogData = await blogResponse.json();
            console.log('Blogs data:', blogData);
        }
        
        // Test portfolio.json
        const portfolioResponse = await fetch('data/portfolio.json');
        console.log('Portfolio response status:', portfolioResponse.status);
        if (portfolioResponse.ok) {
            const portfolioData = await portfolioResponse.json();
            console.log('Portfolio data length:', portfolioData.length);
        }
        
    } catch (error) {
        console.error('Data access test failed:', error);
    }
}

// Test email functionality (for debugging)
function testEmailSetup() {
    console.log('Testing email setup...');
    console.log('EmailJS Config:', EMAILJS_CONFIG);
    
    if (EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
        console.log('❌ EmailJS not configured yet. Please update EMAILJS_CONFIG in script.js');
        return false;
    }
    
    if (typeof emailjs === 'undefined') {
        console.log('❌ EmailJS library not loaded');
        return false;
    }
    
    console.log('✅ EmailJS setup looks good!');
    return true;
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Starting initialization');
    
    // Test data access first
    testDataAccess();
    
    // Check if key elements exist
    console.log('Theme toggle found:', !!document.querySelector('.theme-toggle'));
    console.log('Blog posts container found:', !!document.querySelector('.blog-posts'));
    console.log('Portfolio list found:', !!document.getElementById('portfolio-list'));
    
    // Initialize theme
    console.log('Initializing theme...');
    initTheme();
    
    // Initialize waitlist
    console.log('Initializing waitlist...');
    initWaitlist();
    
    // Load portfolio data
    console.log('Loading portfolio...');
    loadPortfolio();
    
    // Load blogs and resources data
    console.log('Loading blogs and resources...');
    loadBlogsAndResources();
    
    // Load films data
    console.log('Loading films...');
    loadFilms();
    
    // Initialize navigation and other UI functionality
    console.log('Initializing navigation...');
    initNavigation();
    
    // Initialize animations and effects
    console.log('Initializing animations...');
    initAnimations();
    
    // Initialize video handling
    console.log('Initializing video...');
    initVideoHandling();
    
    // Test email setup
    console.log('Testing email setup...');
    testEmailSetup();
    
    console.log('All initialization complete');
});

// Video handling for filmmaker tool
function initVideoHandling() {
    const toolVideo = document.querySelector('.tool-video');
    if (toolVideo) {
        console.log('Tool video found, setting up handlers');
        
        // Set video dimensions and attributes
        toolVideo.style.minHeight = '300px';
        toolVideo.style.objectFit = 'cover';
        
        // Handle video load events
        toolVideo.addEventListener('loadedmetadata', () => {
            console.log('Video metadata loaded');
            toolVideo.style.minHeight = 'auto';
        });
        
        toolVideo.addEventListener('error', (e) => {
            console.error('Video loading error:', e);
            // Create a fallback poster-like element
            const container = toolVideo.parentElement;
            container.innerHTML = `
                <div style="
                    width: 100%;
                    max-width: 800px;
                    height: 300px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    text-align: center;
                    border-radius: 8px;
                    margin: 0 auto;
                ">
                    <div style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">AI Tools for Filmmakers</div>
                    <div style="font-size: 3rem; margin: 1rem 0; opacity: 0.8;">🎬</div>
                    <div style="font-size: 1.1rem; opacity: 0.9;">Video preview coming soon</div>
                </div>
            `;
        });
        
        // Handle poster image error
        toolVideo.addEventListener('error', () => {
            // Remove poster attribute if it fails to load
            toolVideo.removeAttribute('poster');
        });
        
        // Ensure video shows something even without poster
        if (!toolVideo.poster || toolVideo.poster === '') {
            toolVideo.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
        }
    }
}

// Consolidated data loading function
async function loadBlogsAndResources() {
    console.log('Loading blogs and resources...');
    try {
        const [blogs, resources] = await Promise.all([
            fetchJSON('data/blogs.json'),
            fetchJSON('data/resources.json')
        ]);
        
        console.log('Blogs loaded:', blogs);
        console.log('Resources loaded:', resources);
        
        if (blogs) renderBlogs(blogs);
        if (resources) renderResources(resources);
    } catch (error) {
        console.error('Error loading blogs and resources:', error);
    }
}

// Films data loading function
async function loadFilms() {
    console.log('loadFilms function called');
    const filmsContainer = document.getElementById('films-list');
    if (!filmsContainer) {
        console.error('Films container not found');
        return;
    }

    console.log('Films container found:', filmsContainer);

    try {
        // Show loading state
        filmsContainer.innerHTML = '<div class="films-loading">Loading films...</div>';
        
        console.log('Fetching films from data/films.json');
        
        // Try to fetch films
        const response = await fetch('data/films.json', { cache: 'no-store' });
        console.log('Films fetch response:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const filmsData = await response.json();
        console.log('Films data loaded from file:', filmsData);
        
        // Render the films
        renderFilms(filmsData, filmsContainer);
        
    } catch (error) {
        console.error('Error loading films from file:', error);
        console.log('Using fallback films data');
        
        // Use fallback data
        const filmsData = FALLBACK_FILMS_DATA;
        console.log('Using fallback films data:', filmsData.length, 'items');
        renderFilms(filmsData, filmsContainer);
    }
}

// Function to render films
function renderFilms(films, container) {
    console.log('renderFilms called with:', films);
    
    if (!films || !Array.isArray(films)) {
        console.log('Films is not an array or is null');
        container.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 3rem;">
                <h3 style="color: var(--text-color); margin-bottom: 1rem;">No films available</h3>
                <p style="color: var(--nav-link); max-width: 600px; margin: 0 auto; line-height: 1.6;">
                    Films and scripts will appear here soon.
                </p>
            </div>`;
        return;
    }
    
    if (films.length === 0) {
        console.log('Films array is empty');
        container.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 3rem;">
                <h3 style="color: var(--text-color); margin-bottom: 1rem;">No films yet</h3>
                <p style="color: var(--nav-link); max-width: 600px; margin: 0 auto; line-height: 1.6;">
                    Check back soon for creative film and advertising work.
                </p>
            </div>`;
        return;
    }

    console.log('Rendering', films.length, 'films');
    const filmsHTML = films.map(film => `
        <div class="film-item">
            <div class="film-video-container">
                ${film.youtubeId ? `
                <iframe 
                    class="film-video youtube-embed" 
                    src="https://www.youtube.com/embed/${film.youtubeId}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
                ` : `
                <video class="film-video" controls preload="metadata" ${film.thumbnail ? `poster="${film.thumbnail}"` : ''}>
                    <source src="${film.videoUrl}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                `}
            </div>
            <div class="film-content">
                <div class="film-header">
                    <h3 class="film-title">${film.title}</h3>
                    <div class="film-meta-top">
                        ${film.duration ? `<span class="film-duration">⏱️ ${film.duration}</span>` : ''}
                        ${film.category ? `<span class="film-category">${film.category}</span>` : ''}
                    </div>
                </div>
                ${film.date ? `<p class="film-date">${film.date}</p>` : ''}
                <p class="film-description">${film.description}</p>
                
                ${film.tools ? `
                <div class="film-tools-section">
                    <div class="film-tools-title">🛠️ Tools Used</div>
                    <div class="film-tools-tags">
                        ${film.tools.split(',').map(tool => 
                            `<span class="film-tool-tag">${tool.trim()}</span>`
                        ).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${film.technologies ? `
                <div class="film-tools-section">
                    <div class="film-tools-title">⚡ Technologies & Techniques</div>
                    <div class="film-tech-tags">
                        ${film.technologies.split(',').map(tech => 
                            `<span class="film-tech-tag">${tech.trim()}</span>`
                        ).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
    `).join('');
    
    console.log('Generated films HTML length:', filmsHTML.length);
    container.innerHTML = filmsHTML;
    console.log('Films rendered successfully');
}

// Navigation and UI initialization
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // Smooth scroll to section with header offset
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
    
    // Handle CTA links in intro section
    const ctaLinks = document.querySelectorAll('.cta-link');
    ctaLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Remove active class from all links and sections
                navLinks.forEach(l => l.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));
                
                // Add active class to target link and section
                const targetNavLink = document.querySelector(`[href="#${targetId}"]`);
                if (targetNavLink) {
                    targetNavLink.classList.add('active');
                }
                targetSection.classList.add('active');
                
                // Smooth scroll to section with header offset
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add smooth scrolling for all anchor links with header offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20; // 20px extra padding
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animation and effects initialization
function initAnimations() {
    // Add loading animation for profile image
    const profileImg = document.querySelector('.profile-img');
    if (profileImg) {
        // Set initial opacity to 0 for fade-in effect
        profileImg.style.opacity = '0';
        
        profileImg.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        profileImg.addEventListener('error', function() {
            // If image fails to load, show a placeholder
            this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.style.color = 'white';
            this.style.fontSize = '3rem';
            this.style.opacity = '1';
            this.innerHTML = '👨‍💻';
        });
        
        // If image is already loaded (cached), show it immediately
        if (profileImg.complete) {
            profileImg.style.opacity = '1';
        }
    }
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.resource-card, .blog-post, .portfolio-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Initialize canvas animation
    initCanvasAnimation();
    
    // Initialize figure media
    initFigureMedia();
}

// Canvas animation for orbiting dots
function initCanvasAnimation() {
    const orbitCanvas = document.getElementById('orbitCanvas');
    if (orbitCanvas) {
        const ctx = orbitCanvas.getContext('2d');
        let width, height, centerX, centerY, scale;
        const deviceRatio = window.devicePixelRatio || 1;

        function resize() {
            const rect = orbitCanvas.getBoundingClientRect();
            width = Math.floor(rect.width);
            height = Math.floor(rect.height);
            orbitCanvas.width = Math.floor(width * deviceRatio);
            orbitCanvas.height = Math.floor(height * deviceRatio);
            ctx.setTransform(deviceRatio, 0, 0, deviceRatio, 0, 0);
            centerX = width / 2;
            centerY = height / 2;
            scale = Math.min(width, height) / 2.6;
        }

        resize();
        window.addEventListener('resize', resize);

        const TWO_PI = Math.PI * 2;
        const particles = Array.from({ length: 160 }, (_, i) => {
            const orbit = 0.3 + Math.random() * 0.7; // radius factor
            const speed = (0.4 + Math.random() * 0.8) * (Math.random() < 0.5 ? -1 : 1);
            const angle = Math.random() * TWO_PI;
            const size = 1.2 + Math.random() * 2.4;
            const hue = Math.floor(200 + Math.random() * 140); // blue-purple-green range
            const sat = 70 + Math.random() * 30;
            const light = 55 + Math.random() * 20;
            return { orbit, speed, angle, size, hue, sat, light, z: Math.random() };
        });

        let last = performance.now();
        function tick(now) {
            const dt = Math.min(40, now - last) / 1000; // seconds
            last = now;

            ctx.clearRect(0, 0, width, height);

            // gentle rotation of the whole system
            const t = now * 0.0001;
            const rot = t % TWO_PI;
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rot);

            for (const p of particles) {
                p.angle += p.speed * dt * 0.6;
                const r = p.orbit * scale * (0.8 + 0.2 * Math.sin(t * 2 + p.orbit * 5));
                const x = Math.cos(p.angle) * r;
                const y = Math.sin(p.angle) * r * 0.6; // slight ellipse

                // depth effect
                const alpha = 0.6 + 0.4 * Math.sin(p.angle + p.z * 6);
                ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${p.light}%, ${alpha})`;
                ctx.beginPath();
                ctx.arc(x, y, p.size, 0, TWO_PI);
                ctx.fill();
            }

            ctx.restore();
            requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }
}

// Figure media initialization
function initFigureMedia() {
    const figureVideo = document.getElementById('homeFigureVideo');
    const figureGif = document.getElementById('homeFigureGif');
    if (figureVideo) {
        figureVideo.addEventListener('canplay', () => {
            figureVideo.style.display = 'block';
            if (figureGif) figureGif.style.display = 'none';
        });
        figureVideo.addEventListener('error', () => {
            if (figureGif) figureGif.style.display = 'block';
        });
        // If the video source is missing, show GIF if available
        if (!figureVideo.getAttribute('src')) {
            if (figureGif) figureGif.style.display = 'block';
        }
    }
}

// Data loading functions
async function fetchJSON(path) {
    console.log('Fetching:', path);
    try {
        const res = await fetch(path, { cache: 'no-store' });
        console.log('Response status:', res.status, 'for', path);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        console.log('Data loaded from', path, ':', data);
        return data;
    } catch (e) {
        console.warn('Failed to load', path, e);
        console.log('Using fallback data for', path);
        
        // Return fallback data based on the path
        if (path.includes('portfolio.json')) {
            return FALLBACK_PORTFOLIO_DATA;
        } else if (path.includes('blogs.json')) {
            return FALLBACK_BLOG_DATA;
        } else if (path.includes('films.json')) {
            return FALLBACK_FILMS_DATA;
        }
        
        return null;
    }
}

function renderBlogs(blogs) {
    console.log('renderBlogs called with:', blogs);
    const container = document.querySelector('.blog-posts');
    console.log('Blog container found:', container);
    
    if (!container) {
        console.error('Blog container (.blog-posts) not found in DOM');
        return;
    }
    
    if (!Array.isArray(blogs)) {
        console.error('Blogs is not an array:', blogs);
        return;
    }
    
    if (blogs.length === 0) {
        console.log('No blogs to render');
        container.innerHTML = '<p>No blog posts available.</p>';
        return;
    }
    
    console.log('Rendering', blogs.length, 'blog posts');
    const blogHTML = blogs.map(b => `
        <div class="blog-post">
            <div class="blog-date">${b.date || ''}</div>
            <div class="blog-content">
                <h3 class="blog-title">
                    <a href="${b.url}" target="_blank" rel="noopener">${b.title}</a>
                </h3>
                <p class="blog-excerpt">${b.excerpt || ''}</p>
            </div>
        </div>
    `).join('');
    
    console.log('Generated blog HTML:', blogHTML);
    container.innerHTML = blogHTML;
    console.log('Blog posts rendered successfully');
}

function renderResources(resources) {
    const grid = document.querySelector('.resources-grid');
    if (!grid || !Array.isArray(resources)) return;
    grid.innerHTML = resources.map(r => `
        <div class="resource-card">
            <div class="resource-icon">${r.icon || '📘'}</div>
            <h3 class="resource-title">${r.title}</h3>
            <p class="resource-description">${r.description || ''}</p>
            ${r.link ? `<a href="${r.link}" target="_blank" class="resource-link">${r.cta || 'Open'}</a>` : ''}
        </div>
    `).join('');
}

// Function to render portfolio items
function renderPortfolioItems(items, container) {
    console.log('renderPortfolioItems called with:', items);
    console.log('Items type:', typeof items);
    console.log('Items is array:', Array.isArray(items));
    console.log('Items length:', items ? items.length : 'items is null/undefined');
    
    if (!items) {
        console.log('Items is null or undefined, showing empty state');
        container.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 3rem;">
                <h3 style="color: var(--text-color); margin-bottom: 1rem;">Loading portfolio...</h3>
                <p style="color: var(--nav-link); max-width: 600px; margin: 0 auto; line-height: 1.6;">
                    Please wait while we load the projects.
                </p>
            </div>`;
        return;
    }
    
    if (!Array.isArray(items)) {
        console.log('Items is not an array:', items);
        container.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 3rem;">
                <h3 style="color: var(--text-color); margin-bottom: 1rem;">Error loading portfolio</h3>
                <p style="color: var(--nav-link); max-width: 600px; margin: 0 auto; line-height: 1.6;">
                    There was an issue loading the portfolio data.
                </p>
            </div>`;
        return;
    }
    
    if (items.length === 0) {
        console.log('Items array is empty');
        container.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 3rem;">
                <h3 style="color: var(--text-color); margin-bottom: 1rem;">No projects found</h3>
                <p style="color: var(--nav-link); max-width: 600px; margin: 0 auto; line-height: 1.6;">
                    Portfolio projects will appear here soon.
                </p>
            </div>`;
        return;
    }

    console.log('Rendering', items.length, 'portfolio items');
    const portfolioHTML = items.map(item => `
        <div class="portfolio-item">
            <div class="portfolio-image-container">
                ${item.image ? `
                <img src="${item.image.startsWith('http') ? item.image : 'images/portfolio/' + item.image}" 
                     alt="${item.title}" 
                     class="portfolio-image" 
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/400x300/2d3748/ffffff?text=Project+Image';">
                ` : `
                <div class="portfolio-image-placeholder">
                    <span>${item.title.charAt(0).toUpperCase()}</span>
                </div>
                `}
            </div>
            <div class="portfolio-content">
                <h3 class="portfolio-title">${item.title}</h3>
                <p class="portfolio-date">${item.date || ''}</p>
                <p class="portfolio-description">${item.description}</p>
                ${item.technologies ? `
                <div class="portfolio-meta">
                    ${item.technologies.split(',').map(tech => 
                        `<span class="portfolio-tag">${tech.trim()}</span>`
                    ).join('')}
                </div>
                ` : ''}
                <div class="portfolio-links">
                    ${item.url && item.url !== '#' ? `
                    <a href="${item.url}" target="_blank" class="portfolio-link" rel="noopener">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        View Project
                    </a>
                    ` : ''}
                    ${item.github && item.github !== '#' ? `
                    <a href="${item.github}" target="_blank" class="portfolio-link" rel="noopener">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                        GitHub
                    </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    console.log('Generated portfolio HTML length:', portfolioHTML.length);
    container.innerHTML = portfolioHTML;
    console.log('Portfolio items rendered successfully');
}

// Portfolio functionality
async function loadPortfolio() {
    console.log('loadPortfolio function called');
    const portfolioContainer = document.getElementById('portfolio-list');
    if (!portfolioContainer) {
        console.error('Portfolio container not found');
        return;
    }

    console.log('Portfolio container found:', portfolioContainer);

    try {
        // Show loading state
        portfolioContainer.innerHTML = '<div class="portfolio-loading">Loading projects...</div>';
        
        console.log('Fetching portfolio from data/portfolio.json');
        
        // Try to fetch portfolio items
        const response = await fetch('data/portfolio.json', { cache: 'no-store' });
        console.log('Portfolio fetch response:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const portfolioItems = await response.json();
        console.log('Portfolio items loaded from file:', portfolioItems);
        console.log('Portfolio items type:', typeof portfolioItems);
        console.log('Portfolio items is array:', Array.isArray(portfolioItems));
        console.log('Portfolio items length:', portfolioItems ? portfolioItems.length : 'null');
        
        // Render the items (or empty state if no items)
        renderPortfolioItems(portfolioItems, portfolioContainer);
        
    } catch (error) {
        console.error('Error loading portfolio from file:', error);
        console.log('Using fallback portfolio data');
        
        // Use fallback data
        const portfolioItems = FALLBACK_PORTFOLIO_DATA;
        console.log('Using fallback portfolio data:', portfolioItems.length, 'items');
        renderPortfolioItems(portfolioItems, portfolioContainer);
    }
}

// Waitlist functionality
function initWaitlist() {
    const waitlistForm = document.getElementById('waitlistForm');
    const waitlistSuccess = document.getElementById('waitlistSuccess');
    
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const submitBtn = waitlistForm.querySelector('.waitlist-btn');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Joining...';
            submitBtn.disabled = true;
            
            try {
                const timestamp = new Date().toISOString();
                
                // Store locally as backup
                const waitlistEmails = JSON.parse(localStorage.getItem('waitlistEmails') || '[]');
                const newEntry = {
                    email: email,
                    timestamp: timestamp,
                    source: 'filmmaker-tools'
                };
                
                // Check if email already exists
                if (waitlistEmails.find(entry => entry.email === email)) {
                    alert('This email is already on the waitlist!');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    return;
                }
                
                // Add to local storage
                waitlistEmails.push(newEntry);
                localStorage.setItem('waitlistEmails', JSON.stringify(waitlistEmails));
                
                // Send email notification to you
                submitBtn.textContent = 'Sending notification...';
                const emailSent = await sendEmailNotification(email, timestamp);
                
                if (emailSent) {
                    console.log('✅ Email notification sent successfully');
                } else {
                    console.log('⚠️ Email notification failed, but signup saved locally');
                }
                
                // Show success message
                waitlistForm.style.display = 'none';
                waitlistSuccess.style.display = 'flex';
                
                // Log for debugging
                console.log('New waitlist signup:', newEntry);
                console.log('Total signups:', waitlistEmails.length);
                
            } catch (error) {
                console.error('Error joining waitlist:', error);
                alert('Something went wrong. Please try again.');
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}