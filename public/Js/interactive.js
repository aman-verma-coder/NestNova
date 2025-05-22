/**
 * NestNova Interactive Features
 * Enhances user experience with animations, tooltips, and interactive elements
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize tooltips
    initTooltips();

    // Add animation effects
    addAnimationEffects();

    // Enhance form interactions
    enhanceFormInteractions();

    // Add notification animations
    setupNotificationAnimations();

    // Add interactive feedback on user actions
    setupInteractiveFeedback();
});

/**
 * Initialize Bootstrap tooltips and custom tooltips
 */
function initTooltips() {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // Add tooltip attributes to elements that need explanation
    addTooltipsToElements();
}

/**
 * Add tooltip attributes to elements that would benefit from additional explanation
 */
function addTooltipsToElements() {
    // Add tooltips to navigation items
    const navItems = document.querySelectorAll('.nav-link, .dropdown-item');
    navItems.forEach(item => {
        if (!item.hasAttribute('title') && item.textContent.trim() !== '') {
            item.setAttribute('data-bs-toggle', 'tooltip');
            item.setAttribute('data-bs-placement', 'bottom');
            item.setAttribute('title', `Navigate to ${item.textContent.trim()}`);
        }
    });

    // Add tooltips to form elements
    const formElements = document.querySelectorAll('input, select, textarea');
    formElements.forEach(element => {
        const label = element.labels?.[0]?.textContent || element.getAttribute('placeholder') || element.getAttribute('name');
        if (label && !element.hasAttribute('title')) {
            element.setAttribute('data-bs-toggle', 'tooltip');
            element.setAttribute('data-bs-placement', 'top');
            element.setAttribute('title', `Enter your ${label.toLowerCase()}`);
        }
    });

    // Initialize the newly added tooltips
    const newTooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const newTooltipList = [...newTooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

/**
 * Add animation effects to various elements
 */
function addAnimationEffects() {
    // Add enhanced fade-in effect to cards and listings with staggered animations
    const cards = document.querySelectorAll('.card, .listing-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + (index * 100)); // Stagger the animations
        
        // Add hover effects to cards
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
            this.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease';
            
            // Animate card image if exists
            const cardImage = this.querySelector('.card-img-top, .card-img');
            if (cardImage) {
                cardImage.style.transform = 'scale(1.05)';
                cardImage.style.transition = 'transform 0.5s ease';
            }
            
            // Animate card title if exists
            const cardTitle = this.querySelector('.card-title');
            if (cardTitle) {
                cardTitle.style.color = '#fe424d';
                cardTitle.style.transition = 'color 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
            
            // Reset card image
            const cardImage = this.querySelector('.card-img-top, .card-img');
            if (cardImage) {
                cardImage.style.transform = 'scale(1)';
            }
            
            // Reset card title
            const cardTitle = this.querySelector('.card-title');
            if (cardTitle) {
                cardTitle.style.color = '';
            }
        });
    });

    // Add enhanced hover and click effects to buttons with ripple effect
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        // Add hover effect
        button.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-3px) scale(1.05)';
            this.style.boxShadow = '0 7px 14px rgba(0,0,0,0.1)';
            if (this.classList.contains('btn-primary')) {
                this.style.boxShadow = '0 7px 14px rgba(254, 66, 77, 0.3)';
            }
            this.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease';
        });

        button.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1) translateY(0)';
            this.style.boxShadow = '';
        });
        
        // Add click effect with ripple
        button.addEventListener('mousedown', function(e) {
            // Scale down slightly on click
            this.style.transform = 'scale(0.95)';
            
            // Add ripple effect if not already present
            if (!this.querySelector('.ripple-effect')) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.className = 'ripple-effect';
                ripple.style.position = 'absolute';
                ripple.style.top = y + 'px';
                ripple.style.left = x + 'px';
                ripple.style.width = '1px';
                ripple.style.height = '1px';
                ripple.style.background = 'rgba(255, 255, 255, 0.7)';
                ripple.style.borderRadius = '50%';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple-animation 0.6s linear';
                ripple.style.pointerEvents = 'none';
                
                // Ensure button has position relative for absolute positioning of ripple
                if (getComputedStyle(this).position === 'static') {
                    this.style.position = 'relative';
                }
                this.style.overflow = 'hidden';
                
                this.appendChild(ripple);
                
                // Remove ripple after animation completes
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            }
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1.05) translateY(-3px)';
        });
    });

    // Add smooth scroll for anchor links with enhanced animation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#' && document.querySelector(targetId)) {
                e.preventDefault();
                
                // Add highlight effect to target element
                const targetElement = document.querySelector(targetId);
                const originalBackground = targetElement.style.backgroundColor;
                const originalTransition = targetElement.style.transition;
                
                // Scroll to element with enhanced smooth behavior
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Add subtle highlight effect after scrolling
                setTimeout(() => {
                    targetElement.style.transition = 'background-color 0.5s ease';
                    targetElement.style.backgroundColor = 'rgba(254, 66, 77, 0.1)';
                    
                    setTimeout(() => {
                        targetElement.style.backgroundColor = originalBackground;
                        setTimeout(() => {
                            targetElement.style.transition = originalTransition;
                        }, 500);
                    }, 1000);
                }, 500);
            }
        });
    });
    
    // Add animation to sections when they come into view
    const sections = document.querySelectorAll('section, .section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    sections.forEach(section => {
        section.classList.add('section-animated');
        sectionObserver.observe(section);
    });
    
    // Add CSS for animations
    if (!document.getElementById('animation-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            @keyframes ripple-animation {
                to {
                    transform: scale(70);
                    opacity: 0;
                }
            }
            
            .section-animated {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.8s ease, transform 0.8s ease;
            }
            
            .section-visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
                100% { transform: translateY(0px); }
            }
            
            .float-animation {
                animation: float 3s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add floating animation to selected elements
    const floatElements = document.querySelectorAll('.cta-button, .feature-icon, .highlight-element');
    floatElements.forEach(element => {
        element.classList.add('float-animation');
    });
}

/**
 * Enhance form interactions with real-time feedback
 */
function enhanceFormInteractions() {
    // Add real-time validation feedback
    const formInputs = document.querySelectorAll('input, textarea, select');

    formInputs.forEach(input => {
        // Skip submit buttons and hidden inputs
        if (input.type === 'submit' || input.type === 'hidden' || input.type === 'button') return;

        input.addEventListener('input', function () {
            validateInput(this);
        });

        input.addEventListener('blur', function () {
            validateInput(this, true);
        });
    });

    // Add password strength meter
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        // Create strength meter element
        const strengthMeter = document.createElement('div');
        strengthMeter.className = 'password-strength-meter mt-1';
        strengthMeter.innerHTML = `
            <div class="progress" style="height: 5px;">
                <div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <small class="form-text text-muted strength-text">Password strength: Too weak</small>
        `;

        // Insert after password input
        input.parentNode.insertBefore(strengthMeter, input.nextSibling);

        // Update strength meter on input
        input.addEventListener('input', function () {
            updatePasswordStrength(this);
        });
    });
}

/**
 * Validate form input and provide real-time feedback
 */
function validateInput(input, showMessage = false) {
    // Reset validation state
    input.classList.remove('is-valid', 'is-invalid');

    // Get any existing feedback element
    let feedbackElement = input.nextElementSibling;
    if (feedbackElement && !feedbackElement.classList.contains('invalid-feedback') && !feedbackElement.classList.contains('valid-feedback')) {
        feedbackElement = null;
    }

    // Remove existing feedback if it exists
    if (feedbackElement) {
        feedbackElement.remove();
    }

    // Skip validation if empty and not required
    if (input.value.trim() === '' && !input.hasAttribute('required')) {
        return;
    }

    // Validate based on input type
    let isValid = input.checkValidity();
    let message = '';

    if (input.type === 'email' && input.value.trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(input.value);
        message = isValid ? 'Valid email address' : 'Please enter a valid email address';
    } else if (input.type === 'tel' && input.value.trim() !== '') {
        const phoneRegex = /^\+?[0-9\s\-\(\)]{8,20}$/;
        isValid = phoneRegex.test(input.value);
        message = isValid ? 'Valid phone number' : 'Please enter a valid phone number';
    } else if (input.type === 'password' && input.value.trim() !== '') {
        // Password validation is handled by updatePasswordStrength
        return;
    } else if (input.value.trim() === '' && input.hasAttribute('required')) {
        isValid = false;
        message = `${input.labels?.[0]?.textContent || 'This field'} is required`;
    } else if (isValid) {
        message = 'Looks good!';
    } else {
        message = input.validationMessage || 'Please check this field';
    }

    // Add validation class
    input.classList.add(isValid ? 'is-valid' : 'is-invalid');

    // Add feedback message if needed
    if (showMessage) {
        const feedback = document.createElement('div');
        feedback.className = isValid ? 'valid-feedback' : 'invalid-feedback';
        feedback.textContent = message;
        input.parentNode.insertBefore(feedback, input.nextSibling);
    }
}

/**
 * Update password strength meter
 */
function updatePasswordStrength(input) {
    const password = input.value;
    let strength = 0;
    let feedback = 'Too weak';

    // Find the strength meter elements
    const meterContainer = input.nextElementSibling;
    if (!meterContainer || !meterContainer.classList.contains('password-strength-meter')) return;

    const progressBar = meterContainer.querySelector('.progress-bar');
    const strengthText = meterContainer.querySelector('.strength-text');

    // Calculate password strength
    if (password.length >= 8) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^A-Za-z0-9]/)) strength += 25;

    // Update progress bar
    progressBar.style.width = `${strength}%`;
    progressBar.setAttribute('aria-valuenow', strength);

    // Update color based on strength
    if (strength < 25) {
        progressBar.className = 'progress-bar bg-danger';
        feedback = 'Too weak';
    } else if (strength < 50) {
        progressBar.className = 'progress-bar bg-warning';
        feedback = 'Weak';
    } else if (strength < 75) {
        progressBar.className = 'progress-bar bg-info';
        feedback = 'Medium';
    } else {
        progressBar.className = 'progress-bar bg-success';
        feedback = 'Strong';
    }

    // Update feedback text
    strengthText.textContent = `Password strength: ${feedback}`;
}

/**
 * Setup notification animations
 */
function setupNotificationAnimations() {
    // Add animation to notification badges
    const notificationBadges = document.querySelectorAll('.badge');
    notificationBadges.forEach(badge => {
        if (badge.textContent.trim() !== '' && badge.textContent.trim() !== '0') {
            badge.classList.add('badge-animation');
            // Add pulse animation
            badge.style.animation = 'pulse 2s infinite';
        }
    });

    // Add animation to notification toasts
    const toastElList = document.querySelectorAll('.toast');
    const toastList = [...toastElList].map(toastEl => {
        // Add animation classes
        toastEl.classList.add('animated-toast');
        
        const toast = new bootstrap.Toast(toastEl, {
            autohide: true,
            delay: 5000
        });
        
        // Add entrance animation when shown
        toastEl.addEventListener('show.bs.toast', function() {
            this.style.transform = 'translateX(0)';
            this.style.opacity = '1';
        });
        
        // Add exit animation when hidden
        toastEl.addEventListener('hide.bs.toast', function() {
            this.style.transform = 'translateX(100%)';
            this.style.opacity = '0';
        });
        
        // Show toasts that have 'data-show-on-load' attribute
        if (toastEl.getAttribute('data-show-on-load') === 'true') {
            setTimeout(() => {
                toast.show();
            }, 500); // Delay for better user experience
        }
        
        return toast;
    });
    
    // Create a notification bell animation if it exists
    const notificationBell = document.querySelector('.notification-bell, .fa-bell');
    if (notificationBell) {
        notificationBell.classList.add('animated-icon');
        
        // Add shake animation when there are new notifications
        const hasNotifications = document.querySelector('.badge:not(:empty)');
        if (hasNotifications && hasNotifications.textContent.trim() !== '0') {
            notificationBell.style.animation = 'shake 1s ease 2';
        }
    }
}

/**
 * Setup interactive feedback on user actions
 */
function setupInteractiveFeedback() {
    // Add success feedback on form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function (e) {
            // Only add feedback for forms that don't navigate away from the page
            if (this.getAttribute('data-ajax-submit') === 'true') {
                e.preventDefault();
                
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                if (submitBtn) {
                    const originalText = submitBtn.innerHTML;
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
                    
                    // Simulate form submission (replace with actual AJAX call)
                    setTimeout(() => {
                        // Show success message with animation
                        const successAlert = document.createElement('div');
                        successAlert.className = 'alert alert-success mt-3';
                        successAlert.style.opacity = '0';
                        successAlert.style.transform = 'translateY(-10px)';
                        successAlert.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        successAlert.innerHTML = '<i class="fas fa-check-circle"></i> Your request has been submitted successfully!';
                        this.appendChild(successAlert);
                        
                        // Animate the success message
                        setTimeout(() => {
                            successAlert.style.opacity = '1';
                            successAlert.style.transform = 'translateY(0)';
                        }, 10);
                        
                        // Reset form
                        this.reset();
                        
                        // Reset button with animation
                        submitBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
                        submitBtn.classList.add('btn-success');
                        
                        setTimeout(() => {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = originalText;
                            submitBtn.classList.remove('btn-success');
                        }, 2000);
                        
                        // Remove success message after 5 seconds with fade out
                        setTimeout(() => {
                            successAlert.style.opacity = '0';
                            successAlert.style.transform = 'translateY(-10px)';
                            setTimeout(() => {
                                successAlert.remove();
                            }, 500);
                        }, 5000);
                    }, 1500);
                }
            }
        });
    });

    // Add confirmation dialogs for delete actions with custom modal instead of browser confirm
    document.querySelectorAll('[data-confirm]').forEach(element => {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            const confirmMessage = this.getAttribute('data-confirm');
            const originalHref = this.getAttribute('href');
            const originalOnClick = this.getAttribute('onclick');
            
            // Create custom confirmation modal
            const modalId = 'confirmModal' + Math.floor(Math.random() * 1000);
            const modal = document.createElement('div');
            modal.className = 'modal fade';
            modal.id = modalId;
            modal.setAttribute('tabindex', '-1');
            modal.setAttribute('aria-hidden', 'true');
            modal.innerHTML = `
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Confirm Action</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>${confirmMessage}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-danger confirm-action">Confirm</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Initialize and show modal
            const modalInstance = new bootstrap.Modal(modal);
            modalInstance.show();
            
            // Handle confirm action
            modal.querySelector('.confirm-action').addEventListener('click', function() {
                modalInstance.hide();
                if (originalHref && originalHref !== '#' && !originalHref.startsWith('javascript')) {
                    window.location.href = originalHref;
                } else if (originalOnClick) {
                    eval(originalOnClick);
                }
                
                // Remove modal after hiding
                modal.addEventListener('hidden.bs.modal', function() {
                    modal.remove();
                });
            });
        });
    });
}

// Add CSS for animations and effects
const style = document.createElement('style');
style.textContent = `
    /* Badge pulse animation */
    .badge-pulse {
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
        }
    }
    
    /* Ripple effect */
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple-effect {
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
    
    /* Smooth transitions for all elements */
    * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }
    
    /* Hover effects for cards */
    .card:hover, .listing-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    
    /* Form focus effects */
    .form-control:focus, .form-select:focus {
        box-shadow: 0 0 0 0.25rem rgba(254, 66, 77, 0.25);
        border-color: #fe424d;
    }
`;

document.head.appendChild(style);