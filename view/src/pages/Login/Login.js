import React from 'react';

function Login() {
  return (
    <div>
      <header className='App-header'>
        <h1>Login</h1>
      </header>
      <a
        href='http://localhost:5000/api/auth/login/federated/google'
        target='_blank'
        rel='noreferrer'
      >
        Login with google
      </a>
    </div>
  );
}

export default Login;
