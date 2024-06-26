const pool = require('../../models/database');

exports.getProducts = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      console.log('ID is required');
      return res.status(400).json({ message: 'ID is required' });
    }
    if (isNaN(id)) {
      console.log('ID must be a number');
      return res.status(400).json({ message: 'ID must be a number' });
    }
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [
      id,
    ]);
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

exports.getCategorizedProducts = async (req, res, next) => {
  try {
    const { category } = req.params;
    if (!category) {
      console.log('Category is required');
      return res.status(400).json({ message: 'Category is required' });
    }
    const result = await pool.query(
      'SELECT * FROM products WHERE UPPER(category) = UPPER($1) ORDER BY id ASC',
      [category]
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

exports.addProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock_quantity, category } = req.body;
    if (description) {
      const result = await pool.query(
        'INSERT INTO products (name, description, price, stock_quantity, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, description, price, stock_quantity, category]
      );
      return res.json(result.rows);
    } else if (!description) {
      const result = await pool.query(
        'INSERT INTO products (name, price, stock_quantity, category) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, price, stock_quantity, category]
      );
      return res.json(result.rows[0]);
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock_quantity, category } = req.body;

    if (description) {
      const result = await pool.query(
        'UPDATE products SET name = $1, description = $2, price = $3, stock_quantity = $4, category = $5 WHERE id = $6',
        [name, description, price, stock_quantity, category, id]
      );
      return res.json(result.rows);
    } else if (!description) {
      const result = await pool.query(
        'UPDATE products SET name = $1, price = $2, stock_quantity = $3, category = $4 WHERE id = $5',
        [name, price, stock_quantity, category, id]
      );
      return res.json(result.rows);
    }
  } catch (error) {
    next(error);
  }
};
