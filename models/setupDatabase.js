const { Client } = require('pg');
require('dotenv').config();

(async () => {
  const usersTableStmt = `
    CREATE TABLE IF NOT EXISTS users (
      id                INT                       PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      username          VARCHAR(50)               NOT NULL,
      password_hash     VARCHAR(200),
      is_admin          BOOLEAN                   DEFAULT FALSE NOT NULL,
      is_federated      BOOLEAN                   DEFAULT FALSE NOT NULL,
      UNIQUE(username),
      CONSTRAINT check_valid_username CHECK (username ~ '^[a-zA-Z0-9_\-]+$')
    );
  `;

  const productsTableStmt = `
    CREATE TABLE IF NOT EXISTS products (
      id                INT                       PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      name              VARCHAR(50)               NOT NULL,
      description       TEXT,
      stock_quantity    INT                       DEFAULT 0 NOT NULL,
      category          VARCHAR(100)              NOT NULL,
      price             numeric(10, 2)            NOT NULL,
      img_name          TEXT,
      CONSTRAINT positive_stock_quantity CHECK (stock_quantity >= 0),
      CONSTRAINT positive_price CHECK (price >= 0)
    );
  `;

  const ordersTableStmt = `
    CREATE TABLE IF NOT EXISTS orders (
      id                INT                       PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      user_id           INT                       NOT NULL,
      order_date        DATE                      NOT NULL DEFAULT CURRENT_DATE,
      total_amount      numeric(10, 2)            NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT positive_total_amount CHECK (total_amount >= 0)
    );
  `;

  const userItemsTableStmt = `
    CREATE TABLE IF NOT EXISTS user_items (
      user_id           INT                       NOT NULL,
      product_id        INT                       NOT NULL,
      quantity          INT                       NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      PRIMARY KEY (user_id, product_id),
      CONSTRAINT positive_quantity CHECK (quantity >= 0)
    );
  `;

  const orderDetailsTableStmt = `
    CREATE TABLE IF NOT EXISTS order_details (
      id                INT                         PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      order_id          INT                         NOT NULL,
      product_id        INT                         NOT NULL,
      quantity          INT                         NOT NULL,
      price             numeric(10, 2)              NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      CONSTRAINT positive_quantity CHECK (quantity >= 0),
      CONSTRAINT positive_price CHECK (price >= 0)
    );
  `;

  const federatedCredentialsTableStmt = `
    CREATE TABLE IF NOT EXISTS federated_credentials (
      provider          TEXT                        NOT NULL,
      subject           TEXT                        NOT NULL,
      name              TEXT,
      user_id           INT                         NOT NULL,
      PRIMARY KEY (provider, subject),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  try {
    let db;
    if (process.env.DB_URL) {
      console.log('USING CONNECTION STRING');
      db = new Client({
        connectionString: process.env.DB_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      });
    } else {
      db = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
      });
    }

    await db.connect();

    // Create tables on database
    await db.query(usersTableStmt);
    await db.query(productsTableStmt);
    await db.query(ordersTableStmt);
    await db.query(userItemsTableStmt);
    await db.query(orderDetailsTableStmt);
    await db.query(federatedCredentialsTableStmt);

    await db.end();
  } catch (err) {
    console.log('ERROR CREATING ONE OR MORE TABLES: ', err);
  }
})();
