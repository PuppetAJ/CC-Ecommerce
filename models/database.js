const pg = require('pg');
const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: 'Ecommerce',
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});

module.exports = pool;
