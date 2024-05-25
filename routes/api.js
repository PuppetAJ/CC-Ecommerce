const express = require('express');
const apiRouter = express.Router();

const usersRouter = require('./users');
const authRouter = require('./auth');
const productsRouter = require('./products');
const cartRouter = require('./cart');
const checkoutRouter = require('./checkout');
const ordersRouter = require('./orders');

// users route for debug purposes
apiRouter.use('/users', usersRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/products', productsRouter);
apiRouter.use('/cart', cartRouter);
apiRouter.use('/checkout', checkoutRouter);
apiRouter.use('/orders', ordersRouter);

module.exports = apiRouter;
