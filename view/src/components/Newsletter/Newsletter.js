import React from 'react';
import { ArrowRightIcon } from '@radix-ui/react-icons';

function Newsletter() {
  return (
    <div className='newsletter'>
      <div className='newsletter-head'>
        <h1>Subscribe to our newsletter</h1>
        <p>Subscribe our newsletter and get discount 50% off.</p>
      </div>
      <form className='newsletter-form'>
        <div className='newsletter-input-wrapper'>
          <input type='email' placeholder='Enter your email address' />
          <button className='arrow-icon-newsletter' type='submit'>
            <ArrowRightIcon />
          </button>
        </div>
      </form>
    </div>
  );
}

export default Newsletter;
