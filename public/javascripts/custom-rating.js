// Custom rating functionality
document.addEventListener('DOMContentLoaded', function () {
    const ratingInput = document.querySelector('.custom-rating-input');
    const ratingDisplay = document.querySelector('.custom-rating-display');
    const ratingText = document.querySelector('.rating-text');

    if (ratingInput) {
        // Update rating text on hover
        const stars = ratingInput.querySelectorAll('label');
        const ratingValues = {
            'star5': 'Amazing',
            'star4': 'Very good',
            'star3': 'Average',
            'star2': 'Not good',
            'star1': 'Terrible'
        };

        stars.forEach(star => {
            star.addEventListener('mouseenter', () => {
                if (ratingText) {
                    const forAttr = star.getAttribute('for');
                    ratingText.textContent = ratingValues[forAttr];
                    ratingText.style.color = '#ffcc00';
                }
            });
        });

        ratingInput.addEventListener('mouseleave', () => {
            if (ratingText) {
                const checkedInput = ratingInput.querySelector('input:checked');
                if (checkedInput) {
                    const id = checkedInput.getAttribute('id');
                    ratingText.textContent = ratingValues[id];
                } else {
                    ratingText.textContent = 'Select your rating';
                    ratingText.style.color = '#666';
                }
            }
        });

        // Update on rating change
        ratingInput.addEventListener('change', (event) => {
            if (event.target.name === 'review[rating]') {
                const selectedRating = event.target.value;
                const id = event.target.id;

                if (ratingText) {
                    ratingText.textContent = ratingValues[id];
                    ratingText.style.color = '#ffcc00';
                }

                if (ratingDisplay) {
                    // Update the display based on the selected rating
                    const percentage = (selectedRating / 5) * 100;
                    ratingDisplay.style.setProperty('--rating', percentage + '%');
                }

                // Add a pulse effect to the container
                const container = document.querySelector('.rating-container');
                if (container) {
                    container.classList.add('pulse-effect');
                    setTimeout(() => {
                        container.classList.remove('pulse-effect');
                    }, 500);
                }
            }
        });
    }
});