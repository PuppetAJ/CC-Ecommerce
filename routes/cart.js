const cartRouter = require('express').Router();
const { isAuthenticated } = require('../controllers/auth');
const {
  getCartItems,
  addCartItem,
  updateCartItemQuantity,
  deleteCartItems,
  deleteCartItem,
} = require('../controllers/cart');

cartRouter.get('/', isAuthenticated, getCartItems);

cartRouter.post('/', isAuthenticated, addCartItem);

cartRouter.put('/:id', isAuthenticated, updateCartItemQuantity);

cartRouter.delete('/', isAuthenticated, deleteCartItems);

cartRouter.delete('/:id', isAuthenticated, deleteCartItem);

cartRouter.use((error, req, res, next) => {
  if (error) {
    console.error('Error: ', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = cartRouter;
