const ordersRouter = require("express").Router();
const pool = require("../pool/pool");
const { isAuthenticated } = require("./auth");

ordersRouter.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const user = req.user;
    const result = await pool.query("SELECT * FROM orders WHERE user_id = $1", [
      user.id,
    ]);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

ordersRouter.get("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const user = req.user;
    const orderId = req.params.id;
    const result = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 AND id = $2",
      [user.id, orderId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

ordersRouter.get("/:id/details", isAuthenticated, async (req, res, next) => {
  try {
    const user = req.user;
    const orderId = req.params.id;
    const result = await pool.query(
      "SELECT user_id, orders.id AS order_id, product_id, order_date, quantity, price FROM orders LEFT JOIN order_details ON orders.id = order_details.order_id WHERE order_id = $1 AND user_id = $2;",
      [orderId, user.id]
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

ordersRouter.use((error, req, res, next) => {
  if (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = ordersRouter;
