const authRouter = require('express').Router();
const {
  isAuthenticated,
  logout,
  register,
  login,
  me,
} = require('../controllers/auth');

authRouter.get('/logout', logout);

authRouter.post('/register', register);

authRouter.post('/login', login, (req, res) => {
  // This function will be called if authentication succeeds
  res.json({ message: 'Login successful', user: req.user });
});

authRouter.get('/me', isAuthenticated, me);

authRouter.use((error, req, res, next) => {
  if (error) {
    console.error('Error: ', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = authRouter;
