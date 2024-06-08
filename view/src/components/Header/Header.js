import React, { useEffect, useRef, useState } from 'react';
import { useLoginStore } from '../../store/loggedIn';
import { useCartStore } from '../../store/cart';
import {
  ArrowUpIcon,
  PlusIcon,
  MinusIcon,
  Cross1Icon,
  TrashIcon,
  HamburgerMenuIcon,
} from '@radix-ui/react-icons';
import { IoNewspaperOutline, IoBagHandleOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';

function Header() {
  const { checkCart, cart, setCartOpen, cartOpen } = useCartStore();
  const { checkLoggedIn, setLoggedIn } = useLoginStore();
  const loggedIn = useLoginStore((state) => state.loggedIn);
  const headerRef = useRef(null);
  const backToTopRef = useRef(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setCartOpen(newOpen);
  };

  const toggleNavDrawer = (newOpen) => () => {
    setMobileNavOpen(newOpen);
  };

  function scrollAnim() {
    if (window.scrollY >= 20) {
      headerRef.current.classList.add('header-scroll');
      backToTopRef.current.classList.add('active-back-to-top');
    } else if (
      window.scrollY < 20 &&
      headerRef.current !== null &&
      backToTopRef.current !== null
    ) {
      headerRef.current.classList.remove('header-scroll');
      backToTopRef.current.classList.remove('active-back-to-top');
    }
  }

  useEffect(() => {
    function watchScroll() {
      window.addEventListener('scroll', scrollAnim);
    }
    watchScroll();
    return () => {
      window.removeEventListener('scroll', scrollAnim);
    };
  });

  const handleLogOut = async () => {
    await fetch('/api/auth/logout', {
      credentials: 'include',
    });
    checkLoggedIn();
  };

  const handleScroll = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleCart = async () => {
    const response = await fetch('/api/auth/me', {
      credentials: 'include',
    });

    if (response.status === 200) {
      await checkCart();
      setCartOpen(true);
    } else {
      setLoggedIn(false);
    }
  };

  const handleCheckout = async () => {
    const checkMe = await fetch('/api/auth/me', {
      credentials: 'include',
    });

    if (checkMe.status !== 200) {
      setCartOpen(false);
      setLoggedIn(false);
      return;
    }

    const response = await fetch('/api/checkout/stripe', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        line_items: cart.map((el) => {
          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: el.name,
                images: [`./images/${el.img_name}`],
              },
              unit_amount: el.price * 100,
            },
            quantity: el.quantity,
          };
        }),
      }),
    });

    if (response.status === 200) {
      // checkCart();
      // setCartOpen(false);
      const data = await response.json();
      window.location.href = data.url;
      console.log(data);
    } else {
      // setCartOpen(false);
    }
  };

  return (
    <header ref={headerRef} className='header-wrapper'>
      <Drawer
        open={mobileNavOpen}
        anchor='top'
        onClose={toggleNavDrawer(false)}
      >
        <div className='mobile-nav-wrapper'>
          <nav className='mobile-nav'>
            <ul>
              <li>
                <button
                  className='mobile-nav-home nav-hover nav-home'
                  onClick={handleScroll}
                >
                  Home
                </button>
              </li>
              <li>
                <a className='nav-hover' href='#about'>
                  About
                </a>
              </li>
              <li>
                <a className='nav-hover' href='#products'>
                  Products
                </a>
              </li>
              <li>
                <a className='nav-hover' href='#blogs'>
                  Blogs
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </Drawer>
      <Drawer open={cartOpen} anchor='right' onClose={toggleDrawer(false)}>
        <div className='cart-wrapper'>
          <div className='cart-head'>
            <h1>Cart ({cart.length})</h1>
            <button className='cart-close' onClick={toggleDrawer(false)}>
              <Cross1Icon className='cart-close' />
            </button>
          </div>
          {cart.length === 0 && 'Your cart is empty.'}
          {cart.length > 0 && (
            <>
              {cart.map((el) => (
                <div className='cart-item' key={el.product_id}>
                  <div className='cart-head'>
                    <img
                      className='cart-item-img'
                      src={`./images/${el.img_name}`}
                      alt={el.name}
                    />
                    <div className='cart-item-data'>
                      <h1>{el.name}</h1>
                      <h2>{el.price}</h2>
                    </div>
                  </div>
                  <div className='cart-item-options'>
                    <button className='cart-item-remove'>
                      <TrashIcon
                        className='cart-item-remove-icon'
                        onClick={async () => {
                          const response = await fetch(
                            `/api/cart/${el.product_id}`,
                            {
                              method: 'DELETE',
                              credentials: 'include',
                            }
                          );
                          if (response.status === 200) {
                            checkCart();
                          } else {
                            setCartOpen(false);
                          }
                        }}
                      />
                    </button>
                    <div className='cart-item-quantity'>
                      <MinusIcon
                        className='cart-item-quantity-icon'
                        onClick={async () => {
                          if (el.quantity > 1) {
                            const response = await fetch(
                              `/api/cart/${el.product_id}`,
                              {
                                method: 'PUT',
                                credentials: 'include',
                                body: JSON.stringify({
                                  quantity: el.quantity - 1,
                                }),
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                              }
                            );
                            if (response.status === 200) {
                              checkCart();
                            } else {
                              setCartOpen(false);
                            }
                          }
                        }}
                      />
                      <h2>{el.quantity}</h2>
                      <PlusIcon
                        className='cart-item-quantity-icon'
                        onClick={async () => {
                          const response = await fetch(
                            `/api/cart/${el.product_id}`,
                            {
                              method: 'PUT',
                              credentials: 'include',
                              body: JSON.stringify({
                                quantity: el.quantity + 1,
                              }),
                              headers: {
                                'Content-Type': 'application/json',
                              },
                            }
                          );
                          if (response.status === 200) {
                            checkCart();
                          } else {
                            setCartOpen(false);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <hr className='cart-div'></hr>
              <div className='cart-total'>
                <h2>Subtotal:</h2>
                <h1>
                  {cart
                    .reduce((acc, currEl) => {
                      return acc + currEl.price * currEl.quantity;
                    }, 0)
                    .toFixed(2)}
                </h1>
              </div>
              <button className='cart-checkout' onClick={handleCheckout}>
                Checkout
              </button>
            </>
          )}
        </div>
      </Drawer>
      <div className='app-header'>
        <h1 className='montserrat-medium'>Furnex.</h1>
        <nav className='header-nav'>
          <ul>
            <li>
              <button className='nav-hover nav-home' onClick={handleScroll}>
                Home
              </button>
            </li>
            <li>
              <a className='nav-hover' href='#about'>
                About
              </a>
            </li>
            <li>
              <a className='nav-hover' href='#products'>
                Products
              </a>
            </li>
            <li>
              <a className='nav-hover' href='#blogs'>
                Blogs
              </a>
            </li>
          </ul>
        </nav>
        {loggedIn === false && (
          <div className='login-header-wrapper'>
            <Link to='/login' className='login-button'>
              Log in
            </Link>
            <Link to='/register' className='register-button'>
              Register
            </Link>
            <button
              className='mobile-nav-button'
              onClick={() => setMobileNavOpen(true)}
            >
              <HamburgerMenuIcon className='mobile-nav-icon' />
            </button>
          </div>
        )}
        {loggedIn === true && (
          <div className='login-header-wrapper'>
            <Link to='/orders' className='header-link'>
              <IoNewspaperOutline className='header-icon' />
            </Link>
            <button className='header-link' onClick={handleCart}>
              <IoBagHandleOutline className='header-icon' />
            </button>
            <button onClick={handleLogOut} className='login-button'>
              Log out
            </button>
            <button
              className='mobile-nav-button'
              onClick={() => setMobileNavOpen(true)}
            >
              <HamburgerMenuIcon className='mobile-nav-icon' />
            </button>
          </div>
        )}
      </div>
      <div className='back-to-top' ref={backToTopRef} onClick={handleScroll}>
        <button>
          <ArrowUpIcon className='back-to-top-icon' />
        </button>
      </div>
    </header>
  );
}

export default Header;
