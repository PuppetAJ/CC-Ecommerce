const express = require("express");
const apiRouter = express.Router();

const usersRouter = require("./routes/users");
const { authRouter } = require("./routes/auth");
const productsRouter = require("./routes/products");
const cartRouter = require("./routes/cart");

// users route for debug purposes
apiRouter.use("/users", usersRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/cart", cartRouter);

module.exports = apiRouter;
