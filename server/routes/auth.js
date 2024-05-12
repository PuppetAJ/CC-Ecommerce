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
          "SELECT id, username, is_admin FROM users WHERE username = $1",
          [username]
        );

        const password_hash_query = await pool.query(
          "SELECT password_hash FROM users WHERE username = $1",
          [username]
        );

        if (result.rows.length === 0 || password_hash_query.rows.length === 0) {
          console.log("Invalid username");
          return done(null, false, { message: "Invalid username" });
        }

        const user = result.rows[0];
        const password_hash = password_hash_query.rows[0].password_hash;

        const isValid = await comparePassword(password, password_hash);
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
    const result = await pool.query(
      "SELECT id, username, is_admin FROM users WHERE id = $1",
      [id]
    );
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

const isAdministrator = (req, res, next) => {
  if (req.isAuthenticated() && req.user.is_admin) {
    // console.log("User is admin");
    return next();
  }
  res
    .status(401)
    .json({ message: "User is not authorized or is not an administrator" });
};

authRouter.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json({ message: "Logout successful" });
  });
});

authRouter.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const result = await pool.query(
      "INSERT INTO users(username, password_hash) VALUES($1, $2) RETURNING *",
      [username, hashedPassword]
    );
    const user = result.rows[0];

    const userResult = await pool.query(
      "SELECT id, username, is_admin FROM users WHERE id = $1",
      [user.id]
    );

    // Authenticate user after registration
    req.login(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.json({
        message: "Authenticated after registration",
        user: userResult.rows[0],
      }); // Redirect to dashboard upon successful login
    });
  } catch (error) {
    next(error);
  }
});

// authRouter.post(
//   "/login",
//   passport.authenticate("local", {}, (err, user, options) => {
//     console.log(options);
//   }),
//   (req, res) => {
//     res.json({ message: "Login successful", user: req.user });
//   }
// );

authRouter.post(
  "/login",
  (req, res, next) => {
    passport.authenticate("local", {}, (err, user, options) => {
      if (err) {
        // console.error("Error during authentication:", err);
        return next(err); // Pass error to the next middleware
      }
      if (!user) {
        // console.error("Authentication failed:", options.message);
        return res.status(401).json({ message: options.message }); // Send response for failed authentication
      }
      req.logIn(user, (err) => {
        if (err) {
          // console.error("Error during login:", err);
          return next(err); // Pass error to the next middleware
        }
        // Authentication successful, proceed to the next middleware
        return next();
      });
    })(req, res, next); // Execute passport.authenticate() middleware
  },
  (req, res) => {
    // This function will be called if authentication succeeds
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
  isAdministrator,
};
