const express = require("express");
const apiRouter = require("./server/api");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  session({
    secret: process.env.SECRET_KEY || "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
