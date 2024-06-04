import React, { useState } from 'react';
import { Skeleton } from '@mui/material';
import { PlusIcon } from '@radix-ui/react-icons';
import { IoBagHandleOutline } from 'react-icons/io5';
// import checkCart from '../../store/cart';
import { useCartStore } from '../../store/cart';
import { useLoginStore } from '../../store/loggedIn';
import { useNavigate } from 'react-router-dom';

function ProductListCard({ product, setOpen }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { checkCart } = useCartStore();
  const { checkLoggedIn } = useLoginStore();
  const navigate = useNavigate();

  const handleImageLoaded = () => {
    setIsLoaded(true);
  };

  return (
    <>
      {/* {isLoaded && ( */}
      <div className='product-list-card'>
        <figure className='product-list-figure has-before'>
          {product.stock_quantity === 0 && isLoaded && (
            <div className='stock-quantity'>Out of stock</div>
          )}
          <img
            className='product-list-img'
            onLoad={handleImageLoaded}
            src={`./images/${product.img_name}`}
            style={{ display: isLoaded ? 'block' : 'none' }}
            alt={product.name}
          />

          {isLoaded && (
            <div className='product-actions'>
              <button
                className='product-action-btn'
                onClick={async () => {
                  const response = await fetch(`/api/cart`, {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify({
                      product_id: product.id,
                      quantity: 1,
                    }),
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  });

                  if (response.status === 200) {
                    checkCart();
                    setOpen(true);
                  } else {
                    await checkLoggedIn();
                    console.log(response);
                    console.log(product);
                    if (response.status === 401) {
                      navigate('/login');
                    }
                  }
                }}
              >
                <PlusIcon className='product-icon' />
              </button>
              <button
                className='product-action-btn'
                onClick={() => {
                  setOpen(true);
                }}
              >
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
        {!isLoaded && (
          <div>
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
      </div>
    </>
  );
}

export default ProductListCard;
