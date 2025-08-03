/**
 * Contact Page JavaScript
 * Handles contact form submission, FAQ interactions, and form validation
 */

class ContactPage {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitBtn = document.getElementById('submit-btn');
        this.formStatus = document.getElementById('form-status');
        this.faqItems = document.querySelectorAll('.faq-item');
        
        this.init();
    }

    init() {
        this.setupFormHandling();
        this.setupFAQInteractions();
        this.setupFormValidation();
        this.setupAnimations();
    }

    setupFormHandling() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate form
        if (!this.validateForm()) {
            return;
        }

        // Show loading state
        this.setLoadingState(true);
        
        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        try {
            // Simulate API call (replace with actual endpoint)
            await this.submitContactForm(data);
            
            // Show success message
            this.showFormStatus('success', 'Message sent successfully! I\'ll get back to you soon.');
            
            // Reset form
            this.form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormStatus('error', 'Failed to send message. Please try again or contact me directly.');
        } finally {
            this.setLoadingState(false);
        }
    }

    async submitContactForm(data) {
        // Simulate API call with delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success rate (90% success for demo)
                if (Math.random() > 0.1) {
                    console.log('Contact form data:', data);
                    resolve({ success: true });
                } else {
                    reject(new Error('Simulated API error'));
                }
            }, 2000);
        });
    }

    validateForm() {
        const requiredFields = ['name', 'email', 'subject', 'message'];
        let isValid = true;
        
        // Clear previous errors
        this.clearFormErrors();
        
        // Validate required fields
        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            }
        });
        
        // Validate email format
        const emailField = document.getElementById('email');
        if (emailField.value && !this.isValidEmail(emailField.value)) {
            this.showFieldError(emailField, 'Please enter a valid email address');
            isValid = false;
        }
        
        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(field, message) {
        field.style.borderColor = '#ef4444';
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = '#ef4444';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        field.parentNode.appendChild(errorElement);
    }

    clearFormErrors() {
        // Reset border colors
        const fields = this.form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.style.borderColor = '';
        });
        
        // Remove error messages
        const errorMessages = this.form.querySelectorAll('.field-error');
        errorMessages.forEach(error => error.remove());
    }

    setLoadingState(isLoading) {
        if (isLoading) {
            this.submitBtn.disabled = true;
            this.submitBtn.classList.add('loading');
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.classList.remove('loading');
        }
    }

    showFormStatus(type, message) {
        this.formStatus.className = `form-status ${type}`;
        this.formStatus.textContent = message;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.formStatus.style.display = 'none';
        }, 5000);
    }

    setupFAQInteractions() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => this.toggleFAQ(item));
            }
        });
    }

    toggleFAQ(item) {
        const isActive = item.classList.contains('active');
        
        // Close all other FAQs
        this.faqItems.forEach(faq => {
            if (faq !== item) {
                faq.classList.remove('active');
            }
        });
        
        // Toggle current FAQ
        if (isActive) {
            item.classList.remove('active');
        } else {
            item.classList.add('active');
        }
    }

    setupFormValidation() {
        // Real-time validation for email field
        const emailField = document.getElementById('email');
        if (emailField) {
            emailField.addEventListener('blur', () => {
                if (emailField.value && !this.isValidEmail(emailField.value)) {
                    this.showFieldError(emailField, 'Please enter a valid email address');
                } else {
                    this.clearFieldError(emailField);
                }
            });
        }
        
        // Real-time validation for required fields
        const requiredFields = ['name', 'subject', 'message'];
        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.addEventListener('blur', () => {
                    if (!field.value.trim()) {
                        this.showFieldError(field, 'This field is required');
                    } else {
                        this.clearFieldError(field);
                    }
                });
            }
        });
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    setupAnimations() {
        // Animate elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, observerOptions);

        // Observe contact methods and form groups
        const animatedElements = document.querySelectorAll('.contact-method, .form-group');
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });
    }

    // Utility method to handle contact link clicks with analytics
    trackContactMethod(method) {
        console.log(`Contact method used: ${method}`);
        
        // Here you could integrate with analytics services
        // Example: gtag('event', 'contact_method_click', { method: method });
    }

    // Method to pre-fill form based on URL parameters
    prefillFormFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Pre-fill subject if provided
        const subject = urlParams.get('subject');
        if (subject) {
            const subjectField = document.getElementById('subject');
            if (subjectField) {
                subjectField.value = subject;
            }
        }
        
        // Pre-fill message if provided
        const message = urlParams.get('message');
        if (message) {
            const messageField = document.getElementById('message');
            if (messageField) {
                messageField.value = decodeURIComponent(message);
            }
        }
    }

    // Method to generate mailto link with form data
    generateMailtoLink() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        const subject = encodeURIComponent(`Contact Form: ${data.subject || 'General Inquiry'}`);
        const body = encodeURIComponent(`
Name: ${data.name || ''}
Email: ${data.email || ''}
Subject: ${data.subject || ''}
Budget: ${data.budget || 'Not specified'}
Timeline: ${data.timeline || 'Not specified'}

Message:
${data.message || ''}
        `.trim());
        
        return `mailto:22054368@kiit.ac.in?subject=${subject}&body=${body}`;
    }

    // Method to handle form submission fallback
    handleFormFallback() {
        const mailtoLink = this.generateMailtoLink();
        window.location.href = mailtoLink;
    }
}

// Enhanced contact form functionality
class ContactFormEnhancer {
    constructor() {
        this.setupCharacterCounters();
        this.setupFormSaveRestore();
        this.setupKeyboardShortcuts();
    }

    setupCharacterCounters() {
        const messageField = document.getElementById('message');
        if (messageField) {
            const counter = document.createElement('div');
            counter.className = 'character-counter';
            counter.style.fontSize = '0.875rem';
            counter.style.color = 'var(--text-secondary)';
            counter.style.textAlign = 'right';
            counter.style.marginTop = '0.25rem';
            
            messageField.parentNode.appendChild(counter);
            
            messageField.addEventListener('input', () => {
                const length = messageField.value.length;
                counter.textContent = `${length} characters`;
                
                if (length > 1000) {
                    counter.style.color = '#ef4444';
                } else if (length > 800) {
                    counter.style.color = '#f59e0b';
                } else {
                    counter.style.color = 'var(--text-secondary)';
                }
            });
        }
    }

    setupFormSaveRestore() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        // Save form data to localStorage on input
        form.addEventListener('input', () => {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            localStorage.setItem('contactFormData', JSON.stringify(data));
        });

        // Restore form data on page load
        const savedData = localStorage.getItem('contactFormData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                Object.keys(data).forEach(key => {
                    const field = document.getElementById(key);
                    if (field && data[key]) {
                        if (field.type === 'checkbox') {
                            field.checked = data[key] === 'on';
                        } else {
                            field.value = data[key];
                        }
                    }
                });
            } catch (error) {
                console.error('Error restoring form data:', error);
            }
        }

        // Clear saved data on successful submission
        form.addEventListener('submit', () => {
            localStorage.removeItem('contactFormData');
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to submit form
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                const submitBtn = document.getElementById('submit-btn');
                if (submitBtn && !submitBtn.disabled) {
                    submitBtn.click();
                }
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize base portfolio functionality
    const portfolioBase = new PortfolioBase();
    
    // Initialize contact page
    const contactPage = new ContactPage();
    
    // Initialize form enhancements
    const formEnhancer = new ContactFormEnhancer();
    
    // Pre-fill form from URL parameters
    contactPage.prefillFormFromURL();
    
    // Add event listeners for contact method tracking
    document.querySelectorAll('.contact-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const method = e.target.closest('.contact-method').querySelector('h3').textContent;
            contactPage.trackContactMethod(method);
        });
    });
    
    console.log('Contact page initialized successfully');
});
