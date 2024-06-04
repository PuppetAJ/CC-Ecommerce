import React, { useState } from 'react';
import { PersonIcon, LockClosedIcon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function LoginForm({ formType }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username === '' || password === '') {
      return;
    }

    const url =
      formType === 'register' ? '/api/auth/register' : '/api/auth/login';

    const response = await fetch(url, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.status === 200) {
      setError(false);
      navigate('/');
    } else {
      setUsername('');
      setPassword('');
      setError(true);
    }
  };

  return (
    <div className='login-container'>
      <form className='login-form' onSubmit={handleSubmit}>
        <div>
          {formType === 'register' && <h1>Register</h1>}
          {formType === 'login' && <h1>Login</h1>}
        </div>
        <div className={!error ? 'form-input' : 'form-input error'}>
          <label htmlFor='username'>
            <PersonIcon className='form-icon' />
          </label>
          <input
            onChange={(e) => setUsername(e.target.value)}
            type='text'
            className='input-control'
            name='username'
            placeholder='Username'
            value={username}
          />
        </div>
        <div className={!error ? 'form-input' : 'form-input error'}>
          <label htmlFor='password'>
            <LockClosedIcon className='form-icon' />
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            className='input-control'
            type='password'
            name='password'
            placeholder='Password'
            value={password}
          />
        </div>

        <button type='submit' className='form-button'>
          Submit
        </button>
        <div className='google-btn-wrapper'>
          <a
            className='google-link-wrapper'
            href='http://localhost:5000/api/auth/login/federated/google'
          >
            <div className='google-img-wrapper'>
              <img
                width='20px'
                alt='Google sign-in'
                src='https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA'
              />
            </div>
            {formType === 'register' && <span>Register with Google</span>}
            {formType === 'login' && <span>Login with Google</span>}
          </a>
        </div>
        <div className='form-footer'>
          <Link
            to={formType === 'register' ? '/login' : '/register'}
            className='register-link'
          >
            {formType === 'register' ? 'Login' : 'Register'}
          </Link>
          <Link to='/' className='register-link'>
            Home
          </Link>
        </div>
      </form>
      <img
        src='./images/pexels-kathekth-3049121.jpg'
        alt='Wood furniture and plants'
        className='login-image'
      ></img>
    </div>
  );
}

export default LoginForm;
