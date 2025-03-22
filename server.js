const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const pricingRoutes = require('./routes/pricing');
const authRoutes = require('./routes/auth');
const licenseRoutes = require('./routes/license');
const deviceRoutes = require('./routes/devices');
const stripeRoutes = require('./routes/stripe');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// API Routes
app.use('/api/pricing', pricingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/license', licenseRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/stripe', stripeRoutes);

// Serve main HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/activation', (req, res) => {
  res.sendFile(path.join(__dirname, 'activation.html'));
});

// Stripe payment success and cancel URLs
app.get('/success', (req, res) => {
  // Get the session ID from query parameters
  const sessionId = req.query.session_id;
  
  // In a real application, you would verify the session with Stripe
  // and then redirect to activation page with the license key
  
  res.redirect(`/activation?session_id=${sessionId}`);
});

app.get('/cancel', (req, res) => {
  res.redirect('/');
});

// Handle 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});