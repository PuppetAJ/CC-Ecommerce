import React from 'react';
import { ArrowRightIcon, PlusIcon } from '@radix-ui/react-icons';

function Blog() {
  return (
    <div id='blogs'>
      <div className='blog-head'>
        <h1>Explore our blog</h1>
        <div className='blog-head-view'>
          <h4>View All</h4>
          <ArrowRightIcon className='arrow-icon' />
        </div>
      </div>
      <ul className='blog-list'>
        <li className='blog-list-item'>
          <figure className='blog-fig'>
            <img src='./images/blog-1.jpg' alt='blog1' />
            <div className='blog-sticky'>
              <p>Read More</p>
              <PlusIcon />
            </div>
          </figure>

          <h2>Unique products that will impress your home in 2022.</h2>
          <ul className='card-meta'>
            <li>November 27, 2022</li>
            <li className='blog-hover'>Admin</li>
            <li>
              in <span className='blog-hover'>deco</span>
            </li>
          </ul>
        </li>
        <li className='blog-list-item'>
          <figure className='blog-fig'>
            <img src='./images/blog-2.jpg' alt='blog1' />
            <div className='blog-sticky'>
              <p>Read More</p>
              <PlusIcon />
            </div>
          </figure>

          <h2>Navy Blue & White Striped Area Rugs.</h2>
          <ul className='card-meta'>
            <li>November 25, 2022</li>
            <li className='blog-hover'>Admin</li>
            <li>
              in <span className='blog-hover'>deco</span>
            </li>
          </ul>
        </li>
        <li className='blog-list-item'>
          <figure className='blog-fig'>
            <img src='./images/blog-3.jpg' alt='blog1' />
            <div className='blog-sticky'>
              <p>Read More</p>
              <PlusIcon />
            </div>
          </figure>

          <h2>Furnex White Coated Staircase Floating.</h2>
          <ul className='card-meta'>
            <li>November 18, 2022</li>
            <li className='blog-hover'>Admin</li>
            <li>
              in <span className='blog-hover'>deco</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}

export default Blog;
