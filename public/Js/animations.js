/**
* NestNova Advanced Animations
* Provides enhanced animations and interactive effects throughout the application
*/

document.addEventListener('DOMContentLoaded', function () {
    // Initialize page transition effects
    initPageTransitions();

    // Add micro-interactions to UI elements
    addMicroInteractions();

    // Setup scroll-triggered animations
    setupScrollAnimations();

    // Add animated backgrounds
    setupAnimatedBackgrounds();

    // Add interactive cursor effects
    setupCursorEffects();

    // Initialize animated counters
    initAnimatedCounters();

    // Add parallax effects
    addParallaxEffects();

    // Add form interaction animations
    enhanceFormInteractions();
});

/**
 * Initialize smooth page transition effects
 */
function initPageTransitions() {
    // Add transition class to body
    document.body.classList.add('page-transitions');

    // Add exit animation when navigating away
    document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href^="javascript:"]):not([href^="mailto:"])').forEach(link => {
        link.addEventListener('click', function (e) {
            // Skip if modifier keys are pressed
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

            const href = this.getAttribute('href');
            if (href && href.indexOf('#') !== 0 && href.indexOf('javascript:') !== 0) {
                e.preventDefault();
                document.body.classList.add('page-exit');

                setTimeout(() => {
                    window.location.href = href;
                }, 300); // Match this with CSS transition duration
            }
        });
    });

    // Add entrance animation
    window.addEventListener('pageshow', function () {
        document.body.classList.add('page-enter');
        setTimeout(() => {
            document.body.classList.remove('page-enter');
        }, 500);
    });
}

/**
 * Add micro-interactions to UI elements
 */
function addMicroInteractions() {
    // Add ripple effect to buttons with enhanced visual feedback
    document.querySelectorAll('.btn, .card, .nav-link').forEach(element => {
        element.classList.add('ripple-effect');

        element.addEventListener('mousedown', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            // Add color variation based on element type
            if (this.classList.contains('btn-primary')) {
                ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
            } else if (this.classList.contains('btn-secondary')) {
                ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
            } else if (this.classList.contains('card')) {
                ripple.style.backgroundColor = 'rgba(254, 66, 77, 0.1)';
            }

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });

        // Add subtle scale effect on click
        element.addEventListener('mousedown', function () {
            this.style.transform = 'scale(0.98)';
            this.style.transition = 'transform 0.1s ease';
        });

        element.addEventListener('mouseup', function () {
            this.style.transform = '';
        });

        element.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });

    // Add hover tilt effect to cards with smoother transitions
    document.querySelectorAll('.card, .listing-card').forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const tiltX = (y - centerY) / 20;
            const tiltY = (centerX - x) / 20;

            // Add subtle shadow movement
            const shadowX = (centerX - x) / 40;
            const shadowY = (centerY - y) / 40;
            this.style.boxShadow = `${shadowX}px ${shadowY}px 20px rgba(0,0,0,0.1)`;

            this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            this.style.transition = 'box-shadow 0.1s ease';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            this.style.boxShadow = '';
            this.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
        });

        // Add hover effect to card images
        const cardImage = card.querySelector('.card-img-top, .listing-image');
        if (cardImage) {
            card.addEventListener('mouseenter', function () {
                cardImage.style.transform = 'scale(1.05)';
                cardImage.style.transition = 'transform 0.5s ease';
            });

            card.addEventListener('mouseleave', function () {
                cardImage.style.transform = 'scale(1)';
            });
        }
    });

    // Add focus animations to form elements with enhanced visual feedback
    document.querySelectorAll('input, textarea, select').forEach(input => {
        const parent = input.parentElement;
        if (parent && parent.classList.contains('form-group')) {
            input.addEventListener('focus', function () {
                parent.classList.add('input-focused');

                // Add subtle pulse animation to label
                const label = parent.querySelector('label');
                if (label) {
                    label.style.color = '#fe424d';
                    label.style.transform = 'translateY(-3px)';
                    label.style.transition = 'color 0.3s ease, transform 0.3s ease';
                }
            });

            input.addEventListener('blur', function () {
                parent.classList.remove('input-focused');

                // Reset label style
                const label = parent.querySelector('label');
                if (label) {
                    label.style.color = '';
                    label.style.transform = '';
                }
            });
        }

        // Add focus border animation
        input.addEventListener('focus', function () {
            this.style.borderColor = '#fe424d';
            this.style.boxShadow = '0 0 0 0.2rem rgba(254, 66, 77, 0.25)';
            this.style.transition = 'border-color 0.3s ease, box-shadow 0.3s ease';
        });

        input.addEventListener('blur', function () {
            this.style.borderColor = '';
            this.style.boxShadow = '';
        });
    });

    // Add hover effects to icons
    document.querySelectorAll('.fa, .fas, .far, .fab').forEach(icon => {
        if (!icon.closest('.btn')) { // Skip icons inside buttons
            icon.classList.add('animated-icon');

            icon.addEventListener('mouseenter', function () {
                this.style.transform = 'scale(1.2) rotate(5deg)';
                this.style.color = '#fe424d';
                this.style.transition = 'transform 0.3s ease, color 0.3s ease';
            });

            icon.addEventListener('mouseleave', function () {
                this.style.transform = '';
                this.style.color = '';
            });
        }
    });
}

/**
 * Setup scroll-triggered animations
 */
function setupScrollAnimations() {
    // Create intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Add animation classes to elements
    const animateElements = document.querySelectorAll('.card, .listing-card, .section-title, .feature-item, .testimonial, .stat-item');
    animateElements.forEach((element, index) => {
        // Add base animation class
        element.classList.add('animate-on-scroll');

        // Add different animation types based on element or position
        if (element.classList.contains('card') || element.classList.contains('listing-card')) {
            element.classList.add('fade-up-animation');
        } else if (element.classList.contains('section-title')) {
            element.classList.add('fade-in-animation');
        } else if (element.classList.contains('feature-item')) {
            element.classList.add('slide-in-animation');
            element.style.animationDelay = `${index * 0.1}s`;
        } else if (element.classList.contains('testimonial')) {
            element.classList.add('scale-in-animation');
        } else {
            element.classList.add('fade-up-animation');
            element.style.animationDelay = `${index * 0.1}s`;
        }

        // Observe element
        observer.observe(element);
    });
}

/**
 * Setup animated backgrounds for sections
 */
function setupAnimatedBackgrounds() {
    // Add animated gradient to hero sections
    const heroSections = document.querySelectorAll('.hero-section, .jumbotron, .banner');
    heroSections.forEach(section => {
        section.classList.add('animated-gradient-bg');
    });

    // Add subtle particle background to feature sections
    const featureSections = document.querySelectorAll('.features-section, .benefits-section');
    featureSections.forEach(section => {
        // Create particle container
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-background';
        section.prepend(particleContainer);

        // Add particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            particleContainer.appendChild(particle);
        }
    });
}

/**
 * Setup interactive cursor effects
 */
function setupCursorEffects() {
    // Create custom cursor elements
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);

    // Update cursor position on mouse move
    document.addEventListener('mousemove', function (e) {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    // Add hover effect for interactive elements
    document.querySelectorAll('a, button, .btn, .card, input, select, textarea').forEach(element => {
        element.addEventListener('mouseenter', function () {
            cursor.classList.add('cursor-hover');
            cursorDot.classList.add('cursor-dot-hover');
        });

        element.addEventListener('mouseleave', function () {
            cursor.classList.remove('cursor-hover');
            cursorDot.classList.remove('cursor-dot-hover');
        });
    });

    // Add click effect
    document.addEventListener('mousedown', function () {
        cursor.classList.add('cursor-click');
        cursorDot.classList.add('cursor-dot-click');
    });

    document.addEventListener('mouseup', function () {
        cursor.classList.remove('cursor-click');
        cursorDot.classList.remove('cursor-dot-click');
    });
}

/**
 * Initialize animated counters for statistics
 */
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.counter, [data-counter], .stat-number');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target') || counter.textContent);
        if (isNaN(target)) return;

        // Set starting value
        counter.textContent = '0';

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let count = 0;
                    const duration = 2000; // ms
                    const increment = target / (duration / 16); // For 60fps

                    const updateCount = () => {
                        count += increment;
                        if (count < target) {
                            counter.textContent = Math.floor(count);
                            requestAnimationFrame(updateCount);
                        } else {
                            counter.textContent = target;

                            // Add a small bounce effect when complete
                            counter.style.transform = 'scale(1.1)';
                            setTimeout(() => {
                                counter.style.transform = 'scale(1)';
                                counter.style.transition = 'transform 0.3s ease';
                            }, 100);
                        }
                    };

                    requestAnimationFrame(updateCount);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(counter);
    });
}

/**
 * Add parallax effects to background elements
 */
function addParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax, .parallax-bg, .bg-image');

    parallaxElements.forEach(element => {
        const speed = parseFloat(element.getAttribute('data-parallax-speed') || 0.2);

        window.addEventListener('scroll', function () {
            const scrollPosition = window.pageYOffset;
            const offset = scrollPosition * speed;
            element.style.transform = `translateY(${offset}px)`;
        });
    });

    // Add parallax effect to hero sections
    const heroSections = document.querySelectorAll('.hero-section, .jumbotron, .banner');
    heroSections.forEach(section => {
        window.addEventListener('scroll', function () {
            const scrollPosition = window.pageYOffset;
            if (scrollPosition < 600) { // Only apply effect when near the top
                section.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
            }
        });
    });

    // Add mouse movement parallax to selected elements
    const mouseParallaxElements = document.querySelectorAll('.mouse-parallax');
    mouseParallaxElements.forEach(element => {
        document.addEventListener('mousemove', function (e) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;

            const moveX = (mouseX - 0.5) * 20;
            const moveY = (mouseY - 0.5) * 20;

            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
            element.style.transition = 'transform 0.1s ease-out';
        });
    });
}

/**
 * Enhance form interactions with animations
 */
function enhanceFormInteractions() {
    // Add animated validation feedback
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function (e) {
            // Only for forms with client-side validation
            if (this.getAttribute('data-validate') === 'true') {
                e.preventDefault();

                // Validate form fields
                let isValid = true;
                const requiredFields = this.querySelectorAll('[required]');

                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;

                        // Add shake animation to invalid fields
                        field.classList.add('invalid-shake');

                        // Create or update validation message
                        let validationMessage = field.nextElementSibling;
                        if (!validationMessage || !validationMessage.classList.contains('validation-message')) {
                            validationMessage = document.createElement('div');
                            validationMessage.className = 'validation-message';
                            field.parentNode.insertBefore(validationMessage, field.nextSibling);
                        }

                        validationMessage.textContent = 'This field is required';
                        validationMessage.style.color = '#fe424d';
                        validationMessage.style.fontSize = '0.8rem';
                        validationMessage.style.marginTop = '5px';
                        validationMessage.style.opacity = '0';
                        validationMessage.style.transform = 'translateY(-10px)';
                        validationMessage.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

                        // Animate validation message
                        setTimeout(() => {
                            validationMessage.style.opacity = '1';
                            validationMessage.style.transform = 'translateY(0)';
                        }, 10);

                        // Remove shake after animation completes
                        setTimeout(() => {
                            field.classList.remove('invalid-shake');
                        }, 600);
                    }
                });

                // If valid, show success animation
                if (isValid) {
                    // Add success animation to form
                    this.classList.add('form-success');

                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'alert alert-success mt-3';
                    successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Form submitted successfully!';
                    successMessage.style.opacity = '0';
                    successMessage.style.transform = 'translateY(-10px)';
                    successMessage.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    this.appendChild(successMessage);

                    // Animate success message
                    setTimeout(() => {
                        successMessage.style.opacity = '1';
                        successMessage.style.transform = 'translateY(0)';
                    }, 10);

                    // Reset form with animation
                    setTimeout(() => {
                        this.reset();

                        // Remove success message with fade out
                        setTimeout(() => {
                            successMessage.style.opacity = '0';
                            successMessage.style.transform = 'translateY(-10px)';
                            setTimeout(() => {
                                successMessage.remove();
                                this.classList.remove('form-success');
                            }, 500);
                        }, 3000);
                    }, 1000);
                }
            }
        });

        // Add real-time validation feedback
        const inputFields = form.querySelectorAll('input, textarea, select');
        inputFields.forEach(field => {
            field.addEventListener('input', function () {
                if (this.hasAttribute('required') && this.value.trim()) {
                    // Remove validation message if field is now valid
                    const validationMessage = this.nextElementSibling;
                    if (validationMessage && validationMessage.classList.contains('validation-message')) {
                        validationMessage.style.opacity = '0';
                        validationMessage.style.transform = 'translateY(-10px)';

                        setTimeout(() => {
                            validationMessage.remove();
                        }, 300);
                    }
                }
            });
        });
    });

    // Add CSS for form animations
    const formStyles = document.createElement('style');
    formStyles.textContent = `
        @keyframes invalidShake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-5px); }
            40%, 80% { transform: translateX(5px); }
        }
        
        .invalid-shake {
            animation: invalidShake 0.6s ease;
            border-color: #fe424d !important;
        }
        
        .form-success .form-control {
            border-color: #28a745;
            transition: border-color 0.3s ease;
        }
        
        .form-success button[type="submit"] {
            background-color: #28a745;
            border-color: #28a745;
            transition: background-color 0.3s ease, border-color 0.3s ease;
        }
    `;
    document.head.appendChild(formStyles);
}