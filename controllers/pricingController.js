const pricingModel = require('../models/pricingModel');

exports.getPricing = (req, res) => {
  res.json(pricingModel);
};
