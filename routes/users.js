const usersRouter = require('express').Router();
const { isAdministrator } = require('../controllers/auth');
const {
  getUser,
  getUsers,
  deleteUser,
  updateUser,
} = require('../controllers/users');

usersRouter.get('/', getUsers);

usersRouter.get('/:id', getUser);

usersRouter.delete('/:id', isAdministrator, deleteUser);

usersRouter.put('/:id', isAdministrator, updateUser);

usersRouter.use((error, req, res, next) => {
  if (error) {
    console.error('Error: ', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = usersRouter;
