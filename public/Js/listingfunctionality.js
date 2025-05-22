let submitbtn = document.querySelector("#categorysubmitbtn");
let divbtn = document.querySelectorAll(".filter-data");

divbtn.forEach((item) => {
    item.addEventListener("click", () => {
        submitbtn.click();
    });
});

// Custom Tax Toggle Implementation
let taxSwitch = document.getElementById("taxToggle");
let taxSwitchLabel = document.querySelector(".tax-toggle .toggle-text");

// Set initial label text
const beforeTaxText = "Show Prices With Tax";
const afterTaxText = "Show Prices Without Tax";

// Add custom CSS for the toggle
const style = document.createElement('style');
style.textContent = `
    .custom-toggle {
        display: flex;
        align-items: center;
    }
    
    .custom-toggle-checkbox {
        height: 0;
        width: 0;
        visibility: hidden;
        position: absolute;
    }
    
    .custom-toggle-label {
        display: flex;
        align-items: center;
        cursor: pointer;
        margin: 0;
    }
    
    .toggle-track {
        display: inline-block;
        position: relative;
        width: 50px;
        height: 24px;
        background: #e0e0e0;
        border-radius: 100px;
        transition: 0.3s;
        margin-right: 10px;
    }
    
    .toggle-indicator {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 20px;
        height: 20px;
        background: #fff;
        border-radius: 50%;
        transition: 0.3s;
        box-shadow: 0 0 2px rgba(0,0,0,0.3);
    }
    
    .custom-toggle-checkbox:checked + .custom-toggle-label .toggle-track {
        background: #15B5B0;
    }
    
    .custom-toggle-checkbox:checked + .custom-toggle-label .toggle-indicator {
        left: calc(100% - 2px);
        transform: translateX(-100%);
    }
    
    .toggle-text {
        font-size: 14px;
        user-select: none;
    }
`;
document.head.appendChild(style);

// Set initial label text based on default state
taxSwitchLabel.textContent = taxSwitch.checked ? afterTaxText : beforeTaxText;

// Function to update label text and tax info display
function updateTaxDisplay() {
    // Update the label text based on switch state
    taxSwitchLabel.textContent = taxSwitch.checked ? afterTaxText : beforeTaxText;

    // Toggle tax info display and update prices
    let taxInfo = document.getElementsByClassName("taxInfo");
    for (const item of taxInfo) {
        if (taxSwitch.checked) {
            // Extract the base price from the previous sibling text node
            const priceText = item.parentElement.textContent;
            const priceMatch = priceText.match(/₹([\d,]+)\/night/);

            if (priceMatch && priceMatch[1]) {
                // Remove commas and convert to number
                const basePrice = parseFloat(priceMatch[1].replace(/,/g, ''));
                // Calculate price with 18% GST
                const priceWithGST = basePrice * 1.18;
                // Format the price with GST
                const formattedPrice = priceWithGST.toLocaleString('en-IN', {
                    maximumFractionDigits: 0
                });

                // Update the tax info text to show calculated price
                item.innerHTML = ` &nbsp; &nbsp; ₹${formattedPrice} <small>(incl. 18% GST)</small>`;
            } else {
                item.innerHTML = " &nbsp; &nbsp; +18% GST";
            }
            item.style.display = "inline";
        } else {
            // Reset to original text when toggle is off
            item.innerHTML = " &nbsp; &nbsp; +18% GST";
            item.style.display = "none";
        }
    }
}

// Add event listener for the tax switch
taxSwitch.addEventListener("change", (event) => {
    console.log('Tax switch state:', taxSwitch.checked);
    event.stopPropagation();
    updateTaxDisplay();
});

// Prevent external events from modifying the label text
document.addEventListener('click', function (event) {
    // If the click is outside the tax toggle but the label text has been changed
    if (!event.target.closest('.tax-toggle') &&
        taxSwitchLabel.textContent !== (taxSwitch.checked ? afterTaxText : beforeTaxText)) {
        // Reset the label text to the correct state
        updateTaxDisplay();
    }
});

// Prevent form validation from affecting the tax toggle label

// Handle filter form submission
document.addEventListener('DOMContentLoaded', function () {
    // Initialize the filter panel collapse
    const filterButton = document.querySelector('[data-bs-target="#filterPanel"]');
    if (filterButton) {
        filterButton.addEventListener('click', function () {
            // Toggle active class for styling
            this.classList.toggle('active');
        });
    }

    // Handle filter form reset
    const resetButton = document.querySelector('#detailedFilterForm button[type="reset"]');
    if (resetButton) {
        resetButton.addEventListener('click', function (e) {
            // Clear all form inputs
            const form = document.getElementById('detailedFilterForm');
            const inputs = form.querySelectorAll('input[type="checkbox"], input[type="number"]');

            inputs.forEach(input => {
                if (input.type === 'checkbox') {
                    input.checked = false;
                } else if (input.type === 'number') {
                    input.value = '';
                }
            });
        });
    }

    // MutationObserver to monitor changes to the tax toggle label text
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'characterData' || mutation.type === 'childList') {
                // If the label text is not what it should be based on the switch state
                if (taxSwitchLabel.textContent !== (taxSwitch.checked ? afterTaxText : beforeTaxText)) {
                    // Reset the label text to the correct state
                    updateTaxDisplay();
                }
            }
        });
    });

    // Start observing the label for changes
    observer.observe(taxSwitchLabel, {
        characterData: true,
        childList: true,
        subtree: true
    });

    // Add a subtle hover effect to the toggle
    const toggleTrack = document.querySelector('.toggle-track');
    if (toggleTrack) {
        toggleTrack.addEventListener('mouseenter', function () {
            this.style.opacity = '0.8';
        });

        toggleTrack.addEventListener('mouseleave', function () {
            this.style.opacity = '1';
        });
    }

    // Call updateTaxDisplay once at page load to ensure correct initial state
    updateTaxDisplay();
})