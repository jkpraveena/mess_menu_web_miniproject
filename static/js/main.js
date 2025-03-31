/**
 * Main JavaScript file for the Mess Menu Formation System
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize Bootstrap popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Handle Flash Message auto-close
    const flashMessages = document.querySelectorAll('.alert');
    flashMessages.forEach(function(message) {
        setTimeout(function() {
            const alert = new bootstrap.Alert(message);
            alert.close();
        }, 5000); // Auto-close after 5 seconds
    });

    // Handle back button in browser
    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href);
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== "#" && document.querySelector(targetId)) {
                e.preventDefault();
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add active class to current navigation item
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentLocation) {
            link.classList.add('active');
        }
    });
});

/**
 * Format date strings for display
 * @param {string} dateString - Date string to format
 * @return {string} Formatted date string
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

/**
 * Confirm delete operations
 * @param {string} itemType - Type of item being deleted
 * @return {boolean} True if confirmed, false otherwise
 */
function confirmDelete(itemType) {
    return confirm(`Are you sure you want to delete this ${itemType}?`);
}

/**
 * Toggle password visibility in password fields
 * @param {string} fieldId - ID of the password field
 * @param {string} toggleId - ID of the toggle button
 */
function togglePasswordVisibility(fieldId, toggleId) {
    const passwordField = document.getElementById(fieldId);
    const toggleButton = document.getElementById(toggleId);
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleButton.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        passwordField.type = 'password';
        toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
    }
}
