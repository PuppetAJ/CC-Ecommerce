import React from 'react';
import HeroProduct from '../HeroProduct/HeroProduct';

function Hero() {
  return (
    <ul className='hero-list'>
      <li className='hero-list-top'>
        <HeroProduct productID={2} />
      </li>
      <li className='hero-list-top col-span-2'>
        <HeroProduct productID={6} />
      </li>
      <li className='hero-list-top'>
        <HeroProduct productID={16} />
      </li>
      <li className='hero-list-bottom col-span-2'>
        <HeroProduct productID={17} />
      </li>
      <li className='hero-list-bottom col-span-2'>
        <HeroProduct productID={13} />
      </li>
    </ul>
  );
}

export default Hero;
