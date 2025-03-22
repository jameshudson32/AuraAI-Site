const express = require('express');
const router = express.Router();

// In a real application, you would use a database to store device information
// For this demo, we'll use a simple in-memory array
const devices = [
  {
    id: 'MAC-2835F94A',
    userId: 1,
    licenseId: 'AURA-AI42-7X8Y-9Z3W-P5QR',
    name: 'John\'s MacBook Pro',
    platform: 'macOS',
    osVersion: '14.3.1',
    appVersion: '2.1.4',
    lastActive: new Date(),
    ipAddress: '192.168.1.5',
    status: 'active'
  },
  {
    id: 'IOS-A47B29DE',
    userId: 1,
    licenseId: 'AURA-AI42-7X8Y-9Z3W-P5QR',
    name: 'iPhone 15 Pro',
    platform: 'iOS',
    osVersion: '17.3',
    appVersion: '2.1.3',
    lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    ipAddress: '93.184.216.34',
    status: 'inactive'
  }
];

// Get devices for current user
router.get('/', (req, res) => {
  // In a real application, you would get the user ID from the JWT token
  // For this demo, we'll just return all devices for user ID 1
  const userId = 1;
  
  const userDevices = devices.filter(device => device.userId === userId);
  
  return res.status(200).json(userDevices);
});

// Get device by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  const device = devices.find(device => device.id === id);
  
  if (!device) {
    return res.status(404).json({ error: 'Device not found' });
  }
  
  return res.status(200).json(device);
});

// Pair a new device
router.post('/pair', (req, res) => {
  const { licenseKey, deviceName, platform, osVersion, appVersion, ipAddress } = req.body;
  
  // Simple validation
  if (!licenseKey || !deviceName || !platform) {
    return res.status(400).json({ error: 'License key, device name, and platform are required' });
  }
  
  // In a real application, you would verify the license key
  // and check if the user has available device slots
  
  // Generate a device ID
  const platformPrefix = platform.toUpperCase().substring(0, 3);
  const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
  const deviceId = `${platformPrefix}-${randomId}`;
  
  // Create a new device
  const newDevice = {
    id: deviceId,
    userId: 1, // In a real app, this would come from the JWT token
    licenseId: licenseKey,
    name: deviceName,
    platform,
    osVersion: osVersion || 'Unknown',
    appVersion: appVersion || 'Unknown',
    lastActive: new Date(),
    ipAddress: ipAddress || '127.0.0.1',
    status: 'active'
  };
  
  devices.push(newDevice);
  
  return res.status(201).json({
    success: true,
    device: newDevice
  });
});

// Update device
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  // Find device index
  const deviceIndex = devices.findIndex(device => device.id === id);
  
  if (deviceIndex === -1) {
    return res.status(404).json({ error: 'Device not found' });
  }
  
  // Update device
  devices[deviceIndex] = {
    ...devices[deviceIndex],
    ...updates,
    lastActive: new Date()
  };
  
  return res.status(200).json({
    success: true,
    device: devices[deviceIndex]
  });
});

// Remove device
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  // Find device index
  const deviceIndex = devices.findIndex(device => device.id === id);
  
  if (deviceIndex === -1) {
    return res.status(404).json({ error: 'Device not found' });
  }
  
  // Remove device
  devices.splice(deviceIndex, 1);
  
  return res.status(200).json({
    success: true,
    message: 'Device removed successfully'
  });
});

module.exports = router;
