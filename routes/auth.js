const authRouter = require('express').Router();
const {
  isAuthenticated,
  logout,
  register,
  login,
  me,
  googleLogin,
  googleRedirect,
} = require('../controllers/auth');

authRouter.get('/logout', logout);

authRouter.post('/register', register);

authRouter.post('/login', login, (req, res) => {
  // This function will be called if authentication succeeds
  res.json({ message: 'Login successful', user: req.user });
});

authRouter.get('/me', isAuthenticated, me);

authRouter.use(
  '/login/federated/google',
  (req, res, next) => {
    console.log('Google login route hit');
    next();
  },
  googleLogin
);

authRouter.use(
  '/oauth2/redirect/google',
  (req, res, next) => {
    console.log('Google redirect route hit');
    next();
  },
  googleRedirect
);

authRouter.use((error, req, res, next) => {
  if (error) {
    console.error('Error: ', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = authRouter;
