require('dotenv').config();
const express = require('express');
const apiRouter = require('./routes/api');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./models/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: [
      `${process.env.SERVER_URL || 'http://localhost:5000'}`,
      `${process.env.CLIENT_URL || 'http://localhost:5000'}`,
    ], // <-- location of the react app were connecting to
    credentials: true,
  })
);

// console.log(`node env set to: ${process.env.NODE_ENV}`);

app.set('trust proxy', 1);

app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: 'session',
      createTableIfMissing: true,
    }),
    secret: process.env.SECRET_KEY || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000, // 1 hour
      secure: process.env.NODE_ENV === 'production' ? true : false,
      // secure: true,
      sameSite: 'lax',
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());

app.use(express.static('build'));

app.use('/api', apiRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
