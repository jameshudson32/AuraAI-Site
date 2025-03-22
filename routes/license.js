const express = require('express');
const router = express.Router();

// In a real application, you would use a database to store license information
// For this demo, we'll use a simple in-memory array
const licenses = [
  {
    key: 'AURA-AI42-7X8Y-9Z3W-P5QR',
    userId: 1,
    plan: 'Power Creator',
    status: 'active',
    activationDate: new Date(),
    expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    allowedDevices: 2,
    activatedDevices: 1,
    allowedAccounts: 1,
    connectedAccounts: 1
  }
];

// Generate a license key
function generateLicenseKey() {
  // Generate a random license key in the format AURA-XXXX-XXXX-XXXX-XXXX
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let key = 'AURA-';
  
  // Generate 4 groups of 4 characters
  for (let i = 0; i < 4; i++) {
    if (i > 0) key += '-';
    for (let j = 0; j < 4; j++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  
  return key;
}

// Get license by key
router.get('/:key', (req, res) => {
  const { key } = req.params;
  
  const license = licenses.find(license => license.key === key);
  
  if (!license) {
    return res.status(404).json({ error: 'License not found' });
  }
  
  return res.status(200).json(license);
});

// Get licenses for current user
router.get('/', (req, res) => {
  // In a real application, you would get the user ID from the JWT token
  // For this demo, we'll just return all licenses for user ID 1
  const userId = 1;
  
  const userLicenses = licenses.filter(license => license.userId === userId);
  
  return res.status(200).json(userLicenses);
});

// Activate a license
router.post('/activate', (req, res) => {
  const { key, deviceId } = req.body;
  
  // Simple validation
  if (!key || !deviceId) {
    return res.status(400).json({ error: 'License key and device ID are required' });
  }
  
  // Check if license exists
  const licenseIndex = licenses.findIndex(license => license.key === key);
  
  if (licenseIndex === -1) {
    return res.status(404).json({ error: 'License not found' });
  }
  
  const license = licenses[licenseIndex];
  
  // Check if license is active
  if (license.status !== 'active') {
    return res.status(400).json({ error: 'License is not active' });
  }
  
  // Check if license has available devices
  if (license.activatedDevices >= license.allowedDevices) {
    return res.status(400).json({ error: 'No available device slots' });
  }
  
  // In a real application, you would check if the device is already activated
  // and update the license in the database
  
  // For this demo, we'll just update the license
  licenses[licenseIndex] = {
    ...license,
    activatedDevices: license.activatedDevices + 1
  };
  
  return res.status(200).json({ success: true, license: licenses[licenseIndex] });
});

// Create a license (for Stripe checkout success)
router.post('/create', (req, res) => {
  const { userId, plan, sessionId } = req.body;
  
  // Simple validation
  if (!userId || !plan) {
    return res.status(400).json({ error: 'User ID and plan are required' });
  }
  
  // Generate a license key
  const key = generateLicenseKey();
  
  // Set license details based on plan
  let allowedDevices = 1;
  let allowedAccounts = 1;
  
  if (plan === 'Power Creator') {
    allowedDevices = 2;
    allowedAccounts = 1;
  } else if (plan === 'Agency') {
    allowedDevices = 5;
    allowedAccounts = 10;
  }
  
  // Create a new license
  const newLicense = {
    key,
    userId,
    plan,
    status: 'active',
    activationDate: new Date(),
    expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    allowedDevices,
    activatedDevices: 0,
    allowedAccounts,
    connectedAccounts: 0,
    stripeSessionId: sessionId
  };
  
  licenses.push(newLicense);
  
  return res.status(201).json({
    success: true,
    license: newLicense
  });
});

module.exports = router;
