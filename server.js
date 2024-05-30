require('dotenv').config();
const express = require('express');
const apiRouter = require('./routes/api');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: ['http://localhost:5000', 'http://localhost:3000'], // <-- location of the react app were connecting to
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SECRET_KEY || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000,
      // secure: true,
      sameSite: 'lax',
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
