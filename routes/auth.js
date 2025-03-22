const express = require('express');
const router = express.Router();

// In a real application, you would use a database to store user information
// For this demo, we'll use a simple in-memory array
const users = [];

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  // Check if user exists
  const user = users.find(user => user.email === email);
  
  // In a real application, you would hash the password and compare it
  // For this demo, we'll just check if the user exists and return a demo token
  if (user) {
    // Create a demo token (in a real app, this would be a JWT)
    const token = `demo_token_${Math.random().toString(36).substring(2, 15)}`;
    
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  }
  
  // For demo purposes, accept any valid email format
  if (email.includes('@')) {
    // Create a new user
    const newUser = {
      id: users.length + 1,
      firstName: 'Demo',
      lastName: 'User',
      email,
      createdAt: new Date()
    };
    
    users.push(newUser);
    
    // Create a demo token
    const token = `demo_token_${Math.random().toString(36).substring(2, 15)}`;
    
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email
      }
    });
  }
  
  // Invalid credentials
  return res.status(401).json({ error: 'Invalid email or password' });
});

// Register
router.post('/register', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  
  // Simple validation
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  // Check if user already exists
  const userExists = users.find(user => user.email === email);
  
  if (userExists) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  // Create new user
  const newUser = {
    id: users.length + 1,
    firstName,
    lastName,
    email,
    // In a real application, you would hash the password
    // password: hashedPassword,
    createdAt: new Date()
  };
  
  users.push(newUser);
  
  // Create a demo token
  const token = `demo_token_${Math.random().toString(36).substring(2, 15)}`;
  
  return res.status(201).json({
    success: true,
    token,
    user: {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email
    }
  });
});

// Get current user
router.get('/me', (req, res) => {
  // In a real application, you would verify the JWT token
  // For this demo, we'll just return a demo user
  
  return res.status(200).json({
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    plan: 'Power Creator'
  });
});

module.exports = router;
