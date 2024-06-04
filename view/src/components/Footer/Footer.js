import React from 'react';
import {
  IoCallSharp,
  IoLocationSharp,
  IoLogoFacebook,
  IoLogoTwitter,
  IoLogoTumblr,
} from 'react-icons/io5';
import { ArrowRightIcon } from '@radix-ui/react-icons';

function Footer() {
  return (
    <footer>
      <div className='footer-top'>
        <div className='footer-logo'>
          <h1>Furnex</h1>
          <div className='footer-contact'>
            <div className='location-info'>
              <IoLocationSharp className='location-icon' />
              <p>Furnex, Chicago USA 2022</p>
            </div>
            <div className='location-info'>
              <IoCallSharp className='call-icon' />
              <a href='tel:1234567890'>
                <p>+1 234 567 890</p>
              </a>
            </div>
            <div className='socials-info'>
              <IoLogoFacebook className='social-icon' />
              <IoLogoTwitter className='social-icon' />
              <IoLogoTumblr className='social-icon' />
            </div>
          </div>
        </div>
        <div className='footer-links'>
          <h4>Help & Information</h4>
          <ul>
            <li>Help & Contact Us</li>
            <li>Returns & Refunds</li>
            <li>Online Stores</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>
        <div className='footer-social'>
          <h4>About us</h4>
          <ul>
            <li>About Us</li>
            <li>What We Do</li>
            <li>FAQ Page</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div className='footer-newsletter'>
          <h4>Newsletter</h4>
          <form>
            <input type='email' placeholder='Enter your email' />
            <button className='arrow-icon-newsletter' type='submit'>
              <ArrowRightIcon />
            </button>
          </form>
          <ul>
            <li>Terms & Conditions</li>
            <li>Policy</li>
            <li>Map</li>
          </ul>
        </div>
      </div>
      <div className='footer-bottom'>
        <p>&copy; 2022 Furnex. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
