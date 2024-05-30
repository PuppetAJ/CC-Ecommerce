import React from 'react';
import { useLoginStore } from '../../store/loggedIn';

function Header({ loggedIn }) {
  const { checkLoggedIn } = useLoginStore();
  const handleLogOut = async () => {
    const response = await fetch('/api/auth/logout', {
      credentials: 'include',
    });
    if (response.status === 200) {
      checkLoggedIn();
    }
  };
  return (
    <header className='app-header'>
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
    </header>
  );
}

export default Header;
