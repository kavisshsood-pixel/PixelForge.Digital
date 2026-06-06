/* ==========================================================================
   PORTFOLIO INTERACTIVE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. THEME SWITCHER
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const bodyElement = document.body;

    // Check saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        bodyElement.className = savedTheme;
    } else {
        // Default is dark-theme
        bodyElement.classList.add('dark-theme');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (bodyElement.classList.contains('dark-theme')) {
            bodyElement.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('theme', 'light-theme');
        } else {
            bodyElement.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('theme', 'dark-theme');
        }
    });

    // ==========================================
    // 2. MOBILE MENU NAVIGATION
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const toggleMobileMenu = () => {
        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('overflow-hidden'); // Prevent background scrolling
    };

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // Close mobile menu if clicked outside
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            toggleMobileMenu();
        }
    });

    // ==========================================
    // 3. STICKY NAVBAR & ACTIVE NAV LINK TRACKING
    // ==========================================
    const headerElement = document.querySelector('.navbar-container');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    const handleScroll = () => {
        // Sticky Header effect
        if (window.scrollY > 50) {
            headerElement.classList.add('scrolled');
        } else {
            headerElement.classList.remove('scrolled');
        }

        // Active Navigation link tracking on scroll
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) - 20;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger initial scroll check

    // ==========================================
    // 4. CUSTOM CURSOR
    // ==========================================
    const cursorOutline = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('custom-cursor-dot');
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .filter-btn, input, textarea');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Position Dot instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Animate Outline smoothly
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 200, fill: "forwards" });
    });

    interactiveElements.forEach(elem => {
        elem.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('hovered');
        });
        elem.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('hovered');
        });
    });

    // ==========================================
    // 5. HERO TYPING EFFECT
    // ==========================================
    const typedTextElement = document.getElementById('typed-element');
    const roles = ['Web Developer', 'Web Designer', 'Web Specialist', 'PixelForge Founder'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    const typeEffect = () => {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typedTextElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; // Deletion speed is faster
        } else {
            typedTextElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 120; // Typing speed
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeSpeed = 1500; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 400; // Pause before typing next word
        }

        setTimeout(typeEffect, typeSpeed);
    };

    if (typedTextElement) {
        typeEffect();
    }

    // ==========================================
    // 6. SCROLL REVEAL (INTERSECTION OBSERVER)
    // ==========================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const skillBars = document.querySelectorAll('.bar-fill');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // If it is the skills section, animate the bars
                if (entry.target.id === 'skills') {
                    skillBars.forEach(bar => {
                        const width = bar.style.width;
                        bar.style.width = '0';
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 100);
                    });
                }
                
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, {
        threshold: 0.15
    });

    revealElements.forEach(elem => {
        revealObserver.observe(elem);
    });

    // ==========================================
    // 7. PORTFOLIO FILTERING
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                card.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
                if (filterValue === 'all' || card.classList.contains(filterValue)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 400);
                }
            });
        });
    });

    // ==========================================
    // 8. PROJECT DETAILS MODAL
    // ==========================================
    const projectData = {
        1: {
            title: "ASN Sr. Sec. School Web Portal",
            tag: "Development & Deployment",
            tech: ["HTML5", "TailwindCSS", "JavaScript", "Responsive Design"],
            desc: "This is a premium, fully customized educational and technology portal built for ASN Senior Secondary School. It features a complete tech achievements hall of fame, a clean visual lightbox gallery displaying lab capabilities, and events calendars. The project was built entirely from scratch, ensuring responsiveness and ultra-fast loading across all student and parent devices.",
            link: "https://asn-mayurvihar.rf.gd/#gallery",
            gradientClass: "bg-gradient-school",
            iconClass: "fa-school"
        },
        2: {
            title: "Interactive Markup Editor",
            tag: "Development",
            tech: ["HTML5", "CSS3", "JavaScript", "Monaco Editor"],
            desc: "A browser-based live compiling sandbox for web markup and stylesheet rules. Provides real-time syntax checking, interactive code suggestion dropdowns, side-by-side split screen viewports, and local storage state persistence. Ideal for testing web interface snippets on the fly.",
            link: "#",
            gradientClass: "bg-gradient-code",
            iconClass: "fa-code"
        },
        3: {
            title: "Premium Glassmorphic Admin",
            tag: "UI/UX Design",
            tech: ["Figma", "UI/UX", "Glassmorphism", "Prototyping"],
            desc: "A visual masterclass designing control panels for server operations. It implements rich glassmorphism tokens, harmony palettes using HSL colors, responsive grid structures, dark/light variations, and micro-interaction animations. Focused on layout scalability and clean data presentation metrics.",
            link: "#",
            gradientClass: "bg-gradient-dashboard",
            iconClass: "fa-chart-line"
        },
        4: {
            title: "SEO & Web Performance Toolkit",
            tag: "Development & Optimization",
            tech: ["JavaScript", "Web Auditing", "SEO Tools", "Core Web Vitals"],
            desc: "An optimization bundle built to analyze loading paths, script execution threads, image compression rates, and semantic structure tags. Ideal for auditing portfolio pages, discovering bottlenecks, rendering benchmarks, and fixing Google Lighthouse ratings.",
            link: "#",
            gradientClass: "bg-gradient-speed",
            iconClass: "fa-gauge-high"
        }
    };

    const modalOverlay = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const modalCloseBtn = document.getElementById('modal-close');

    const openModal = (projectId) => {
        const data = projectData[projectId];
        if (!data) return;

        // Populate modal HTML
        let techHtml = '';
        data.tech.forEach(t => techHtml += `<span>${t}</span>`);

        const isRealLink = data.link !== '#';
        const buttonHtml = isRealLink 
            ? `<a href="${data.link}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Visit Live Site <i class="fa-solid fa-up-right-from-square"></i></a>`
            : `<button class="btn btn-primary" disabled style="opacity:0.6; cursor:not-allowed;">Internal Project Only</button>`;

        modalBody.innerHTML = `
            <span class="modal-header-tag">${data.tag}</span>
            <h3 class="modal-title">${data.title}</h3>
            <div class="modal-tech-stack">${techHtml}</div>
            
            <div class="modal-img-placeholder ${data.gradientClass}">
                <i class="fa-solid ${data.iconClass}" style="font-size: 50px;"></i>
            </div>
            
            <p class="modal-desc">${data.desc}</p>
            <div class="modal-footer">
                ${buttonHtml}
            </div>
        `;

        modalOverlay.classList.add('active');
        document.body.classList.add('overflow-hidden');
    };

    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.body.classList.remove('overflow-hidden');
    };

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project-id');
            openModal(projectId);
        });
    });

    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Close modal on Escape key press
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // ==========================================
    // 9. CONTACT FORM VALIDATION & HANDLING
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const formSubmitBtn = document.getElementById('form-submit-btn');
    const formFeedback = document.getElementById('form-feedback');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameVal = document.getElementById('name').value.trim();
        const emailVal = document.getElementById('email').value.trim();
        const subjectVal = document.getElementById('subject').value.trim();
        const messageVal = document.getElementById('message').value.trim();

        // Basic validations
        if (!nameVal || !emailVal || !subjectVal || !messageVal) {
            showFeedback('Please fill out all fields.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailVal)) {
            showFeedback('Please enter a valid email address.', 'error');
            return;
        }

        // Show Loading State
        formSubmitBtn.disabled = true;
        const originalBtnContent = formSubmitBtn.innerHTML;
        formSubmitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
        formFeedback.textContent = '';

        // Simulate network request (1.5 seconds)
        setTimeout(() => {
            // Restore button
            formSubmitBtn.disabled = false;
            formSubmitBtn.innerHTML = originalBtnContent;

            // Success feedback
            showFeedback('Thank you, Kavissh will get back to you shortly!', 'success');
            contactForm.reset();

            // Clear success message after 5 seconds
            setTimeout(() => {
                formFeedback.textContent = '';
                formFeedback.className = 'form-feedback';
            }, 5000);

        }, 1500);
    });

    const showFeedback = (msg, type) => {
        formFeedback.textContent = msg;
        formFeedback.className = `form-feedback ${type}`;
    };
});
