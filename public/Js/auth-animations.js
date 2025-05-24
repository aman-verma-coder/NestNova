/**
 * NestNova Authentication Animations
 * Enhances the login and signup pages with interactive animations
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize animations for auth pages
    initAuthAnimations();

    // Add form interactions
    enhanceFormInteractions();

    // Add social button animations
    animateSocialButtons();
});

/**
 * Initialize animations for authentication pages
 */
function initAuthAnimations() {
    // Animate card entry
    const authCard = document.querySelector('.auth-card');
    if (authCard) {
        authCard.style.opacity = '0';
        authCard.style.transform = 'translateY(20px)';

        setTimeout(() => {
            authCard.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            authCard.style.opacity = '1';
            authCard.style.transform = 'translateY(0)';
        }, 100);
    }

    // Add floating animation to decorative elements
    const decorations = document.querySelectorAll('.auth-decoration');
    decorations.forEach(decoration => {
        decoration.style.animation = 'float 6s ease-in-out infinite';
    });

    // Add subtle background animation
    const container = document.querySelector('.container');
    if (container) {
        // Create animated background
        const bgAnimation = document.createElement('div');
        bgAnimation.className = 'auth-bg-animation';

        // Add animated particles
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'auth-particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            particle.style.animationDuration = `${5 + Math.random() * 10}s`;
            bgAnimation.appendChild(particle);
        }

        // Insert at the beginning of container
        container.insertBefore(bgAnimation, container.firstChild);

        // Add CSS for background animation
        if (!document.getElementById('auth-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'auth-animation-styles';
            style.textContent = `
                .auth-bg-animation {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: -1;
                    overflow: hidden;
                }
                
                .auth-particle {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    background: linear-gradient(135deg, rgba(254, 66, 77, 0.2), rgba(255, 138, 128, 0.2));
                    border-radius: 50%;
                    animation: float-particle 10s linear infinite;
                    opacity: 0.5;
                }
                
                @keyframes float-particle {
                    0% {
                        transform: translateY(0) scale(1);
                        opacity: 0.5;
                    }
                    50% {
                        transform: translateY(-100px) scale(1.5);
                        opacity: 0.8;
                    }
                    100% {
                        transform: translateY(-200px) scale(1);
                        opacity: 0.5;
                    }
                }
                
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    background-color: rgba(255, 255, 255, 0.4);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                }
                
                @keyframes ripple {
                    to {
                        transform: scale(2.5);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

/**
 * Enhance form interactions with animations
 */
function enhanceFormInteractions() {
    // Add focus animations to form fields
    const formInputs = document.querySelectorAll('.auth-form .form-control');
    formInputs.forEach(input => {
        // Create and add label animation
        const formGroup = input.closest('.form-group');
        const label = formGroup.querySelector('label');

        if (label) {
            // Set initial state
            if (input.value) {
                label.classList.add('active');
            }

            // Add event listeners for animation
            input.addEventListener('focus', function () {
                label.classList.add('active', 'highlight');
            });

            input.addEventListener('blur', function () {
                label.classList.remove('highlight');
                if (!this.value) {
                    label.classList.remove('active');
                }
            });
        }

        // Add typing animation
        input.addEventListener('input', function () {
            this.classList.add('is-typing');
            clearTimeout(this.typingTimer);

            this.typingTimer = setTimeout(() => {
                this.classList.remove('is-typing');
            }, 1000);
        });
    });

    // Add password visibility toggle
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'password-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
        toggleBtn.title = 'Show password';

        // Insert after input
        input.parentNode.style.position = 'relative';
        input.parentNode.appendChild(toggleBtn);

        // Add toggle functionality
        toggleBtn.addEventListener('click', function () {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);

            // Update icon and title
            if (type === 'text') {
                this.innerHTML = '<i class="fas fa-eye-slash"></i>';
                this.title = 'Hide password';
            } else {
                this.innerHTML = '<i class="fas fa-eye"></i>';
                this.title = 'Show password';
            }

            // Focus back on input
            input.focus();
        });

        // Add CSS for password toggle
        if (!document.getElementById('password-toggle-styles')) {
            const style = document.createElement('style');
            style.id = 'password-toggle-styles';
            style.textContent = `
                .password-toggle {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: #6c757d;
                    cursor: pointer;
                    padding: 5px;
                    font-size: 0.9rem;
                    transition: all 0.3s ease;
                    z-index: 5;
                }
                
                .password-toggle:hover {
                    color: #fe424d;
                }
                
                input[type="password"], input[type="text"] {
                    padding-right: 40px;
                }
                
                .is-typing {
                    background-color: #fff !important;
                }
                
                /* Label animation */
                .form-group label {
                    transition: all 0.3s ease;
                }
                
                .form-group label.active {
                    transform: translateY(-5px) scale(0.85);
                    color: #fe424d;
                }
                
                .form-group label.highlight {
                    color: #fe424d;
                    font-weight: 700;
                }
            `;
            document.head.appendChild(style);
        }
    });
}

/**
 * Animate social login buttons
 */
function animateSocialButtons() {
    const socialBtns = document.querySelectorAll('.social-btn');

    socialBtns.forEach((btn, index) => {
        // Add hover effect
        btn.addEventListener('mouseenter', function (e) {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });

        btn.addEventListener('mouseleave', function (e) {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });

        // Add click effect
        btn.addEventListener('click', function () {
            this.classList.add('social-btn-clicked');

            setTimeout(() => {
                this.classList.remove('social-btn-clicked');
            }, 300);
        });
    });

    // Add CSS for social button animations
    if (!document.getElementById('social-btn-styles')) {
        const style = document.createElement('style');
        style.id = 'social-btn-styles';
        style.textContent = `
            .social-btn {
                transition: all 0.3s ease;
            }
            
            .social-btn-clicked {
                animation: socialBtnClick 0.3s forwards;
            }
            
            @keyframes socialBtnClick {
                0% { transform: scale(1); }
                50% { transform: scale(0.9); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
}