import React, { useEffect, useRef } from 'react';
import { useLoginStore } from '../../store/loggedIn';
import { useCartStore } from '../../store/cart';
import {
  ArrowUpIcon,
  PlusIcon,
  MinusIcon,
  Cross1Icon,
  TrashIcon,
} from '@radix-ui/react-icons';
import { IoPersonOutline, IoBagHandleOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';

function Header({ open, setOpen }) {
  const { checkCart, cart } = useCartStore();
  const { checkLoggedIn } = useLoginStore();
  const loggedIn = useLoginStore((state) => state.loggedIn);
  const headerRef = useRef(null);
  const backToTopRef = useRef(null);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
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
    await checkLoggedIn();

    if (loggedIn === true) {
      await checkCart();
      setOpen(true);
    }
  };

  return (
    <header ref={headerRef} className='header-wrapper'>
      <Drawer open={open} anchor='right' onClose={toggleDrawer(false)}>
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
                            setOpen(false);
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
                              setOpen(false);
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
                            setOpen(false);
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
                  {cart.reduce((acc, currEl) => {
                    return acc + currEl.price * currEl.quantity;
                  }, 0)}
                </h1>
              </div>
              <button className='cart-checkout'>Checkout</button>
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
          </div>
        )}
        {loggedIn === true && (
          <div className='login-header-wrapper'>
            <Link to='/profile' className='header-link'>
              <IoPersonOutline className='header-icon' />
            </Link>
            <button className='header-link' onClick={handleCart}>
              <IoBagHandleOutline className='header-icon' />
            </button>
            <button onClick={handleLogOut} className='login-button'>
              Log out
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
