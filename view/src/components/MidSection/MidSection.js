import React from 'react';
import { PlayIcon } from '@radix-ui/react-icons';

function MidSection() {
  const handleMouseOver = () => {
    const el = document.querySelector('#about-img');
    el.classList.add('hover-effect');
  };

  const handleMouseOut = () => {
    const el = document.querySelector('#about-img');
    el.classList.remove('hover-effect');
  };
  return (
    <div id='about'>
      <h2 className='mr-de-haviland-regular section-title'>Furnex Store</h2>
      <p className='section-text'>
        When you start with a portrait and search for a pure form, a clear
        volume, through successive eliminations, you arrive inevitably at the
        egg. Likewise, starting with the egg and following the same process in
        reverse, one finishes with the portrait.
      </p>
      <div
        className='about-card'
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        <figure className='about-img-container'>
          <img
            src='./images/about-banner.jpg'
            alt='placeholder'
            id='about-img'
          />
        </figure>
        <PlayIcon className='about-play-icon' />
      </div>
    </div>
  );
}

export default MidSection;
