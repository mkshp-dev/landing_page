document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';

    document.documentElement.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            // Toggle Nav
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');

            // Animate Links
            links.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        });
    }

    // Close mobile menu when clicking a link
    if (links) {
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('toggle');
                links.forEach(l => l.style.animation = '');
            });
        });
    }

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate
    const animateElements = document.querySelectorAll('.hero-content, .hero-visual, .section-title, .skill-card, .project-card, .contact-container');

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Add class for animation styles
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        @media (max-width: 768px) {
            .nav-links {
                position: absolute;
                right: 0;
                height: 92vh;
                top: 8vh;
                background-color: var(--bg-color);
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 50%;
                transform: translateX(100%);
                transition: transform 0.5s ease-in;
                border-left: 1px solid var(--glass-border);
                padding-top: 2rem;
            }
            
            .nav-links.active {
                transform: translateX(0%);
            }
            
            .nav-links li {
                opacity: 0;
                margin: 1.5rem 0;
            }
        }
        
        @keyframes navLinkFade {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .hamburger.toggle .line1 {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        .hamburger.toggle .line2 {
            opacity: 0;
        }
        .hamburger.toggle .line3 {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    `;
    document.head.appendChild(styleSheet);

    // Dynamic Project Loading
    const projectsGrid = document.getElementById('projects-grid');

    if (projectsGrid) {
        fetch('projects/index.json')
            .then(response => response.json())
            .then(projectFiles => {
                projectFiles.forEach(file => {
                    fetch(`projects/${file}`)
                        .then(response => response.json())
                        .then(project => {
                            const card = document.createElement('article');
                            card.className = 'project-card glass';
                            card.innerHTML = `
                                <div class="project-image">
                                    <div class="placeholder-img ${project.gradient}"></div>
                                </div>
        <div class="project-content">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="tags">
                ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
            </div>
            <a href="${project.link}" class="link-arrow">View Project &rarr;</a>
        </div>
    `;

                            // Add animation styles initially hidden
                            card.style.opacity = '0';
                            card.style.transform = 'translateY(20px)';
                            card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';

                            projectsGrid.appendChild(card);

                            // Observe the new card
                            observer.observe(card);
                        })
                        .catch(err => {
                            console.error('Error loading project:', err);
                            projectsGrid.innerHTML += `<p style="color: red;">Error loading project: ${err.message}</p>`;
                        });
                });
            })
            .catch(err => {
                console.error('Error loading project list:', err);
                projectsGrid.innerHTML = `
                    <div style="text-align: center; width: 100%; padding: 2rem;">
                        <p style="color: var(--text-secondary);">Unable to load projects.</p>
                        <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.5rem;">
                            Note: If you are opening this file directly (file://), dynamic loading may be blocked by browser security.
                            Try using a local server (e.g., VS Code Live Server or 'python -m http.server').
                        </p>
                    </div>
                `;
            });
    }
});
