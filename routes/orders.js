const ordersRouter = require('express').Router();
const { isAuthenticated } = require('../controllers/auth');
const {
  getOrders,
  getOrder,
  getOrderDetails,
} = require('../controllers/orders');

ordersRouter.get('/', isAuthenticated, getOrders);

ordersRouter.get('/:id', isAuthenticated, getOrder);

ordersRouter.get('/:id/details', isAuthenticated, getOrderDetails);

ordersRouter.use((error, req, res, next) => {
  if (error) {
    console.error('Error: ', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = ordersRouter;
