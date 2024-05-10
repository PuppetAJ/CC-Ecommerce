const cartRouter = require("express").Router();
const pool = require("../pool/pool");
const { isAuthenticated } = require("./auth");

cartRouter.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const user = req.user;
    const result = await pool.query(
      "SELECT * FROM user_items WHERE user_id = $1",
      [user.id]
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

cartRouter.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const user = req.user;
    const { product_id, quantity, items } = req.body;

    if ((!product_id || !quantity) & !items) {
      return res.status(400).json({
        message: "Product ID and quantity are required, or an array of items",
      });
    }

    if (quantity && quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0" });
    }

    if (items && items.length === 0) {
      return res.status(400).json({ message: "Items array is empty" });
    }

    if (items && items.length > 0) {
      const results = await Promise.all(
        items.map((item) =>
          pool.query(
            "INSERT INTO user_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
            [user.id, item.product_id, item.quantity]
          )
        )
      );

      return res.json(results.map((result) => result.rows[0]));
    }

    if (product_id && quantity && !items) {
      const result = await pool.query(
        "INSERT INTO user_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
        [user.id, product_id, quantity]
      );
      return res.json(result.rows);
    }
  } catch (error) {
    next(error);
  }
});

cartRouter.put("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { quantity } = req.body;
    if (!quantity) {
      return res.status(400).json({ message: "Quantity is required" });
    }
    const result = await pool.query(
      "UPDATE user_items SET quantity = $1 WHERE product_id = $2 AND user_id = $3 RETURNING *",
      [quantity, id, user.id]
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

cartRouter.delete("/", isAuthenticated, async (req, res, next) => {
  try {
    const user = req.user;
    const result = await pool.query(
      "DELETE FROM user_items WHERE user_id = $1",
      [user.id]
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

cartRouter.delete("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM user_items WHERE product_id = $1 AND user_id = $2 RETURNING *",
      [id, user.id]
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

cartRouter.use((error, req, res, next) => {
  if (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = cartRouter;
