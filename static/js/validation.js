/**
 * Form validation functions for the Mess Menu Formation System
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get all forms that need validation
    const forms = document.querySelectorAll('.needs-validation');

    // Loop over them and prevent submission if invalid
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    // Registration form validation
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', validateRegistrationForm);
    }

    // Food suggestion form validation
    const suggestionForm = document.getElementById('suggestionForm');
    if (suggestionForm) {
        suggestionForm.addEventListener('submit', validateSuggestionForm);
    }

    // Add validation to specific input fields
    addValidationListeners();
});

/**
 * Validate the registration form
 * @param {Event} event - Form submission event
 */
function validateRegistrationForm(event) {
    const form = event.target;
    const password = form.querySelector('#password');
    const confirmPassword = form.querySelector('#confirm_password');
    const regNo = form.querySelector('#reg_no');
    
    let isValid = true;
    
    // Check password length
    if (password && password.value.length < 6) {
        showError(password, 'Password must be at least 6 characters long');
        isValid = false;
    }
    
    // Check if passwords match
    if (password && confirmPassword && password.value !== confirmPassword.value) {
        showError(confirmPassword, 'Passwords do not match');
        isValid = false;
    }
    
    // Validate registration number format (alphanumeric)
    if (regNo && !/^[a-zA-Z0-9]+$/.test(regNo.value)) {
        showError(regNo, 'Registration number must be alphanumeric');
        isValid = false;
    }
    
    if (!isValid) {
        event.preventDefault();
        event.stopPropagation();
    }
}

/**
 * Validate the food suggestion form
 * @param {Event} event - Form submission event
 */
function validateSuggestionForm(event) {
    const form = event.target;
    const foodItem = form.querySelector('#food_item');
    
    let isValid = true;
    
    // Check if food item has at least 3 characters
    if (foodItem && foodItem.value.length < 3) {
        showError(foodItem, 'Food item name must be at least 3 characters long');
        isValid = false;
    }
    
    if (!isValid) {
        event.preventDefault();
        event.stopPropagation();
    }
}

/**
 * Add validation event listeners to form fields
 */
function addValidationListeners() {
    // Email validation
    const emailFields = document.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateEmail(this);
        });
    });
    
    // Password validation
    const passwordFields = document.querySelectorAll('input[type="password"]');
    passwordFields.forEach(field => {
        field.addEventListener('blur', function() {
            validatePassword(this);
        });
    });
    
    // Registration number validation
    const regNoFields = document.querySelectorAll('input[id="reg_no"]');
    regNoFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateRegNo(this);
        });
    });
}

/**
 * Validate email format
 * @param {HTMLElement} field - Email input field
 * @return {boolean} True if valid, false otherwise
 */
function validateEmail(field) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(field.value)) {
        showError(field, 'Please enter a valid email address');
        return false;
    } else {
        clearError(field);
        return true;
    }
}

/**
 * Validate password strength
 * @param {HTMLElement} field - Password input field
 * @return {boolean} True if valid, false otherwise
 */
function validatePassword(field) {
    if (field.value.length < 6) {
        showError(field, 'Password must be at least 6 characters long');
        return false;
    } else {
        clearError(field);
        return true;
    }
}

/**
 * Validate registration number format
 * @param {HTMLElement} field - Registration number input field
 * @return {boolean} True if valid, false otherwise
 */
function validateRegNo(field) {
    const regNoRegex = /^[a-zA-Z0-9]+$/;
    if (!regNoRegex.test(field.value)) {
        showError(field, 'Registration number must be alphanumeric');
        return false;
    } else {
        clearError(field);
        return true;
    }
}

/**
 * Display error message for a form field
 * @param {HTMLElement} field - Form field with error
 * @param {string} message - Error message to display
 */
function showError(field, message) {
    field.classList.add('is-invalid');
    
    // Find or create the feedback div
    let feedback = field.nextElementSibling;
    if (!feedback || !feedback.classList.contains('invalid-feedback')) {
        feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        field.parentNode.insertBefore(feedback, field.nextSibling);
    }
    
    feedback.textContent = message;
}

/**
 * Clear error message for a form field
 * @param {HTMLElement} field - Form field to clear error
 */
function clearError(field) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    
    // Find and clear any feedback div
    const feedback = field.nextElementSibling;
    if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.textContent = '';
    }
}
