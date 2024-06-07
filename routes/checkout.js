const checkoutRouter = require('express').Router();
const { isAuthenticated } = require('../controllers/auth');
const { checkOut, stripeCheckout } = require('../controllers/checkout');

checkoutRouter.get('/', isAuthenticated, checkOut);

checkoutRouter.post('/stripe', isAuthenticated, stripeCheckout);

// checkoutRouter.get('/stripe/success', isAuthenticated, stripeSuccess);

checkoutRouter.use((error, req, res, next) => {
  if (error) {
    console.error('Error: ', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = checkoutRouter;
