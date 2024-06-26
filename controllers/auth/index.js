const pool = require('../../models/database');
const { hashPassword, comparePassword } = require('../../utils/passwordHash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oidc');
const { v4: uuidv4 } = require('uuid');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env['GOOGLE_CLIENT_ID'],
      clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
      callbackURL: 'api/auth/oauth2/redirect/google',
      scope: ['profile'],
    },
    async (issuer, profile, done) => {
      // console.log(issuer);
      // console.log(profile);
      try {
        const result = await pool.query(
          'SELECT * FROM federated_credentials WHERE provider = $1 AND subject = $2',
          [issuer, profile.id]
        );

        if (result.rows.length === 0) {
          // console.log('User not found, creating new user');
          const generatedUser = `federated-${uuidv4()}`;

          const insertUser = await pool.query(
            'INSERT INTO users(username, is_federated) VALUES($1, $2) RETURNING *',
            [generatedUser, true]
          );

          // console.log(insertUser.rows[0]);
          const id = insertUser.rows[0].id;

          // console.log(profile);
          const result = await pool.query(
            'INSERT INTO federated_credentials(provider, subject, name, user_id) VALUES($1, $2, $3, $4) RETURNING *',
            [issuer, profile.id, profile.displayName, id]
          );

          const user = result.rows[0];
          return done(null, user);
        }

        const user = result.rows[0];
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        const result = await pool.query(
          'SELECT id, username, is_admin, is_federated FROM users WHERE username = $1',
          [username]
        );

        const password_hash_query = await pool.query(
          'SELECT password_hash FROM users WHERE username = $1',
          [username]
        );

        if (result.rows.length === 0 || password_hash_query.rows.length === 0) {
          console.log('Invalid username');
          return done(null, false, { message: 'Invalid username' });
        }

        // console.log(result.rows[0]);

        if (result.rows[0].is_federated) {
          // console.log('User is federated');
          return done(null, false, { message: 'User is federated' });
        }

        const user = result.rows[0];
        const password_hash = password_hash_query.rows[0].password_hash;

        const isValid = await comparePassword(password, password_hash);
        if (!isValid) {
          return done(null, false, { message: 'Invalid password' });
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
  // console.log('Serializing user:', user);
  if (user.user_id) {
    // console.log('Serializing federated user:', user.user_id);
    return done(null, { id: user.user_id, is_federated: true });
  }
  done(null, { id: user.id });
});

passport.deserializeUser(async (userObj, done) => {
  // console.log(userObj);
  try {
    let deserializedResult;
    if (!userObj.is_federated) {
      deserializedResult = await pool.query(
        'SELECT id, username, is_admin, is_federated FROM users WHERE id = $1',
        [userObj.id]
      );
    } else {
      deserializedResult = await pool.query(
        'SELECT is_federated, user_id AS id, username, is_admin, provider, subject, name FROM users LEFT JOIN federated_credentials ON users.id = federated_credentials.user_id WHERE users.id = $1',
        [userObj.id]
      );
    }

    // console.log(deserializedResult.rows[0]);
    done(null, deserializedResult.rows[0]);
  } catch (error) {
    done(error);
  }
});

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

const isAdministrator = (req, res, next) => {
  if (req.isAuthenticated() && req.user.is_admin) {
    // console.log("User is admin");
    return next();
  }
  res
    .status(401)
    .json({ message: 'User is not authorized or is not an administrator' });
};

exports.isAdministrator = isAdministrator;

exports.isAuthenticated = isAuthenticated;

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json({ message: 'Logout successful' });
  });
};

exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const result = await pool.query(
      'INSERT INTO users(username, password_hash) VALUES($1, $2) RETURNING *',
      [username, hashedPassword]
    );
    const user = result.rows[0];

    const userResult = await pool.query(
      'SELECT id, username, is_admin FROM users WHERE id = $1',
      [user.id]
    );

    // Authenticate user after registration
    req.login(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.json({
        message: 'Authenticated after registration',
        user: userResult.rows[0],
      }); // Redirect to dashboard upon successful login
    });
  } catch (error) {
    next(error);
  }
};

exports.login = (req, res, next) => {
  passport.authenticate('local', {}, (err, user, options) => {
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
};

exports.googleLogin = passport.authenticate('google');

exports.googleRedirect = passport.authenticate('google', {
  successReturnToOrRedirect: `${
    process.env.CLIENT_URL || 'http://localhost:5000'
  }`,
  failureRedirect: '/login',
});

exports.me = (req, res) => {
  res.json(req.user);
};
