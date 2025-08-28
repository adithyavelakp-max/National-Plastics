// Website loaded event
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎉 National Plastics website loaded successfully!');
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize Kgs converter
    initializeConverter();
    
    // Initialize animations
    animateOnScroll();
});

// Scroll to contact section
function scrollToContact() {
    const contactSection = document.querySelector('#contact');
    const headerHeight = document.querySelector('header').offsetHeight;
    const targetPosition = contactSection.offsetTop - headerHeight;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const form = event.target;
    const inputs = form.querySelectorAll('input[type="text"]');
    const company = inputs[0].value;
    const location = inputs[1].value;
    const productType = form.querySelector('select').value;
    const requirements = form.querySelector('textarea').value;
    
    // Create WhatsApp message
    const whatsappMessage = `*New Quote Request from Website*
    
🏢 *Company:* ${company}
📍 *Location:* ${location}
📦 *Product Type:* ${productType}

📝 *Requirements:*
${requirements}

*Sent from National Plastics Website*`;
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // Create WhatsApp URL (using your number +919384932216)
    const whatsappURL = `https://wa.me/919384932216?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Show success message
    alert(`✅ Thank you! Your enquiry from ${company} is being sent to WhatsApp.\n\nYour quote request will be processed soon.`);
    
    // Log to console
    console.log('📧 New enquiry sent to WhatsApp from National Plastics website:', {
        company: company,
        location: location,
        productType: productType,
        requirements: requirements,
        timestamp: new Date().toLocaleString()
    });
    
    // Reset form
    form.reset();
}

// Initialize Kgs Converter
function initializeConverter() {
    const widthInput = document.getElementById('width');
    const lengthInput = document.getElementById('length');
    const thicknessInput = document.getElementById('thickness');
    const bagsInput = document.getElementById('bags');
    const resultDisplay = document.getElementById('result');
    const micronDisplay = document.getElementById('micronDisplay');
    
    if (!widthInput || !lengthInput || !thicknessInput || !bagsInput || !resultDisplay) {
        console.log('Converter elements not found');
        return;
    }
    
    // Function to update micron display
    function updateMicronDisplay() {
        const gauges = parseFloat(thicknessInput.value) || 280;
        const microns = Math.round(gauges / 4);
        if (micronDisplay) {
            micronDisplay.textContent = `(${microns} microns)`;
        }
    }
    
    // Initialize micron display
    updateMicronDisplay();
    
    // Calculate weight function
    function calculateWeight() {
        const width = parseFloat(widthInput.value) || 0;
        const length = parseFloat(lengthInput.value) || 0;
        const thickness = parseFloat(thicknessInput.value) || 280;
        const bags = parseFloat(bagsInput.value) || 0;
        
        // Validation: Width and Length (4-30 inches), Thickness (200-500), Bags > 0
        const isWidthValid = width >= 4 && width <= 30;
        const isLengthValid = length >= 4 && length <= 30;
        const isThicknessValid = thickness >= 200 && thickness <= 500;
        const isBagsValid = bags > 0;
        
        if (isWidthValid && isLengthValid && isThicknessValid && isBagsValid) {
            // Formula: (width * length * thickness * number of bags required) / 3300000
            const weight = (width * length * thickness * bags) / 3300000;
            resultDisplay.textContent = `~${weight.toFixed(4)}`;
            
            // Add visual feedback
            if (weight < 250) {
                resultDisplay.style.color = '#ff6b6b';
                document.querySelector('.min-order').style.color = '#ff6b6b';
                document.querySelector('.min-order').innerHTML = '⚠️ (Minimum Order Quantity = 250 kgs) - Below minimum!';
            } else {
                resultDisplay.style.color = '#63b3ed';
                document.querySelector('.min-order').style.color = 'rgba(255,255,255,0.8)';
                document.querySelector('.min-order').innerHTML = '✅ (Minimum Order Quantity = 250 kgs) - Order eligible!';
            }
        } else {
            // Show validation errors
            let errorMessage = 'Please check: ';
            if (!isWidthValid) errorMessage += 'Width (4-30"), ';
            if (!isLengthValid) errorMessage += 'Length (4-30"), ';
            if (!isThicknessValid) errorMessage += 'Thickness (200-500), ';
            if (!isBagsValid) errorMessage += 'Bags > 0, ';
            
            resultDisplay.textContent = '~0';
            resultDisplay.style.color = '#ff6b6b';
            document.querySelector('.min-order').style.color = '#ff6b6b';
            document.querySelector('.min-order').innerHTML = errorMessage.slice(0, -2); // Remove last comma
        }
    }
    
    // Add event listeners for real-time calculation
    [widthInput, lengthInput, thicknessInput, bagsInput].forEach(input => {
        input.addEventListener('input', calculateWeight);
        input.addEventListener('change', calculateWeight);
    });
    
    // Set minimum and maximum values
    widthInput.addEventListener('blur', function() {
        const value = parseFloat(this.value);
        if (value < 4) this.value = 4;
        if (value > 30) this.value = 30;
        calculateWeight();
    });
    
    lengthInput.addEventListener('blur', function() {
        const value = parseFloat(this.value);
        if (value < 4) this.value = 4;
        if (value > 30) this.value = 30;
        calculateWeight();
    });
    
    thicknessInput.addEventListener('blur', function() {
        const value = parseFloat(this.value);
        if (value < 200) this.value = 200;
        if (value > 500) this.value = 500;
        updateMicronDisplay();
        calculateWeight();
    });
    
    // Add input event listener for real-time micron updates
    thicknessInput.addEventListener('input', function() {
        updateMicronDisplay();
    });
    
    bagsInput.addEventListener('blur', function() {
        const value = parseFloat(this.value);
        if (value < 1) this.value = 1;
        calculateWeight();
    });
    
    console.log('📊 Kgs Converter initialized successfully!');
}

// Add animation to elements when they come into view
function animateOnScroll() {
    const animatedElements = document.querySelectorAll('.product-card, .benefit-item, .application-card, .stat');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100); // Stagger animation
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Image Popup Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.close');
    
    // Get all product images
    const productImages = document.querySelectorAll('.product-img');
    
    // Add click event to each product image
    productImages.forEach(img => {
        img.addEventListener('click', function() {
            modal.style.display = 'block';
            modalImg.src = this.src;
            modalCaption.textContent = this.alt;
        });
    });
    
    // Close modal when clicking the X button
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside the image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
});

console.log('✨ Enhanced National Plastics website ready with beautiful animations and business insights!');
console.log('🏭 Features loaded: Smooth navigation, Kgs converter, Contact forms, Floating buttons, Animations, Image Popup');
console.log('📊 Business tools: Enquiry tracking, User interaction analytics, Performance monitoring');
