import React, { useEffect, useState } from 'react';
import { useLoginStore } from '../../store/loggedIn';
import { ArrowLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [ignore, setIgnore] = useState(false);

  const { setLoggedIn, loggedIn } = useLoginStore();

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.status === 200) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
        navigate('/login');
      }
    };

    checkIfLoggedIn();

    if (loggedIn) {
      // fetch orders
      fetchOrders();
    }
    // eslint-disable-next-line
  }, [loggedIn]);

  // Attach products to orders via order details endpoint
  useEffect(() => {
    if (orders.length && !ignore) {
      orders.forEach(async (order) => {
        const response = await fetch(`/api/orders/${order.id}/details`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();

        if (response.status === 200) {
          order.products = data;
          setOrders([...orders]);

          // console.log(orders);
        }
      });

      // console.log(orders);
      setIgnore(true);
    }
  }, [orders, ignore]);

  const fetchOrders = async () => {
    const response = await fetch('/api/orders', {
      method: 'GET',
      credentials: 'include',
    });

    const data = await response.json();

    if (response.status === 200) {
      setOrders(data);
    }
  };

  console.log(orders[1]);
  return (
    <div className='order-container'>
      <div className='orders-head'>
        <div>
          <h1>Your Orders:</h1>
          <h4>View the history of your orders, and items purchased</h4>
        </div>
        <h3
          onClick={() => {
            navigate('/');
          }}
        >
          <ArrowLeftIcon className='back-home-arrow' />
          Home
        </h3>
      </div>
      {orders.length === 0 ? (
        <div className='no-orders'>
          <h1>No Orders</h1>
          <h4>Looks like you haven't placed any orders yet</h4>
        </div>
      ) : (
        <div className='orders-body'>
          {orders.map((order) => (
            <div key={order.id} className='order'>
              <div className='order-head'>
                <h3>
                  Order ID: <span className='order-less'>{order.id}</span>
                </h3>
                <h4>
                  Order Date:{' '}
                  <span className='order-less'>
                    {new Date(order.order_date).toLocaleDateString('en-us', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>{' '}
                </h4>
                <h4>
                  Total:{' '}
                  <span className='order-less'>${order.total_amount}</span>
                </h4>
              </div>
              <div className='order-body'>
                <div className='order-body-head'>
                  <h3>Products:</h3>
                  <div
                    onClick={(e) => {
                      const chevron =
                        e.currentTarget.children[
                          e.currentTarget.children.length - 1
                        ];

                      chevron.classList.toggle('chevron-anim');

                      const parent = e.currentTarget.closest('.order-body');
                      const orderProductsEl =
                        parent.children[parent.children.length - 1];
                      orderProductsEl.classList.toggle(
                        'order-products-visible'
                      );
                    }}
                    className='order-body-view-products'
                  >
                    <h4>View Products</h4>
                    <ChevronRightIcon className='chevron-right chevron-anim' />
                  </div>
                </div>
                <div className='order-products order-products-visible'>
                  {order.products &&
                    order.products.map((product) => (
                      <div key={product.product_id} className='order-product'>
                        <img
                          src={`./images/${product.img_name}`}
                          alt={product.name}
                          className='order-product-img'
                        />
                        <div className='order-product-meta'>
                          <h3>{product.name}</h3>
                          <h4>
                            Qty:{' '}
                            <span className='order-product-less'>
                              {product.quantity}
                            </span>
                          </h4>
                          <h4>
                            Price:{' '}
                            <span className='order-product-less'>
                              ${product.price}
                            </span>
                          </h4>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
