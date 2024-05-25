const productsRouter = require('express').Router();
const { isAdministrator } = require('../controllers/auth');
const {
  getProducts,
  getProduct,
  addProduct,
  deleteProduct,
  updateProduct,
} = require('../controllers/products');

productsRouter.get('/', getProducts);

productsRouter.get('/:id', getProduct);

productsRouter.post('/', isAdministrator, addProduct);

productsRouter.delete('/:id', isAdministrator, deleteProduct);

productsRouter.put('/:id', isAdministrator, updateProduct);

module.exports = productsRouter;
