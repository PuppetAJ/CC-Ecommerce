const authRouter = require("express").Router();
const pool = require("../pool/pool");
const { hashPassword, comparePassword } = require("../utils/passwordHash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const result = await pool.query(
          "SELECT * FROM users WHERE username = $1",
          [username]
        );
        if (result.rows.length === 0) {
          return done(null, false, { message: "Invalid username" });
        }
        const user = result.rows[0];
        const isValid = await comparePassword(password, user.password_hash);
        console.log(isValid);
        if (!isValid) {
          return done(null, false, { message: "Invalid password" });
        }

        if (isValid) {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error);
  }
});

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

authRouter.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json({ message: "Logout successful" });
  });
  // res.json({ message: "Logout successful" });
});

authRouter.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const result = await pool.query(
      "INSERT INTO users(username, password_hash) VALUES($1, $2) RETURNING *",
      [username, hashedPassword]
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

authRouter.post(
  "/login",
  passport.authenticate(
    "local"
    // {
    //   successRedirect: "/",
    //   failureRedirect: "/login",
    // }
  ),
  (req, res) => {
    res.json({ message: "Login successful", user: req.user });
  }
);

authRouter.get("/me", isAuthenticated, (req, res) => {
  res.json(req.user);
});

authRouter.use((error, req, res, next) => {
  if (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
  authRouter,
  isAuthenticated,
};
