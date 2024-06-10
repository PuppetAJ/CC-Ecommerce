const pool = require('../../models/database');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.checkOut = async (req, res, next) => {
  try {
    const user = req.user;
    if (!req.query.session_id)
      return res.status(400).json({ message: 'Session ID is required' });
    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id
    );

    if (session.payment_status === 'paid') {
      const subtotal = await pool.query(
        'SELECT quantity, price, product_id, (quantity * price) AS total FROM user_items LEFT JOIN products ON user_items.product_id = products.id WHERE user_id = $1',
        [user.id]
      );

      const totalResult = await pool.query(
        'SELECT SUM(quantity * price) AS total FROM user_items LEFT JOIN products ON user_items.product_id = products.id WHERE user_id = $1',
        [user.id]
      );

      if (subtotal.rows.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }

      const order = await pool.query(
        'INSERT INTO orders (user_id, total_amount) VALUES ($1, $2) RETURNING *',
        [user.id, totalResult.rows[0].total]
      );

      const orderId = order.rows[0].id;

      const orderDetails = [];

      subtotal.rows.forEach((item) => {
        orderDetails.push({
          order_id: orderId,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        });
      });

      await pool.query('DELETE FROM user_items WHERE user_id = $1', [user.id]);

      orderDetails.forEach(async (item) => {
        await pool.query(
          'INSERT INTO order_details (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
          [item.order_id, item.product_id, item.quantity, item.price]
        );
      });

      // res.json({
      //   total: totalResult.rows[0].total,
      //   message: 'Checkout successful',
      //   cart: cartDelete.rows,
      //   order: order.rows[0],
      // });
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5000'}`);
    } else {
      res.status(400).json({ message: 'Payment failed' });
    }
  } catch (error) {
    next(error);
  }
};

// exports.stripeSuccess = async (req, res, next) => {
//   // const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
//   // console.log(session);
//   const lineItems = await stripe.checkout.sessions.listLineItems(
//     req.query.session_id
//   );
//   console.log(lineItems);
// };

exports.stripeCheckout = async (req, res, next) => {
  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: req.body.line_items,
      mode: 'payment',
      success_url: `${
        process.env.SERVER_URL || 'http://localhost:5000'
      }/api/checkout/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5000'}`,
    });
    res.json({ url: checkoutSession.url });
  } catch (error) {
    next(error);
  }
};
