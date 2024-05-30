const pool = require('../../models/database');

exports.getUsers = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, username, is_admin, is_federated FROM users'
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, username, is_admin, is_federated FROM users WHERE id = $1',
      [id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.id === parseInt(id)) {
      return req.logout(async (err) => {
        if (err) {
          return next(err);
        }
        const result = await pool.query('DELETE FROM users WHERE id = $1', [
          id,
        ]);
        return res.json(result.rows);
      });
    } else {
      const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
      res.json(result.rows);
    }
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (username) {
      const result = await pool.query(
        'UPDATE users SET username = $1 WHERE id = $2',
        [username, id]
      );
      return res.json(result.rows);
    }

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    // if (username && password) {
    // }
    // const result = await pool.query(
    //   "UPDATE users SET username = $1, password = $2 WHERE id = $3",
    //   [username, password, id]
    // );
    // res.json(result.rows);
  } catch (error) {
    next(error);
  }
};
