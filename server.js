const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const pricingRoutes = require('./routes/pricing');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Serve static frontend files
app.use(express.static(__dirname));

app.use('/api/pricing', pricingRoutes);

// Serve index.html on root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
