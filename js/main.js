// ================================
// HotelCarRentals - Main JavaScript
// Mobile-optimized, smooth UX
// ================================

(function() {
    'use strict';

    // ================================
    // Mobile Menu Toggle
    // ================================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');

            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking on a link
        const menuLinks = navMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu on window resize (if switching to desktop)
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth >= 768) {
                    mobileMenuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }, 250);
        });
    }

    // ================================
    // Navbar Scroll Effect
    // ================================
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;
    let scrolling = false;

    function handleNavbarScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollTop = scrollTop;
        scrolling = false;
    }

    window.addEventListener('scroll', function() {
        if (!scrolling) {
            window.requestAnimationFrame(handleNavbarScroll);
            scrolling = true;
        }
    });

    // ================================
    // Smooth Scroll for Anchor Links
    // ================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Only handle internal page anchors
            if (href.length > 1) {
                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();

                    const navbarHeight = navbar ? navbar.offsetHeight : 70;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ================================
    // AOS (Animate On Scroll) Implementation
    // ================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get delay from data attribute
                const delay = entry.target.getAttribute('data-aos-delay') || 0;

                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, delay);

                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });

    // ================================
    // Counter Animation for Stats
    // ================================
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;

        const updateCounter = () => {
            current += increment;

            if (current < target) {
                // Format number with commas
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                // Ensure final value is exact
                if (element.textContent.includes('$')) {
                    element.textContent = '$' + target.toLocaleString();
                } else if (element.textContent.includes('%')) {
                    element.textContent = target + '%';
                } else if (element.textContent.includes('+')) {
                    element.textContent = target.toLocaleString() + '+';
                } else {
                    element.textContent = target.toLocaleString();
                }
            }
        };

        requestAnimationFrame(updateCounter);
    }

    // Animate stats when they come into view
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const text = statNumber.textContent;

                // Extract number from text
                const numberMatch = text.match(/[\d,]+/);
                if (numberMatch) {
                    const number = parseInt(numberMatch[0].replace(/,/g, ''));
                    animateCounter(statNumber, number);
                    statsObserver.unobserve(statNumber);
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(stat => {
        statsObserver.observe(stat);
    });

    // ================================
    // Lazy Loading Images
    // ================================
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;

                // If image has data-src, load it
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }

                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });

    // ================================
    // Form Validation (if forms exist)
    // ================================
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');

                    // Remove error class on input
                    field.addEventListener('input', function() {
                        this.classList.remove('error');
                    }, { once: true });
                }
            });

            if (!isValid) {
                e.preventDefault();
            }
        });
    });

    // ================================
    // Scroll Progress Indicator
    // ================================
    function updateScrollProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset;
        const scrollPercentage = (scrollTop / documentHeight) * 100;

        // You can use this to update a progress bar if you add one
        document.documentElement.style.setProperty('--scroll-progress', scrollPercentage + '%');
    }

    let progressScrolling = false;
    window.addEventListener('scroll', function() {
        if (!progressScrolling) {
            window.requestAnimationFrame(updateScrollProgress);
            progressScrolling = true;
            setTimeout(() => progressScrolling = false, 100);
        }
    });

    // ================================
    // External Link Handler
    // ================================
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        // Only add target blank to external links
        if (!link.href.includes(window.location.hostname)) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });

    // ================================
    // Performance: Reduce Motion for Users Who Prefer It
    // ================================
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Remove all animations for users who prefer reduced motion
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.removeAttribute('data-aos');
            el.removeAttribute('data-aos-delay');
        });

        // Disable smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href.length > 1) {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView();
                    }
                }
            });
        });
    }

    // ================================
    // Testimonials Rotation (Optional)
    // ================================
    const testimonialCards = document.querySelectorAll('.testimonial-card');

    if (testimonialCards.length > 0) {
        let currentTestimonial = 0;

        // This is just a placeholder for potential carousel functionality
        // Currently testimonials are shown in a grid, but this could be used
        // for a rotating display on mobile
    }

    // ================================
    // Search Functionality (Placeholder)
    // ================================
    const searchInputs = document.querySelectorAll('input[type="search"]');

    searchInputs.forEach(input => {
        input.addEventListener('input', debounce(function(e) {
            const query = e.target.value.toLowerCase();
            // Implement search logic here when search is added
            console.log('Searching for:', query);
        }, 300));
    });

    // ================================
    // Utility: Debounce Function
    // ================================
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ================================
    // Page Load Performance
    // ================================
    window.addEventListener('load', function() {
        // Remove any loading states
        document.body.classList.add('loaded');

        // Log performance metrics (for development)
        if (window.performance) {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('Page load time:', pageLoadTime + 'ms');
        }
    });

    // ================================
    // Touch Device Detection
    // ================================
    function isTouchDevice() {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
    }

    if (isTouchDevice()) {
        document.body.classList.add('touch-device');
    } else {
        document.body.classList.add('no-touch');
    }

    // ================================
    // Keyboard Navigation Enhancement
    // ================================
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ================================
    // Initialize
    // ================================
    console.log('HotelCarRentals initialized ✓');

})();
