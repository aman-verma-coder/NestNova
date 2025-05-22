/**
 * Page Preloader Script
 * Controls the display of the loading animation while page content loads
 * Provides different preloader styles for home page vs other pages
 */

document.addEventListener('DOMContentLoaded', function () {
    // Get the preloader elements
    const mainPreloader = document.getElementById('main-preloader');
    const altPreloader = document.getElementById('alt-preloader');
    const contentContainer = document.querySelector('.container');

    // Hide both preloaders initially to prevent both from showing briefly
    if (mainPreloader) mainPreloader.style.display = 'none';
    if (altPreloader) altPreloader.style.display = 'none';

    // Determine if we're on the home page
    const isHomePage = window.location.pathname === '/' ||
        window.location.pathname === '/listings' ||
        window.location.pathname === '/listings/';

    // Show the appropriate preloader based on the current page
    if (isHomePage) {
        if (mainPreloader) mainPreloader.style.display = 'flex';
    } else {
        if (altPreloader) altPreloader.style.display = 'flex';
    }

    // Function to hide preloaders
    function hidePreloaders() {
        // Hide main preloader if it exists
        if (mainPreloader) {
            mainPreloader.classList.add('hidden');
            setTimeout(() => {
                mainPreloader.style.display = 'none';
            }, 1000);
        }

        // Hide alternative preloader if it exists
        if (altPreloader) {
            altPreloader.classList.add('hidden');
            setTimeout(() => {
                altPreloader.style.display = 'none';
            }, 500);
        }

        // Make content visible
        if (contentContainer) {
            contentContainer.classList.add('visible');
        }
    }

    // Hide preloader when page is fully loaded
    window.addEventListener('load', function () {
        // Add a delay to make the loader visible for a longer duration
        // even if the page loads very quickly
        // Use shorter duration for alt-preloader
        if (altPreloader && altPreloader.style.display === 'flex') {
            setTimeout(hidePreloaders, 1500);
        } else {
            setTimeout(hidePreloaders, 2000);
        }
    });

    // Fallback: Hide preloader after a maximum time (8 seconds)
    // This ensures the preloader doesn't stay indefinitely if there's an issue
    setTimeout(hidePreloaders, 8000);
});
// Enhance the preloader with creative animations and styles