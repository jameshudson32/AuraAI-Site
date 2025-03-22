// Main JavaScript for AuraAI Website

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initNavigation();
  initTestimonials();
  initFAQ();
  initPricingToggle();
  initLoginModal();
  initStripeIntegration();
});

// Navigation and mobile menu
function initNavigation() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.getAttribute('href') !== '#') {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
          });
        }
        
        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
        }
      }
    });
  });
  
  // Header scroll effect
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Highlight active nav link based on scroll position
  window.addEventListener('scroll', highlightNavLink);
  
  function highlightNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

// Auto-scrolling testimonials
function initTestimonials() {
  const testimonialTrack = document.getElementById('testimonials-track');
  const testimonialDots = document.querySelectorAll('.testimonial-dot');
  const testimonials = document.querySelectorAll('.testimonial');
  
  if (!testimonialTrack || !testimonials.length) return;
  
  let currentIndex = 0;
  let intervalId;
  
  function showTestimonial(index) {
    // Hide all testimonials
    testimonials.forEach(testimonial => {
      testimonial.classList.remove('active');
    });
    
    // Update dots
    testimonialDots.forEach(dot => {
      dot.classList.remove('active');
    });
    
    // Show the selected testimonial
    testimonials[index].classList.add('active');
    testimonialDots[index].classList.add('active');
    
    // Move the track
    testimonialTrack.style.transform = `translateX(-${index * 100}%)`;
  }
  
  function nextTestimonial() {
    currentIndex = (currentIndex + 1) % testimonials.length;
    showTestimonial(currentIndex);
  }
  
  // Set up click events for dots
  testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentIndex = index;
      showTestimonial(index);
      resetInterval();
    });
  });
  
  // Start auto-scrolling
  function startInterval() {
    intervalId = setInterval(nextTestimonial, 5000);
  }
  
  function resetInterval() {
    clearInterval(intervalId);
    startInterval();
  }
  
  startInterval();
  
  // Pause auto-scrolling when hovering over testimonials
  testimonialTrack.addEventListener('mouseenter', () => {
    clearInterval(intervalId);
  });
  
  testimonialTrack.addEventListener('mouseleave', () => {
    startInterval();
  });
}

// FAQ accordion functionality
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      // Toggle active class on the clicked item
      item.classList.toggle('active');
      
      // Optional: Close other items when one is opened
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });
    });
  });
}

// Pricing monthly/yearly toggle
function initPricingToggle() {
  const pricingToggle = document.getElementById('pricing-toggle');
  const monthlyLabel = document.getElementById('monthly-label');
  const yearlyLabel = document.getElementById('yearly-label');
  
  const starterPrice = document.getElementById('starter-price');
  const starterBilling = document.getElementById('starter-billing');
  const proPrice = document.getElementById('pro-price');
  const proBilling = document.getElementById('pro-billing');
  const enterprisePrice = document.getElementById('enterprise-price');
  const enterpriseBilling = document.getElementById('enterprise-billing');
  
  if (!pricingToggle) return;
  
  // Pricing data (can be loaded from API)
  let pricingData = {};
  
  // Fetch pricing data from API
  fetch('/api/pricing')
    .then(response => response.json())
    .then(data => {
      pricingData = data;
      updatePricingUI(false); // Initialize with monthly pricing
    })
    .catch(error => {
      console.error('Error fetching pricing data:', error);
      // Fallback to hardcoded values if API fails
      pricingData = [
        {
          plan: "Solo Creator",
          priceMonthly: 249,
          priceYearly: 2390,
          features: [
            "1 OnlyFans Account",
            "Up to 1,000 Subscribers",
            "Basic Sales Analytics",
            "Email Support"
          ]
        },
        {
          plan: "Power Creator",
          priceMonthly: 499,
          priceYearly: 4790,
          features: [
            "1 OnlyFans Account",
            "Unlimited Subscribers",
            "Advanced Sales Analytics",
            "Priority Support",
            "Advanced Personalization"
          ]
        },
        {
          plan: "Agency",
          priceMonthly: 1499,
          priceYearly: 14390,
          features: [
            "Up to 10 OnlyFans Accounts",
            "Unlimited Subscribers",
            "Enterprise Analytics Dashboard",
            "Dedicated Support",
            "Custom Training Modules"
          ]
        }
      ];
      updatePricingUI(false);
    });
  
  function updatePricingUI(isYearly) {
    if (!pricingData || !pricingData.length) return;
    
    if (starterPrice && starterBilling) {
      const soloCreator = pricingData.find(plan => plan.plan === "Solo Creator");
      if (soloCreator) {
        starterPrice.textContent = `$${isYearly ? Math.round(soloCreator.priceYearly / 12) : soloCreator.priceMonthly}`;
        starterBilling.textContent = isYearly ? 'per month, billed annually' : 'per month';
      }
    }
    
    if (proPrice && proBilling) {
      const powerCreator = pricingData.find(plan => plan.plan === "Power Creator");
      if (powerCreator) {
        proPrice.textContent = `$${isYearly ? Math.round(powerCreator.priceYearly / 12) : powerCreator.priceMonthly}`;
        proBilling.textContent = isYearly ? 'per month, billed annually' : 'per month';
      }
    }
    
    if (enterprisePrice && enterpriseBilling) {
      const agency = pricingData.find(plan => plan.plan === "Agency");
      if (agency) {
        enterprisePrice.textContent = `$${isYearly ? Math.round(agency.priceYearly / 12) : agency.priceMonthly}`;
        enterpriseBilling.textContent = isYearly ? 'per month, billed annually' : 'per month';
      }
    }
  }
  
  let isYearly = false;
  
  pricingToggle.addEventListener('click', () => {
    isYearly = !isYearly;
    pricingToggle.classList.toggle('yearly', isYearly);
    
    monthlyLabel.classList.toggle('active', !isYearly);
    yearlyLabel.classList.toggle('active', isYearly);
    
    updatePricingUI(isYearly);
  });
}

// Login modal functionality
function initLoginModal() {
  const loginButton = document.getElementById('login-btn');
  
  if (!loginButton) return;
  
  loginButton.addEventListener('click', function(e) {
    e.preventDefault();
    // Redirect to login page
    window.location.href = 'login.html';
  });
  
  // Get Started and CTA buttons
  const getStartedBtn = document.getElementById('get-started-btn');
  const signupBtn = document.getElementById('signup-btn');
  const demoBtn = document.getElementById('demo-btn');
  
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', function(e) {
      e.preventDefault();
      scrollToPricing();
    });
  }
  
  if (signupBtn) {
    signupBtn.addEventListener('click', function(e) {
      e.preventDefault();
      scrollToPricing();
    });
  }
  
  if (demoBtn) {
    demoBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // Show demo request form or redirect to contact
      showDemoRequestForm();
    });
  }
  
  function scrollToPricing() {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      window.scrollTo({
        top: pricingSection.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  }
  
  function showDemoRequestForm() {
    // Create and show modal for demo request
    const modalHTML = `
      <div class="modal-container active" id="demo-modal">
        <div class="modal glass">
          <button class="modal-close" id="demo-modal-close">×</button>
          <h2 class="modal-title">Request a Demo</h2>
          <form id="demo-form">
            <div class="form-group">
              <label class="form-label" for="demo-name">Full Name</label>
              <input type="text" id="demo-name" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="demo-email">Email Address</label>
              <input type="email" id="demo-email" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="demo-phone">Phone Number</label>
              <input type="tel" id="demo-phone" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label" for="demo-accounts">Number of OnlyFans Accounts</label>
              <input type="number" id="demo-accounts" class="form-input" min="1" value="1">
            </div>
            <button type="submit" class="btn btn-primary form-btn">Request Demo</button>
          </form>
        </div>
      </div>
    `;
    
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstChild);
    
    const demoModal = document.getElementById('demo-modal');
    const closeButton = document.getElementById('demo-modal-close');
    const demoForm = document.getElementById('demo-form');
    
    closeButton.addEventListener('click', () => {
      demoModal.remove();
    });
    
    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) {
        demoModal.remove();
      }
    });
    
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Send demo request data to server
      const formData = {
        name: document.getElementById('demo-name').value,
        email: document.getElementById('demo-email').value,
        phone: document.getElementById('demo-phone').value,
        accounts: document.getElementById('demo-accounts').value
      };
      
      // For now, just log and show confirmation message
      console.log('Demo request:', formData);
      
      demoModal.innerHTML = `
        <div class="modal glass">
          <button class="modal-close" id="demo-confirmation-close">×</button>
          <h2 class="modal-title">Thank You!</h2>
          <p>We've received your demo request and will contact you shortly.</p>
          <button class="btn btn-primary form-btn" id="demo-confirmation-close-btn">Close</button>
        </div>
      `;
      
      document.getElementById('demo-confirmation-close').addEventListener('click', () => {
        demoModal.remove();
      });
      
      document.getElementById('demo-confirmation-close-btn').addEventListener('click', () => {
        demoModal.remove();
      });
    });
  }
}

// Stripe Integration
function initStripeIntegration() {
  // URLs for Stripe checkout
  const stripeLinks = {
    'solo': 'https://buy.stripe.com/3cs14G0b00ol1mo3cp',
    'power': 'https://buy.stripe.com/00gdRscXM0olfde6oA',
    'agency': 'https://buy.stripe.com/8wMbJk5vk1sp7KMfZc'
  };
  
  // Get all the plan CTA buttons
  const planButtons = document.querySelectorAll('.pricing-plan .plan-cta');
  
  planButtons.forEach((button, index) => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Determine which plan was clicked
      let planKey;
      if (index === 0) planKey = 'solo';
      else if (index === 1) planKey = 'power';
      else if (index === 2) planKey = 'agency';
      
      if (planKey && stripeLinks[planKey]) {
        // Redirect to Stripe checkout
        window.location.href = stripeLinks[planKey];
      }
    });
  });
}
