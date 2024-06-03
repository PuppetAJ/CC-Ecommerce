import React, { useState } from 'react';
import { Skeleton } from '@mui/material';
import { PlusIcon } from '@radix-ui/react-icons';
import { IoBagHandleOutline } from 'react-icons/io5';

function ProductListCard({ product }) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoaded = () => {
    setIsLoaded(true);
  };

  const handleMouseOver = (e) => {
    const el = e.target.closest('.product-list-img');
    // access the parent then search through its children
    const parent = e.target.closest('#product-list-figure');
    const el2 = parent.children[parent.children.length - 1];

    el2.classList.add('product-anim');
    el.classList.add('hover-effect-2');
  };

  const handleMouseOut = (e) => {
    const el = e.target.closest('.product-list-img');
    const parent = e.target.closest('#product-list-figure');
    const el2 = parent.children[parent.children.length - 1];

    if (!parent.contains(e.relatedTarget)) {
      el.classList.remove('hover-effect-2');
      el2.classList.remove('product-anim');
    }
  };

  return (
    <>
      <div className='product-list-card'>
        <figure id='product-list-figure'>
          {product.stock_quantity === 0 && isLoaded && (
            <div className='stock-quantity'>Out of stock</div>
          )}
          <img
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            className='product-list-img'
            onLoad={handleImageLoaded}
            src={`./images/${product.img_name}`}
            style={{ display: isLoaded ? 'block' : 'none' }}
            alt={product.name}
          />

          {isLoaded && (
            <div className='product-actions'>
              <button className='product-action-btn'>
                <PlusIcon className='product-icon' />
              </button>
              <button className='product-action-btn'>
                <IoBagHandleOutline className='product-icon' />
              </button>
            </div>
          )}
        </figure>

        {isLoaded && (
          <div>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </div>
        )}
      </div>
      {!isLoaded && (
        <div className='product-list-card'>
          <Skeleton
            variant='rectangular'
            width={'18.75rem'}
            height={'18.75rem'}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Skeleton variant='text' width={'10rem'} height={'2rem'} />
            <Skeleton variant='text' width={'5rem'} height={'2rem'} />
          </div>
        </div>
      )}
    </>
  );
}

export default ProductListCard;
