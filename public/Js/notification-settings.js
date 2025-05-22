/**
 * Notification Settings Interactive Features
 * Enhances the notification settings page with interactive previews
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize notification toggle interactions
    initNotificationToggles();

    // Add form submission feedback
    setupFormSubmissionFeedback();
});

/**
 * Initialize interactive notification toggles with previews
 */
function initNotificationToggles() {
    const toggles = document.querySelectorAll('.notification-toggle input[type="checkbox"]');

    toggles.forEach(toggle => {
        // Set initial state
        const toggleContainer = toggle.closest('.notification-toggle');
        const preview = toggleContainer.querySelector('.notification-preview');

        if (toggle.checked) {
            preview.style.display = 'block';
            // Animate in
            setTimeout(() => {
                preview.style.opacity = '1';
            }, 10);
        } else {
            preview.style.opacity = '0';
            preview.style.display = 'none';
        }

        // Add hover effect to show preview temporarily
        toggleContainer.addEventListener('mouseenter', function () {
            if (!toggle.checked) {
                preview.style.display = 'block';
                setTimeout(() => {
                    preview.style.opacity = '0.7';
                }, 10);
            }
        });

        toggleContainer.addEventListener('mouseleave', function () {
            if (!toggle.checked) {
                preview.style.opacity = '0';
                setTimeout(() => {
                    preview.style.display = 'none';
                }, 300);
            }
        });

        // Toggle preview on checkbox change
        toggle.addEventListener('change', function () {
            if (this.checked) {
                preview.style.display = 'block';
                setTimeout(() => {
                    preview.style.opacity = '1';
                }, 10);

                // Add a brief animation to the icon
                const icon = toggleContainer.querySelector('.notification-icon');
                icon.classList.add('animate-bounce');
                setTimeout(() => {
                    icon.classList.remove('animate-bounce');
                }, 1000);
            } else {
                preview.style.opacity = '0';
                setTimeout(() => {
                    preview.style.display = 'none';
                }, 300);
            }
        });
    });

    // Add CSS for the animations
    const style = document.createElement('style');
    style.textContent = `
        .notification-preview {
            transition: opacity 0.3s ease;
            opacity: 0;
        }
        
        .animate-bounce {
            animation: bounce 0.5s ease;
        }
        
        @keyframes bounce {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-10px);
            }
        }
        
        .notification-icon {
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Add interactive feedback when the notification settings form is submitted
 */
function setupFormSubmissionFeedback() {
    const form = document.querySelector('form');

    if (form) {
        form.addEventListener('submit', function (e) {
            // Don't prevent the actual submission

            // Find the submit button
            const submitButton = this.querySelector('button[type="submit"]');

            if (submitButton) {
                // Store original text
                const originalText = submitButton.innerHTML;

                // Update button to show loading state
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';

                // Create a visual feedback element
                const feedback = document.createElement('div');
                feedback.className = 'alert alert-success mt-3';
                feedback.innerHTML = '<i class="fas fa-check-circle"></i> Your notification preferences are being saved...';
                feedback.style.opacity = '0';
                feedback.style.transition = 'opacity 0.3s ease';

                // Insert after the form
                form.parentNode.insertBefore(feedback, form.nextSibling);

                // Fade in the feedback
                setTimeout(() => {
                    feedback.style.opacity = '1';
                }, 10);

                // Reset button after 10 seconds in case of network issues
                setTimeout(() => {
                    if (submitButton.disabled) {
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalText;
                    }
                }, 10000);
            }
        });
    }
}