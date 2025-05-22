/**
 * Navbar Interactive Features
 * Enhances the navbar with animations and interactive elements
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize navbar interactions
    initNavbarInteractions();

    // Setup navbar scroll effects
    setupNavbarScrollEffects();

    // Enhance dropdown animations
    enhanceDropdownAnimations();

    // Add advanced navbar animations
    addAdvancedNavbarAnimations();

    // Add search bar animation
    animateSearchBar();
});

/**
 * Initialize interactive elements in the navbar
 */
function initNavbarInteractions() {
    // Add hover effects to navbar links with enhanced animations
    const navLinks = document.querySelectorAll('.navbar .nav-link, .navbar .dropdown-item');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-2px)';
            this.style.color = '#fe424d';
            this.style.transition = 'transform 0.3s ease, color 0.3s ease';
        });

        link.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
            this.style.color = '';
        });
    });

    // Add pulse effect to notification icons with enhanced animations
    const notificationIcons = document.querySelectorAll('.navbar .fa-bell, .navbar .fa-envelope');
    notificationIcons.forEach(icon => {
        icon.classList.add('notification-icon');

        // Add interactive hover effect
        icon.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.2)';
            this.style.color = '#fe424d';
            this.style.transition = 'transform 0.3s ease, color 0.3s ease';
        });

        icon.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
            this.style.color = '';
        });

        // Add click animation
        icon.addEventListener('click', function () {
            this.style.transform = 'scale(0.8)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });

    // Add tooltips to navbar elements with enhanced animations
    const navbarElements = document.querySelectorAll('.navbar .nav-link, .navbar .btn');
    navbarElements.forEach(element => {
        if (!element.hasAttribute('title') && !element.hasAttribute('data-bs-original-title')) {
            const text = element.textContent.trim() || element.querySelector('i')?.className || 'Navigation';
            element.setAttribute('data-bs-toggle', 'tooltip');
            element.setAttribute('data-bs-placement', 'bottom');
            element.setAttribute('title', `${text}`);
        }
    });

    // Initialize tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // Add active state animation
    const activeNavItem = document.querySelector('.navbar .nav-item.active, .navbar .nav-link.active');
    if (activeNavItem) {
        activeNavItem.style.borderBottom = '2px solid #fe424d';
        activeNavItem.style.fontWeight = 'bold';
    }
}

/**
 * Setup navbar scroll effects
 */
function setupNavbarScrollEffects() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // Add scroll event listener
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Trigger scroll event on page load
    window.dispatchEvent(new Event('scroll'));
}

/**
 * Enhance dropdown animations with more interactive effects
 */
function enhanceDropdownAnimations() {
    // Add animation class to all dropdowns
    const dropdowns = document.querySelectorAll('.dropdown-menu');
    dropdowns.forEach(dropdown => {
        dropdown.classList.add('animated-dropdown');

        // Add staggered animation to dropdown items
        const dropdownItems = dropdown.querySelectorAll('.dropdown-item');
        dropdownItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-10px)';
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease, background-color 0.3s ease, padding-left 0.3s ease';
            item.style.transitionDelay = `${index * 0.05}s`;

            // Add hover effect
            item.addEventListener('mouseenter', function () {
                this.style.backgroundColor = 'rgba(254, 66, 77, 0.1)';
                this.style.paddingLeft = '1.5rem';
                this.style.color = '#fe424d';
            });

            item.addEventListener('mouseleave', function () {
                this.style.backgroundColor = '';
                this.style.paddingLeft = '';
                this.style.color = '';
            });
        });
    });

    // Add event listeners for dropdown animations
    const dropdownToggles = document.querySelectorAll('[data-bs-toggle="dropdown"]');
    dropdownToggles.forEach(toggle => {
        // Add hover effect to dropdown toggles
        toggle.addEventListener('mouseenter', function () {
            if (!this.classList.contains('show')) {
                const arrow = this.querySelector('.dropdown-toggle::after') || this.querySelector('.dropdown-arrow');
                if (arrow) {
                    arrow.style.transform = 'translateY(3px)';
                    arrow.style.transition = 'transform 0.3s ease';
                }
            }
        });

        toggle.addEventListener('mouseleave', function () {
            const arrow = this.querySelector('.dropdown-toggle::after') || this.querySelector('.dropdown-arrow');
            if (arrow) {
                arrow.style.transform = '';
            }
        });

        // Enhanced show animation
        toggle.addEventListener('show.bs.dropdown', function () {
            const dropdown = document.querySelector(`[aria-labelledby="${this.id}"]`);
            if (dropdown) {
                dropdown.style.opacity = '0';
                dropdown.style.transform = 'translateY(10px) scale(0.98)';
                dropdown.style.transition = 'opacity 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

                setTimeout(() => {
                    dropdown.style.opacity = '1';
                    dropdown.style.transform = 'translateY(0) scale(1)';

                    // Animate dropdown items with staggered delay
                    const dropdownItems = dropdown.querySelectorAll('.dropdown-item');
                    dropdownItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateX(0)';
                        }, 50 + (index * 50));
                    });
                }, 50);
            }
        });

        // Add hide animation
        toggle.addEventListener('hide.bs.dropdown', function () {
            const dropdown = document.querySelector(`[aria-labelledby="${this.id}"]`);
            if (dropdown) {
                dropdown.style.opacity = '0';
                dropdown.style.transform = 'translateY(10px)';

                // Reset dropdown items
                const dropdownItems = dropdown.querySelectorAll('.dropdown-item');
                dropdownItems.forEach(item => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(-10px)';
                });
            }
        });
    });

    // Add CSS for dropdown animations
    if (!document.getElementById('dropdown-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'dropdown-animation-styles';
        style.textContent = `
            .animated-dropdown {
                transition: opacity 0.3s ease, transform 0.3s ease;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                border-radius: 8px;
                border: none;
                overflow: hidden;
            }
            
            .dropdown-item:active {
                background-color: rgba(254, 66, 77, 0.2);
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Add advanced navbar animations
 */
function addAdvancedNavbarAnimations() {
    // Add animation to navbar brand/logo
    const navbarBrand = document.querySelector('.navbar-brand');
    if (navbarBrand) {
        // Add initial animation on page load
        navbarBrand.style.opacity = '0';
        navbarBrand.style.transform = 'translateX(-20px)';
        navbarBrand.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        setTimeout(() => {
            navbarBrand.style.opacity = '1';
            navbarBrand.style.transform = 'translateX(0)';
        }, 300);

        // Add hover animation
        navbarBrand.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.05)';
        });

        navbarBrand.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    }

    // Add staggered animation to navbar items
    const navItems = document.querySelectorAll('.navbar .nav-item');
    navItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(-10px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 300 + (index * 100)); // Stagger the animations
    });

    // Add animation to navbar buttons
    const navbarButtons = document.querySelectorAll('.navbar .btn');
    navbarButtons.forEach((button, index) => {
        button.style.opacity = '0';
        button.style.transform = 'translateY(-10px)';
        button.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        setTimeout(() => {
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        }, 600 + (index * 100)); // Appear after nav items

        // Add ripple effect to buttons
        button.classList.add('ripple-effect');

        button.addEventListener('mousedown', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Enhance hamburger menu animation
    const navbarToggler = document.querySelector('.navbar-toggler');
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function () {
            this.classList.toggle('toggler-active');
        });
    }
}

/**
 * Add enhanced search bar animation with interactive effects
 */
function animateSearchBar() {
    // Find search input in navbar
    const searchInput = document.querySelector('.navbar input[type="search"], .navbar input[type="text"].form-control');

    if (searchInput) {
        // Add search animation class
        searchInput.classList.add('search-input');

        // Store original width for expansion animation
        const originalWidth = searchInput.offsetWidth || 150;
        searchInput.style.transition = 'width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 0.3s ease, box-shadow 0.3s ease';

        // Add focus animation
        searchInput.addEventListener('focus', function () {
            this.style.borderColor = '#fe424d';
            this.style.width = (originalWidth * 1.2) + 'px';
            this.style.boxShadow = '0 0 0 0.2rem rgba(254, 66, 77, 0.25)';

            // Find search icon if it exists
            const searchIcon = this.parentElement.querySelector('i.fa-search, i.fa-magnifying-glass');
            if (searchIcon) {
                searchIcon.style.color = '#fe424d';
                searchIcon.style.transform = 'scale(1.2) rotate(90deg)';
                searchIcon.style.transition = 'color 0.3s ease, transform 0.3s ease';
                searchIcon.style.animation = 'pulse 1.5s infinite';
            }
        });

        searchInput.addEventListener('blur', function () {
            this.style.borderColor = '';
            this.style.width = originalWidth + 'px';
            this.style.boxShadow = '';

            // Reset search icon
            const searchIcon = this.parentElement.querySelector('i.fa-search, i.fa-magnifying-glass');
            if (searchIcon) {
                searchIcon.style.color = '';
                searchIcon.style.transform = 'scale(1) rotate(0)';
                searchIcon.style.animation = '';
            }
        });

        // Add typing animation effect
        searchInput.addEventListener('input', function () {
            if (this.value) {
                // Create ripple effect on typing
                const searchParent = this.parentElement;
                const ripple = document.createElement('span');
                ripple.className = 'search-ripple';
                ripple.style.position = 'absolute';
                ripple.style.top = '50%';
                ripple.style.right = '40px';
                ripple.style.width = '4px';
                ripple.style.height = '4px';
                ripple.style.background = '#fe424d';
                ripple.style.borderRadius = '50%';
                ripple.style.transform = 'translateY(-50%)';
                ripple.style.opacity = '0.8';
                ripple.style.animation = 'search-ripple 0.6s ease-out';

                searchParent.appendChild(ripple);

                // Remove ripple after animation
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            }
        });

        // Add placeholder animation
        const originalPlaceholder = searchInput.getAttribute('placeholder') || 'Search';

        searchInput.addEventListener('focus', function () {
            this.setAttribute('placeholder', 'Type to search...');
        });

        searchInput.addEventListener('blur', function () {
            this.setAttribute('placeholder', originalPlaceholder);
        });

        // Add CSS for search animations
        if (!document.getElementById('search-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'search-animation-styles';
            style.textContent = `
                @keyframes search-ripple {
                    0% { transform: translateY(-50%) scale(1); opacity: 0.8; }
                    100% { transform: translateY(-50%) scale(20); opacity: 0; }
                }
                
                .search-input::placeholder {
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }
                
                .search-input:focus::placeholder {
                    opacity: 0.7;
                    transform: translateX(5px);
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Add CSS for navbar animations with enhanced effects
const style = document.createElement('style');
style.textContent = `
    /* Navbar scroll effect */
    .navbar {
        transition: padding 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
    }
    
    .navbar.scrolled {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        background-color: rgba(255, 255, 255, 0.95) !important;
    }
    
    /* Navbar link hover effects */
    .navbar .nav-link, .navbar .dropdown-item {
        transition: transform 0.3s ease, color 0.3s ease, background-color 0.3s ease;
        position: relative;
    }
    
    .navbar .nav-link::after {
        content: '';
        position: absolute;
        width: 0;
        height: 2px;
        bottom: 0;
        left: 50%;
        background-color: #fe424d;
        transition: width 0.3s ease, left 0.3s ease;
    }
    
    .navbar .nav-link:hover::after {
        width: 100%;
        left: 0;
    }
    
    /* Notification icon pulse */
    .notification-icon {
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
    
    /* Dropdown animation */
    .animated-dropdown {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    /* Brand logo animation */
    .navbar-brand {
        transition: transform 0.3s ease, opacity 0.3s ease;
    }
    
    .navbar-brand:hover {
        transform: scale(1.05);
    }
    
    /* Search bar animation */
    .navbar .search-input {
        transition: width 0.5s ease, background-color 0.3s ease, box-shadow 0.3s ease;
        width: 150px;
    }
    
    .navbar .search-input:focus {
        width: 200px;
        box-shadow: 0 0 10px rgba(254, 66, 77, 0.2);
        background-color: #fff;
    }
    
    /* Mobile menu animation */
    .navbar-collapse {
        transition: transform 0.4s ease;
    }
    
    .navbar-collapse.collapsing {
        transform: translateY(-10px);
    }
    
    .navbar-collapse.show {
        transform: translateY(0);
    }
    
    /* Hamburger animation */
    .navbar-toggler {
        transition: transform 0.3s ease;
    }
    
    .navbar-toggler:hover {
        transform: rotate(90deg);
    }
    
    /* Animated underline for active link */
    .navbar .nav-link.active::after {
        width: 100%;
        left: 0;
    }
    
    /* Navbar button animation */
    .navbar .btn {
        transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    
    .navbar .btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(254, 66, 77, 0.3);
    }
    
    .navbar .btn::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.2);
        transform: translateX(-100%);
        transition: transform 0.3s ease;
    }
    
    .navbar .btn:hover::after {
        transform: translateX(100%);
    }
    
    /* Ripple effect */
    .ripple-effect {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.4);
        width: 100px;
        height: 100px;
        margin-top: -50px;
        margin-left: -50px;
        animation: ripple 0.6s linear;
        transform: scale(0);
        pointer-events: none;
    }
    
    @keyframes ripple {
        to { transform: scale(4); opacity: 0; }
    }
    
    /* Toggler animation */
    .toggler-active .navbar-toggler-icon {
        transform: rotate(90deg);
    }
`;

document.head.appendChild(style);