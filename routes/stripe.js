const express = require('express');
const router = express.Router();

// In a real application, you would use the Stripe SDK and your Stripe API key
// For this demo, we'll simulate Stripe functionality

// Define Stripe payment links
const STRIPE_LINKS = {
  'solo-creator': 'https://buy.stripe.com/3cs14G0b00ol1mo3cp',
  'power-creator': 'https://buy.stripe.com/00gdRscXM0olfde6oA',
  'agency': 'https://buy.stripe.com/8wMbJk5vk1sp7KMfZc'
};

// Products and their prices
const PRODUCTS = {
  'solo-creator': {
    name: 'Solo Creator',
    priceMonthly: 249,
    priceYearly: 239 * 12,
    currency: 'USD'
  },
  'power-creator': {
    name: 'Power Creator',
    priceMonthly: 499,
    priceYearly: 399 * 12,
    currency: 'USD'
  },
  'agency': {
    name: 'Agency',
    priceMonthly: 1499,
    priceYearly: 1199 * 12,
    currency: 'USD'
  }
};

// Get payment link for a product
router.get('/payment-link/:productId', (req, res) => {
  const { productId } = req.params;
  
  if (!STRIPE_LINKS[productId]) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  return res.status(200).json({
    success: true,
    product: PRODUCTS[productId],
    paymentLink: STRIPE_LINKS[productId]
  });
});

// Create a checkout session (in a real app, this would create a Stripe checkout session)
router.post('/create-checkout-session', (req, res) => {
  const { productId, billingType } = req.body;
  
  // Simple validation
  if (!productId || !billingType) {
    return res.status(400).json({ error: 'Product ID and billing type are required' });
  }
  
  // Check if product exists
  if (!PRODUCTS[productId]) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  // Get price based on billing type
  const price = billingType === 'monthly' 
    ? PRODUCTS[productId].priceMonthly 
    : PRODUCTS[productId].priceYearly;
  
  // Generate a mock session ID
  const sessionId = `session_${Math.random().toString(36).substring(2, 15)}`;
  
  // In a real application, you would create a Stripe checkout session here
  // and return the session URL for redirect
  
  return res.status(200).json({
    success: true,
    sessionId,
    url: STRIPE_LINKS[productId],
    product: PRODUCTS[productId]
  });
});

// Webhook to handle Stripe events (e.g., payment success, refund, etc.)
router.post('/webhook', (req, res) => {
  // In a real application, you would verify the webhook signature with Stripe
  // and handle various event types (payment_intent.succeeded, etc.)
  
  // For this demo, we'll just acknowledge receipt
  return res.status(200).json({ received: true });
});

// Get a list of all products
router.get('/products', (req, res) => {
  return res.status(200).json({
    success: true,
    products: Object.keys(PRODUCTS).map(id => ({
      id,
      ...PRODUCTS[id]
    }))
  });
});

// Check payment status (for the activation page)
router.get('/payment-status/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  // In a real application, you would check the session status with Stripe
  // For this demo, we'll just return success
  
  return res.status(200).json({
    success: true,
    status: 'paid',
    customer: {
      name: 'John Doe',
      email: 'john.doe@example.com'
    },
    product: {
      name: 'Power Creator',
      price: 499,
      currency: 'USD'
    },
    licenseKey: 'AURA-AI42-7X8Y-9Z3W-P5QR'
  });
});

module.exports = router;
