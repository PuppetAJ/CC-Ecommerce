const usersRouter = require("express").Router();
const pool = require("../pool/pool");

usersRouter.get("/", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// For debug purposes
usersRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

usersRouter.use((error, req, res, next) => {
  if (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = usersRouter;
