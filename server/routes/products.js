const productsRouter = require("express").Router();
const pool = require("../pool/pool");
const { isAdministrator } = require("./auth");

productsRouter.get("/", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

productsRouter.post("/", isAdministrator, async (req, res, next) => {
  try {
    const { name, description, price, stock_quantity, category } = req.body;
    if (description) {
      const result = await pool.query(
        "INSERT INTO products (name, description, price, stock_quantity, category) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [name, description, price, stock_quantity, category]
      );
      return res.json(result.rows);
    } else if (!description) {
      const result = await pool.query(
        "INSERT INTO products (name, price, stock_quantity, category) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, price, stock_quantity, category]
      );
      return res.json(result.rows);
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:id", isAdministrator, async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM products WHERE id = $1", [id]);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:id", isAdministrator, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock_quantity, category } = req.body;

    if (description) {
      const result = await pool.query(
        "UPDATE products SET name = $1, description = $2, price = $3, stock_quantity = $4, category = $5 WHERE id = $6",
        [name, description, price, stock_quantity, category, id]
      );
      return res.json(result.rows);
    } else if (!description) {
      const result = await pool.query(
        "UPDATE products SET name = $1, price = $2, stock_quantity = $3, category = $4 WHERE id = $5",
        [name, price, stock_quantity, category, id]
      );
      return res.json(result.rows);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = productsRouter;
