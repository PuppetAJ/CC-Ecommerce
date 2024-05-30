const pool = require('../../models/database');

exports.getCartItems = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await pool.query(
      'SELECT user_id, product_id, quantity, name, category, price, img_name FROM user_items LEFT JOIN products ON user_items.product_id = products.id WHERE user_id = $1',
      [user.id]
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

exports.addCartItem = async (req, res, next) => {
  try {
    const user = req.user;
    const { product_id, quantity, items } = req.body;

    if ((!product_id || !quantity) & !items) {
      return res.status(400).json({
        message: 'Product ID and quantity are required, or an array of items',
      });
    }

    if (quantity && quantity <= 0) {
      return res
        .status(400)
        .json({ message: 'Quantity must be greater than 0' });
    }

    if (items && items.length === 0) {
      return res.status(400).json({ message: 'Items array is empty' });
    }

    if (items && items.length > 0) {
      const results = await Promise.all(
        items.map((item) =>
          pool.query(
            'INSERT INTO user_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
            [user.id, item.product_id, item.quantity]
          )
        )
      );

      return res.json(results.map((result) => result.rows[0]));
    }

    if (product_id && quantity && !items) {
      const result = await pool.query(
        'INSERT INTO user_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
        [user.id, product_id, quantity]
      );
      return res.json(result.rows);
    }
  } catch (error) {
    next(error);
  }
};

exports.updateCartItemQuantity = async (req, res, next) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { quantity } = req.body;
    if (!quantity) {
      return res.status(400).json({ message: 'Quantity is required' });
    }
    const result = await pool.query(
      'UPDATE user_items SET quantity = $1 WHERE product_id = $2 AND user_id = $3 RETURNING *',
      [quantity, id, user.id]
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

exports.deleteCartItems = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await pool.query(
      'DELETE FROM user_items WHERE user_id = $1',
      [user.id]
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

exports.deleteCartItem = async (req, res, next) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM user_items WHERE product_id = $1 AND user_id = $2 RETURNING *',
      [id, user.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
