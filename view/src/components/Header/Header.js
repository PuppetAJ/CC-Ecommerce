import React, { useEffect } from 'react';
import { useLoginStore } from '../../store/loggedIn';

function Header({ loggedIn }) {
  const { checkLoggedIn } = useLoginStore();

  function scrollAnim() {
    if (window.scrollY >= 20) {
      document.querySelector('.header-wrapper').classList.add('header-scroll');
    } else if (window.scrollY < 20) {
      document
        .querySelector('.header-wrapper')
        .classList.remove('header-scroll');
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
  return (
    <header className='header-wrapper'>
      <div className='app-header'>
        <h1 className='montserrat-medium'>Furnex.</h1>
        <nav className='header-nav'>
          <ul>
            <li>
              <a href='#home'>Home</a>
            </li>
            <li>
              <a href='#about'>About</a>
            </li>
            <li>
              <a href='#products'>Products</a>
            </li>
            <li>
              <a href='#blogs'>Blogs</a>
            </li>
          </ul>
        </nav>
        {loggedIn === false && (
          <div className='login-header-wrapper'>
            <a href='/login' className='login-button'>
              Log in
            </a>
            <a href='/register' className='register-button'>
              Register
            </a>
          </div>
        )}
        {loggedIn === true && (
          <div className='login-header-wrapper'>
            <button onClick={handleLogOut} className='login-button'>
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
