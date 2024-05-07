const express = require("express");
const apiRouter = express.Router();

const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

apiRouter.use("/users", usersRouter);
apiRouter.use("/auth", authRouter);

module.exports = apiRouter;
