import React from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';

function Login() {
  return (
    <div className='login-wrapper'>
      <LoginForm formType='login' />
    </div>
  );
}

export default Login;
