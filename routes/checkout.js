const checkoutRouter = require('express').Router();
const { isAuthenticated } = require('../controllers/auth');
const { checkOut } = require('../controllers/checkout');

checkoutRouter.post('/', isAuthenticated, checkOut);

checkoutRouter.use((error, req, res, next) => {
  if (error) {
    console.error('Error: ', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = checkoutRouter;
