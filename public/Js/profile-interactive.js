/**
 * Profile Interactive Features
 * Enhances the user profile experience with interactive elements and animations
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize profile interactions
    initProfileInteractions();

    // Setup profile image upload preview with enhanced animations
    setupProfileImageUpload();

    // Add form validation with interactive feedback
    addProfileFormValidation();

    // Add profile card animations
    addProfileCardAnimations();

    // Add tab switching animations
    enhanceTabSwitching();

    // Add achievement badge animations
    animateAchievementBadges();
});

/**
 * Initialize interactive elements on the profile page
 */
function initProfileInteractions() {
    // Add animation to profile sections with enhanced effects
    const profileSections = document.querySelectorAll('.card, .profile-section');
    profileSections.forEach((section, index) => {
        section.classList.add('page-transition', 'animate-on-scroll', 'fade-up-animation');
        section.style.animationDelay = `${index * 0.1}s`;
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 100 + (index * 150)); // Staggered animation
    });

    // Add interactive effects to edit profile button with enhanced animations
    const editProfileBtn = document.querySelector('[data-bs-target="#editProfileModal"]');
    if (editProfileBtn) {
        editProfileBtn.classList.add('animated-button');

        editProfileBtn.addEventListener('mouseenter', function () {
            this.innerHTML = '<i class="fas fa-edit me-2"></i>Edit Now';
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 5px 15px rgba(254, 66, 77, 0.3)';
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        });

        editProfileBtn.addEventListener('mouseleave', function () {
            this.innerHTML = '<i class="fas fa-edit me-2"></i>Edit Profile';
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });

        // Add ripple effect
        editProfileBtn.addEventListener('mousedown', function (e) {
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
    }

    // Add tooltips to profile elements with enhanced animations
    const profileElements = document.querySelectorAll('.profile-info span, .profile-stats .stat');
    profileElements.forEach(element => {
        if (!element.hasAttribute('title')) {
            element.setAttribute('data-bs-toggle', 'tooltip');
            element.setAttribute('data-bs-placement', 'top');
            element.setAttribute('title', element.textContent.trim());
        }

        // Add hover effect
        element.addEventListener('mouseenter', function () {
            this.style.color = '#fe424d';
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'color 0.3s ease, transform 0.3s ease';
        });

        element.addEventListener('mouseleave', function () {
            this.style.color = '';
            this.style.transform = 'translateY(0)';
        });
    });

    // Initialize tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // Add animation to profile header
    const profileHeader = document.querySelector('.profile-header, .user-header');
    if (profileHeader) {
        profileHeader.style.opacity = '0';
        profileHeader.style.transform = 'translateY(-20px)';
        profileHeader.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

        setTimeout(() => {
            profileHeader.style.opacity = '1';
            profileHeader.style.transform = 'translateY(0)';
        }, 100);
    }
}

/**
 * Setup profile image upload with enhanced animations and interactive feedback
 */
function setupProfileImageUpload() {
    const avatarInput = document.querySelector('#avatar');
    if (!avatarInput) return;

    // Add visual cue for drag and drop
    const uploadArea = avatarInput.closest('.form-group, .mb-3');
    if (uploadArea) {
        uploadArea.classList.add('upload-area');

        // Add drag and drop support
        uploadArea.addEventListener('dragover', function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.add('upload-area-active');
        });

        uploadArea.addEventListener('dragleave', function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.remove('upload-area-active');
        });

        uploadArea.addEventListener('drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.remove('upload-area-active');

            if (e.dataTransfer.files.length) {
                avatarInput.files = e.dataTransfer.files;
                // Trigger change event
                const event = new Event('change', { bubbles: true });
                avatarInput.dispatchEvent(event);
            }
        });

        // Add visual cue
        const dropHint = document.createElement('div');
        dropHint.className = 'drop-hint';
        dropHint.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Drag & drop your photo here';
        uploadArea.appendChild(dropHint);
    }

    // Add file selection animation
    avatarInput.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;

        // Check if file is an image
        if (!file.type.match('image.*')) {
            // Show error with animation
            const errorMsg = document.createElement('div');
            errorMsg.className = 'alert alert-danger mt-2 animate__animated animate__shakeX';
            errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please select an image file';
            this.parentNode.appendChild(errorMsg);

            // Remove after 3 seconds
            setTimeout(() => {
                errorMsg.classList.add('animate__fadeOut');
                setTimeout(() => errorMsg.remove(), 500);
            }, 3000);

            this.value = '';
            return;
        }

        // Create preview container if it doesn't exist
        let previewContainer = document.querySelector('.avatar-preview');
        if (!previewContainer) {
            previewContainer = document.createElement('div');
            previewContainer.className = 'avatar-preview mt-3';
            this.parentNode.appendChild(previewContainer);
        } else {
            // Add fade out animation before clearing
            previewContainer.classList.add('fade-out');
            setTimeout(() => {
                previewContainer.innerHTML = '';
                previewContainer.classList.remove('fade-out');
            }, 300);
            return; // Exit and let the timeout callback handle the rest
        }

        // Create image preview with animation
        const img = document.createElement('img');
        img.className = 'img-thumbnail profile-image animate__animated animate__fadeIn';
        img.style.maxWidth = '150px';
        img.style.maxHeight = '150px';
        img.style.opacity = '0';
        previewContainer.appendChild(img);

        // Show loading spinner with animation
        const spinner = document.createElement('div');
        spinner.className = 'spinner-grow text-primary';
        spinner.setAttribute('role', 'status');
        spinner.innerHTML = '<span class="visually-hidden">Loading...</span>';
        previewContainer.appendChild(spinner);

        // Add file info
        const fileInfo = document.createElement('div');
        fileInfo.className = 'file-info mt-2 animate__animated animate__fadeIn';
        fileInfo.innerHTML = `<small><i class="fas fa-file-image"></i> ${file.name} (${Math.round(file.size / 1024)} KB)</small>`;
        previewContainer.appendChild(fileInfo);

        // Read and display the image
        const reader = new FileReader();
        reader.onload = function (e) {
            img.src = e.target.result;
            // Remove spinner and animate image when loaded
            img.onload = function () {
                spinner.classList.add('animate__animated', 'animate__fadeOut');
                setTimeout(() => {
                    spinner.remove();
                    img.style.opacity = '1';
                    img.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        img.style.transform = 'scale(1)';
                        img.style.transition = 'transform 0.3s ease';
                    }, 50);

                    // Add success message with animation
                    const successMsg = document.createElement('div');
                    successMsg.className = 'text-success mt-2 animate__animated animate__fadeIn';
                    successMsg.innerHTML = '<i class="fas fa-check-circle"></i> Image ready to upload';
                    previewContainer.appendChild(successMsg);

                    // Add remove button
                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'btn btn-sm btn-outline-danger mt-2 animate__animated animate__fadeIn';
                    removeBtn.innerHTML = '<i class="fas fa-times"></i> Remove';
                    removeBtn.addEventListener('click', function () {
                        avatarInput.value = '';
                        previewContainer.classList.add('animate__animated', 'animate__fadeOut');
                        setTimeout(() => previewContainer.remove(), 500);
                    });
                    previewContainer.appendChild(removeBtn);
                }, 500);
            };
        };
        reader.readAsDataURL(file);
    });

    // Add CSS for upload animations
    const uploadStyle = document.createElement('style');
    uploadStyle.textContent = `
        .upload-area {
            position: relative;
            border: 2px dashed #dee2e6;
            border-radius: 5px;
            padding: 20px;
            text-align: center;
            transition: all 0.3s ease;
        }
        
        .upload-area-active {
            border-color: #fe424d;
            background-color: rgba(254, 66, 77, 0.05);
        }
        
        .drop-hint {
            color: #6c757d;
            margin-top: 10px;
            font-size: 0.9rem;
        }
        
        .upload-area-active .drop-hint {
            color: #fe424d;
            transform: scale(1.1);
            transition: transform 0.3s ease, color 0.3s ease;
        }
        
        .fade-out {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .file-info {
            color: #6c757d;
            font-size: 0.85rem;
        }
        
        /* Animation classes */
        .animate__animated {
            animation-duration: 0.5s;
        }
        
        .animate__fadeIn {
            animation-name: fadeIn;
        }
        
        .animate__fadeOut {
            animation-name: fadeOut;
        }
        
        .animate__shakeX {
            animation-name: shakeX;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @keyframes shakeX {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(uploadStyle);
}

/**
 * Add form validation with interactive feedback
 */
function addProfileFormValidation() {
    const profileForm = document.querySelector('#editProfileModal form');
    if (!profileForm) return;

    // Add validation classes to form with enhanced visual feedback
    profileForm.classList.add('needs-validation');

    // Add floating labels effect
    const formGroups = profileForm.querySelectorAll('.form-group, .mb-3');
    formGroups.forEach(group => {
        const input = group.querySelector('input:not([type="file"]), textarea, select');
        const label = group.querySelector('label');

        if (input && label && !group.classList.contains('form-floating')) {
            group.classList.add('form-floating-animation');

            // Position the label based on input state
            if (input.value) {
                label.classList.add('active');
            }

            // Add focus and blur events for label animation
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
    });

    // Add validation to each input with enhanced feedback
    const inputs = profileForm.querySelectorAll('input:not([type="file"]), textarea, select');
    inputs.forEach(input => {
        // Skip submit buttons
        if (input.type === 'submit') return;

        // Add strength meter for password fields
        if (input.type === 'password') {
            addPasswordStrengthMeter(input);
        }

        // Add character counter for text areas and some inputs
        if (input.tagName === 'TEXTAREA' || input.id === 'bio' || input.id === 'description') {
            addCharacterCounter(input);
        }

        // Add validation on input with debounce for better performance
        let debounceTimer;
        input.addEventListener('input', function () {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                validateInput(this);
            }, 300);
        });

        // Add validation on blur
        input.addEventListener('blur', function () {
            validateInput(this, true);
        });

        // Add visual feedback on focus
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('input-focused');
        });

        input.addEventListener('blur', function () {
            this.parentElement.classList.remove('input-focused');
        });
    });

    // Add submit handler with enhanced feedback
    profileForm.addEventListener('submit', function (e) {
        if (!this.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();

            // Show validation messages with staggered animation
            inputs.forEach((input, index) => {
                setTimeout(() => {
                    validateInput(input, true);

                    // Add shake animation to invalid fields
                    if (!input.validity.valid) {
                        input.classList.add('shake-animation');
                        setTimeout(() => {
                            input.classList.remove('shake-animation');
                        }, 500);
                    }
                }, index * 50);
            });

            // Show error message with animation
            const errorAlert = document.createElement('div');
            errorAlert.className = 'alert alert-danger mt-3';
            errorAlert.style.opacity = '0';
            errorAlert.style.transform = 'translateY(-10px)';
            errorAlert.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            errorAlert.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please fix the errors in the form';
            this.prepend(errorAlert);

            // Scroll to first error with smooth animation
            const firstError = this.querySelector('.is-invalid');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }

            // Animate in the error message
            setTimeout(() => {
                errorAlert.style.opacity = '1';
                errorAlert.style.transform = 'translateY(0)';
            }, 10);

            // Remove error message after 5 seconds with fade out animation
            setTimeout(() => {
                errorAlert.style.opacity = '0';
                errorAlert.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    errorAlert.remove();
                }, 300);
            }, 5000);
        } else {
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'alert alert-success mt-3';
            successMsg.style.opacity = '0';
            successMsg.style.transform = 'translateY(-10px)';
            successMsg.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            successMsg.innerHTML = '<i class="fas fa-check-circle"></i> Form is valid! Submitting...';
            this.prepend(successMsg);

            setTimeout(() => {
                successMsg.style.opacity = '1';
                successMsg.style.transform = 'translateY(0)';
            }, 10);

            // Show loading state on submit button with animation
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';
                submitBtn.classList.add('btn-progress');

                // Reset button after 10 seconds in case of network issues
                setTimeout(() => {
                    if (submitBtn.disabled) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                        submitBtn.classList.remove('btn-progress');

                        // Show timeout message
                        const timeoutMsg = document.createElement('div');
                        timeoutMsg.className = 'alert alert-warning mt-3';
                        timeoutMsg.innerHTML = '<i class="fas fa-exclamation-triangle"></i> The request is taking longer than expected. Please try again.';
                        this.prepend(timeoutMsg);

                        // Remove timeout message after 5 seconds
                        setTimeout(() => {
                            timeoutMsg.remove();
                        }, 5000);
                    }
                }, 10000);
            }
        }
    });

    // Add CSS for form validation animations
    const formStyle = document.createElement('style');
    formStyle.textContent = `
        /* Floating label animation */
        .form-floating-animation {
            position: relative;
            margin-bottom: 1.5rem;
        }
        
        .form-floating-animation label {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            transition: all 0.3s ease;
            pointer-events: none;
            color: #6c757d;
            margin-bottom: 0;
        }
        
        .form-floating-animation textarea ~ label {
            top: 25px;
        }
        
        .form-floating-animation label.active {
            top: 0;
            font-size: 0.85rem;
            transform: translateY(-50%);
            background-color: white;
            padding: 0 5px;
            z-index: 1;
        }
        
        .form-floating-animation label.highlight {
            color: #fe424d;
        }
        
        /* Input focus effect */
        .input-focused {
            box-shadow: 0 0 0 3px rgba(254, 66, 77, 0.1);
            border-radius: 5px;
        }
        
        /* Shake animation for invalid fields */
        .shake-animation {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        @keyframes shake {
            10%, 90% { transform: translateX(-1px); }
            20%, 80% { transform: translateX(2px); }
            30%, 50%, 70% { transform: translateX(-4px); }
            40%, 60% { transform: translateX(4px); }
        }
        
        /* Submit button progress animation */
        .btn-progress {
            position: relative;
            overflow: hidden;
        }
        
        .btn-progress:before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            animation: progress 1.5s infinite linear;
        }
        
        @keyframes progress {
            to { left: 100%; }
        }
        
        /* Character counter */
        .character-counter {
            position: absolute;
            right: 10px;
            bottom: -20px;
            font-size: 0.75rem;
            color: #6c757d;
            transition: color 0.3s ease;
        }
        
        .character-counter.warning {
            color: #ffc107;
        }
        
        .character-counter.danger {
            color: #dc3545;
        }
        
        /* Password strength meter */
        .password-strength-meter {
            height: 5px;
            background-color: #e9ecef;
            margin-top: 5px;
            border-radius: 3px;
            overflow: hidden;
            transition: height 0.3s ease;
        }
        
        .password-strength-meter.active {
            height: 8px;
        }
        
        .password-strength-meter .strength-value {
            height: 100%;
            width: 0;
            transition: width 0.5s ease, background-color 0.5s ease;
        }
        
        .password-strength-meter .strength-text {
            font-size: 0.75rem;
            margin-top: 5px;
            text-align: right;
            transition: color 0.3s ease;
        }
    `;
    document.head.appendChild(formStyle);
}

/**
 * Add a character counter to text inputs
 */
function addCharacterCounter(input) {
    // Get max length attribute or set default
    const maxLength = input.getAttribute('maxlength') || 500;
    input.setAttribute('maxlength', maxLength);

    // Create counter element
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.textContent = `0/${maxLength}`;
    input.parentNode.style.position = 'relative';
    input.parentNode.appendChild(counter);

    // Update counter on input
    input.addEventListener('input', function () {
        const remaining = maxLength - this.value.length;
        const percentage = (this.value.length / maxLength) * 100;

        counter.textContent = `${this.value.length}/${maxLength}`;

        // Add warning classes based on usage
        counter.classList.remove('warning', 'danger');
        if (percentage > 80) {
            counter.classList.add('warning');
        }
        if (percentage > 90) {
            counter.classList.add('danger');
        }

        // Add animation when approaching limit
        if (percentage > 95) {
            counter.style.fontWeight = 'bold';
            counter.style.transform = 'scale(1.1)';
            counter.style.transition = 'transform 0.3s ease, font-weight 0.3s ease';
        } else {
            counter.style.fontWeight = '';
            counter.style.transform = '';
        }
    });

    // Trigger input event to initialize counter
    const event = new Event('input');
    input.dispatchEvent(event);
}

/**
 * Add a password strength meter
 */
function addPasswordStrengthMeter(input) {
    // Create meter container
    const meterContainer = document.createElement('div');
    meterContainer.className = 'password-strength-meter';
    input.parentNode.appendChild(meterContainer);

    // Create strength value bar
    const strengthValue = document.createElement('div');
    strengthValue.className = 'strength-value';
    meterContainer.appendChild(strengthValue);

    // Create strength text
    const strengthText = document.createElement('div');
    strengthText.className = 'strength-text';
    strengthText.textContent = 'Password strength';
    meterContainer.appendChild(strengthText);

    // Add input event to check password strength
    input.addEventListener('input', function () {
        const password = this.value;
        let strength = 0;
        let feedback = '';

        if (password.length > 0) {
            meterContainer.classList.add('active');

            // Check password strength
            if (password.length >= 8) strength += 25;
            if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
            if (password.match(/\d/)) strength += 25;
            if (password.match(/[^a-zA-Z\d]/)) strength += 25;

            // Set feedback text
            if (strength <= 25) {
                feedback = 'Weak';
                strengthValue.style.backgroundColor = '#dc3545';
                strengthText.style.color = '#dc3545';
            } else if (strength <= 50) {
                feedback = 'Fair';
                strengthValue.style.backgroundColor = '#ffc107';
                strengthText.style.color = '#ffc107';
            } else if (strength <= 75) {
                feedback = 'Good';
                strengthValue.style.backgroundColor = '#17a2b8';
                strengthText.style.color = '#17a2b8';
            } else {
                feedback = 'Strong';
                strengthValue.style.backgroundColor = '#28a745';
                strengthText.style.color = '#28a745';
            }

            strengthText.textContent = feedback;
        } else {
            meterContainer.classList.remove('active');
            strengthText.textContent = 'Password strength';
            strengthText.style.color = '';
        }

        // Animate the strength value
        strengthValue.style.width = strength + '%';
    });

    // Add focus event to enhance meter visibility
    input.addEventListener('focus', function () {
        meterContainer.style.height = '8px';
    });

    input.addEventListener('blur', function () {
        if (!this.value) {
            meterContainer.style.height = '';
        }
    });
}

/**
 * Validate a form input and provide real-time feedback
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
    } else if (input.id === 'username' && input.value.trim() !== '') {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        isValid = usernameRegex.test(input.value);
        message = isValid ? 'Valid username' : 'Username must be 3-20 characters and can only contain letters, numbers, and underscores';
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

// Add CSS for profile page animations
const style = document.createElement('style');
style.textContent = `
    /* Profile image hover effect */
    .profile-image {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .profile-image:hover {
        transform: scale(1.05);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    
    /* Profile section animations */
    .page-transition {
        animation: fadeIn 0.5s ease forwards;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Button hover effects */
    .btn {
        transition: transform 0.2s ease, background-color 0.3s ease;
    }
    
    .btn:hover {
        transform: translateY(-2px);
    }
    
    /* Form focus effects */
    .form-control:focus {
        border-color: #fe424d;
        box-shadow: 0 0 0 0.25rem rgba(254, 66, 77, 0.25);
    }
    
    /* Avatar preview animation */
    .avatar-preview img {
        animation: fadeIn 0.5s ease;
    }
    
    /* Ripple effect for buttons */
    .animated-button {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.7);
        width: 100px;
        height: 100px;
        margin-top: -50px;
        margin-left: -50px;
        animation: ripple 0.6s linear;
        transform: scale(0);
        opacity: 1;
    }
    
    @keyframes ripple {
        to {
            transform: scale(2.5);
            opacity: 0;
        }
    }
    
    /* Hover effect for cards */
    .hover-effect {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .hover-effect:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    
    /* Tab transitions */
    .tab-pane {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
`;

document.head.appendChild(style);

/**
 * Add animations to profile cards
 */
function addProfileCardAnimations() {
    // Add hover effects to profile cards
    const profileCards = document.querySelectorAll('.profile-card, .user-card, .booking-card, .review-card');
    profileCards.forEach(card => {
        card.classList.add('hover-effect');

        // Add tilt effect on mouse move
        card.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const tiltX = (y - centerY) / 20;
            const tiltY = (centerX - x) / 20;

            this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            this.style.transition = 'none';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            this.style.transition = 'transform 0.5s ease';
        });
    });

    // Add animation to profile stats
    const statItems = document.querySelectorAll('.stat-item, .profile-stat');
    statItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 500 + (index * 100)); // Appear after profile sections
    });

    // Add animation to profile actions
    const actionButtons = document.querySelectorAll('.profile-actions .btn, .user-actions .btn');
    actionButtons.forEach((button, index) => {
        button.style.opacity = '0';
        button.style.transform = 'translateX(-20px)';
        button.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        setTimeout(() => {
            button.style.opacity = '1';
            button.style.transform = 'translateX(0)';
        }, 800 + (index * 100)); // Appear after stats
    });
}

/**
 * Add interactive stats counters with enhanced animations
 */
function addStatsCounters() {
    // Animate numbers in stats with enhanced visual effects
    const statNumbers = document.querySelectorAll('.stat-number, .profile-stat-value');
    statNumbers.forEach(number => {
        const finalValue = parseInt(number.textContent);
        if (!isNaN(finalValue)) {
            // Start from zero
            number.textContent = '0';

            // Create intersection observer to start animation when visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Add highlight effect before animation starts
                        number.style.color = '#fe424d';
                        number.style.transform = 'scale(1.1)';

                        setTimeout(() => {
                            // Animate the number with easing
                            let currentValue = 0;
                            const duration = 2000; // ms
                            const startTime = performance.now();
                            const endTime = startTime + duration;

                            const counter = requestAnimationFrame(function updateCounter(currentTime) {
                                const elapsedTime = currentTime - startTime;
                                const progress = Math.min(elapsedTime / duration, 1);

                                // Use easeOutExpo for smoother animation
                                const easedProgress = 1 - Math.pow(1 - progress, 3);
                                currentValue = Math.floor(easedProgress * finalValue);

                                number.textContent = currentValue.toLocaleString();

                                if (progress < 1) {
                                    requestAnimationFrame(updateCounter);
                                } else {
                                    number.textContent = finalValue.toLocaleString();

                                    // Reset styles with slight delay
                                    setTimeout(() => {
                                        number.style.color = '';
                                        number.style.transform = 'scale(1)';
                                        number.style.transition = 'color 0.5s ease, transform 0.5s ease';
                                    }, 300);
                                }
                            });
                        }, 300);

                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5, rootMargin: '0px 0px -50px 0px' });

            observer.observe(number);
        }
    });
}

/**
 * Add animation to achievement badges on the profile page
 */
function animateAchievementBadges() {
    // Find achievement badges
    const badges = document.querySelectorAll('.achievement-badge, .profile-badge, .award-badge');
    if (badges.length === 0) return;

    // Add CSS for badge animations
    const badgeStyle = document.createElement('style');
    badgeStyle.textContent = `
        .achievement-badge, .profile-badge, .award-badge {
            position: relative;
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
            transform-origin: center;
        }
        
        .achievement-badge:hover, .profile-badge:hover, .award-badge:hover {
            transform: scale(1.1) rotate(5deg);
            z-index: 10;
        }
        
        .achievement-badge.unlocked, .profile-badge.unlocked, .award-badge.unlocked {
            filter: grayscale(0);
        }
        
        .achievement-badge.locked, .profile-badge.locked, .award-badge.locked {
            filter: grayscale(0.8);
            opacity: 0.7;
        }
        
        .badge-glow {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 50%;
            box-shadow: 0 0 15px rgba(254, 66, 77, 0.7);
            opacity: 0;
            transition: opacity 0.5s ease;
            pointer-events: none;
        }
        
        .achievement-badge:hover .badge-glow, 
        .profile-badge:hover .badge-glow, 
        .award-badge:hover .badge-glow {
            opacity: 1;
        }
        
        .badge-tooltip {
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(10px);
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 0.8rem;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease;
            pointer-events: none;
            z-index: 100;
        }
        
        .badge-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
        }
        
        .achievement-badge:hover .badge-tooltip, 
        .profile-badge:hover .badge-tooltip, 
        .award-badge:hover .badge-tooltip {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(0);
        }
        
        .badge-animation {
            animation: badge-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        
        @keyframes badge-pop {
            0% {
                opacity: 0;
                transform: scale(0.5) translateY(20px);
            }
            70% {
                transform: scale(1.2) translateY(-5px);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        .badge-shine {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%);
            background-size: 200% 200%;
            animation: badge-shine 3s infinite linear;
            pointer-events: none;
            border-radius: 50%;
        }
        
        @keyframes badge-shine {
            0% { background-position: -100% -100%; }
            100% { background-position: 100% 100%; }
        }
    `;
    document.head.appendChild(badgeStyle);

    // Add animations and interactive elements to each badge
    badges.forEach((badge, index) => {
        // Add initial state and staggered animation
        badge.style.opacity = '0';
        badge.style.transform = 'scale(0.5) translateY(20px)';

        // Add glow effect element
        const glow = document.createElement('div');
        glow.className = 'badge-glow';
        badge.appendChild(glow);

        // Add shine effect element
        const shine = document.createElement('div');
        shine.className = 'badge-shine';
        badge.appendChild(shine);

        // Add tooltip with badge info
        const tooltip = document.createElement('div');
        tooltip.className = 'badge-tooltip';

        // Get badge title from data attribute or alt text
        const badgeTitle = badge.getAttribute('data-title') || badge.getAttribute('alt') || 'Achievement Badge';
        const badgeDesc = badge.getAttribute('data-description') || 'Complete specific actions to unlock this badge';

        tooltip.innerHTML = `<strong>${badgeTitle}</strong><br>${badgeDesc}`;
        badge.appendChild(tooltip);

        // Check if badge is locked or unlocked
        if (badge.classList.contains('locked')) {
            shine.style.display = 'none';
        }

        // Create intersection observer to animate badges when they come into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add staggered animation with delay based on index
                    setTimeout(() => {
                        badge.classList.add('badge-animation');
                    }, index * 150);

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(badge);

        // Add click interaction for badges
        badge.addEventListener('click', function () {
            // If badge is locked, show locked message
            if (this.classList.contains('locked')) {
                const lockedMsg = document.createElement('div');
                lockedMsg.className = 'badge-locked-message alert alert-info';
                lockedMsg.innerHTML = `<i class="fas fa-lock"></i> Complete <strong>${badgeTitle}</strong> challenge to unlock this badge!`;
                lockedMsg.style.position = 'fixed';
                lockedMsg.style.top = '20px';
                lockedMsg.style.left = '50%';
                lockedMsg.style.transform = 'translateX(-50%)';
                lockedMsg.style.zIndex = '9999';
                lockedMsg.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
                lockedMsg.style.opacity = '0';
                lockedMsg.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                document.body.appendChild(lockedMsg);

                setTimeout(() => {
                    lockedMsg.style.opacity = '1';
                }, 10);

                setTimeout(() => {
                    lockedMsg.style.opacity = '0';
                    lockedMsg.style.transform = 'translateX(-50%) translateY(-20px)';
                    setTimeout(() => lockedMsg.remove(), 300);
                }, 3000);
            } else {
                // If badge is unlocked, show achievement details
                this.classList.add('badge-highlight');
                setTimeout(() => this.classList.remove('badge-highlight'), 1000);

                // Add celebration effect
                const celebrationEffect = document.createElement('div');
                celebrationEffect.className = 'badge-celebration';
                celebrationEffect.style.position = 'absolute';
                celebrationEffect.style.top = '0';
                celebrationEffect.style.left = '0';
                celebrationEffect.style.right = '0';
                celebrationEffect.style.bottom = '0';
                celebrationEffect.style.pointerEvents = 'none';
                celebrationEffect.style.zIndex = '5';
                this.appendChild(celebrationEffect);

                // Create particles for celebration effect
                for (let i = 0; i < 20; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'badge-particle';
                    particle.style.position = 'absolute';
                    particle.style.width = '8px';
                    particle.style.height = '8px';
                    particle.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
                    particle.style.borderRadius = '50%';
                    particle.style.top = '50%';
                    particle.style.left = '50%';
                    particle.style.transform = 'translate(-50%, -50%)';
                    particle.style.opacity = '1';

                    const angle = Math.random() * Math.PI * 2;
                    const velocity = 2 + Math.random() * 3;
                    const tx = Math.cos(angle) * 50;
                    const ty = Math.sin(angle) * 50;

                    particle.animate([
                        { transform: 'translate(-50%, -50%)', opacity: 1 },
                        { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`, opacity: 0 }
                    ], {
                        duration: 1000 + Math.random() * 500,
                        easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    });

                    celebrationEffect.appendChild(particle);
                }

                setTimeout(() => celebrationEffect.remove(), 1500);
            }
        });
    });
}

/**
 * Enhance tab switching with smooth animations and interactive effects
 */
function enhanceTabSwitching() {
    // Find tab navigation
    const tabLinks = document.querySelectorAll('.nav-tabs .nav-link, .profile-tabs .nav-link');
    const tabPanes = document.querySelectorAll('.tab-pane, .profile-tab-content');

    if (tabLinks.length === 0 || tabPanes.length === 0) return;

    // Add animation classes to tab panes
    tabPanes.forEach(pane => {
        pane.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        pane.style.opacity = pane.classList.contains('active') ? '1' : '0';
        pane.style.transform = pane.classList.contains('active') ? 'translateY(0)' : 'translateY(20px)';
    });

    // Add click event to tab links with enhanced animations
    tabLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Add ripple effect on click
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.className = 'tab-ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);

            // Get target tab pane
            const targetId = this.getAttribute('href') || this.getAttribute('data-bs-target');
            if (!targetId) return;

            const targetPane = document.querySelector(targetId);
            if (!targetPane) return;

            // Animate out current active pane with enhanced transition
            const activePane = document.querySelector('.tab-pane.active, .profile-tab-content.active');
            if (activePane && activePane !== targetPane) {
                activePane.style.opacity = '0';
                activePane.style.transform = 'translateY(20px) scale(0.98)';

                // Add exit animation class
                activePane.classList.add('tab-exit');
            }

            // Animate in target pane after a short delay with enhanced transition
            setTimeout(() => {
                // Remove exit animation class from all panes
                tabPanes.forEach(pane => pane.classList.remove('tab-exit'));

                // Add entrance animation class
                targetPane.classList.add('tab-enter');
                targetPane.style.opacity = '1';
                targetPane.style.transform = 'translateY(0) scale(1)';

                // Remove entrance class after animation completes
                setTimeout(() => {
                    targetPane.classList.remove('tab-enter');
                }, 400);
            }, 200);

            // Update active tab indicator with animation
            tabLinks.forEach(tabLink => {
                const indicator = tabLink.querySelector('.tab-indicator');
                if (indicator) {
                    if (tabLink === this) {
                        indicator.style.width = '100%';
                        indicator.style.opacity = '1';
                    } else {
                        indicator.style.width = '0';
                        indicator.style.opacity = '0.5';
                    }
                }
            });
        });

        // Add hover effects to tabs
        link.addEventListener('mouseenter', function () {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-2px)';
                this.style.transition = 'transform 0.3s ease, color 0.3s ease';
                this.style.color = '#fe424d';
            }
        });

        link.addEventListener('mouseleave', function () {
            if (!this.classList.contains('active')) {
                this.style.transform = '';
                this.style.color = '';
            }
        });
    });

    // Add animated indicator to tab links
    tabLinks.forEach(link => {
        // Add indicator element
        const indicator = document.createElement('span');
        indicator.className = 'tab-indicator';
        link.appendChild(indicator);

        // Set initial state based on active status
        if (link.classList.contains('active')) {
            indicator.style.width = '100%';
            indicator.style.opacity = '1';
            link.style.color = '#fe424d';
        } else {
            indicator.style.width = '0';
            indicator.style.opacity = '0.5';
        }
    });

    // Add tab content transition observer
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.classList.contains('active') && target.classList.contains('tab-pane')) {
                    // Tab has been activated by Bootstrap, ensure our animations are applied
                    target.style.opacity = '1';
                    target.style.transform = 'translateY(0) scale(1)';
                }
            }
        });
    });

    // Observe all tab panes for class changes
    tabPanes.forEach(pane => {
        observer.observe(pane, { attributes: true });
    });

    // Add CSS for enhanced tab animations
    const tabStyle = document.createElement('style');
    tabStyle.textContent = `
        /* Tab indicator animation */
        .tab-indicator {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 3px;
            background-color: #fe424d;
            transition: width 0.4s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.4s ease;
            border-radius: 3px 3px 0 0;
        }
        
        .nav-tabs .nav-link, .profile-tabs .nav-link {
            position: relative;
            overflow: hidden;
            transition: color 0.3s ease, background-color 0.3s ease;
        }
        
        .nav-tabs .nav-link.active, .profile-tabs .nav-link.active {
            color: #fe424d;
            font-weight: 500;
        }
        
        /* Tab ripple effect */
        .tab-ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(254, 66, 77, 0.2);
            width: 100px;
            height: 100px;
            margin-top: -50px;
            margin-left: -50px;
            animation: tab-ripple 0.6s linear;
            transform: scale(0);
            opacity: 1;
            pointer-events: none;
        }
        
        @keyframes tab-ripple {
            to {
                transform: scale(2.5);
                opacity: 0;
            }
        }
        
        /* Tab content animations */
        .tab-pane, .profile-tab-content {
            transition: opacity 0.4s ease, transform 0.4s ease;
        }
        
        .tab-enter {
            animation: tab-enter 0.4s forwards;
        }
        
        .tab-exit {
            animation: tab-exit 0.3s forwards;
        }
        
        @keyframes tab-enter {
            from {
                opacity: 0;
                transform: translateY(20px) scale(0.98);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        @keyframes tab-exit {
            from {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            to {
                opacity: 0;
                transform: translateY(20px) scale(0.98);
            }
        }
        
        /* Tab content fade effect */
        .tab-content {
            position: relative;
        }
        
        .tab-content::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 30px;
            background: linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0));
            pointer-events: none;
            opacity: 0.8;
        }
    `;
    document.head.appendChild(tabStyle);
}