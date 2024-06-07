import React, { useState } from 'react';
import { Skeleton } from '@mui/material';
import { PlusIcon, Cross1Icon } from '@radix-ui/react-icons';
import { IoBagHandleOutline } from 'react-icons/io5';
import { useCartStore } from '../../store/cart';
import { useLoginStore } from '../../store/loggedIn';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

function ProductListCard({ product, setOpen }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { checkCart } = useCartStore();
  const { checkLoggedIn } = useLoginStore();
  const navigate = useNavigate();

  const handleImageLoaded = () => {
    setIsLoaded(true);
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Dialog
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={openDialog}
        maxWidth='md'
      >
        {/* <DialogTitle>
          <h2>{product.name}</h2>
        </DialogTitle> */}
        <DialogContent>
          <div className='dialog-content'>
            <figure className='dialog-figure'>
              {product.stock_quantity === 0 && isLoaded && (
                <div className='stock-quantity'>Out of stock</div>
              )}{' '}
              <img src={`./images/${product.img_name}`} alt={product.name} />
            </figure>

            <div className='dialog-meta'>
              <div className='dialog-meta-head'>
                <div className='title-exit'>
                  <h1>{product.name}</h1>
                  <button
                    className='close-dialog-btn'
                    onClick={handleClose}
                    aria-label='Close dialog'
                  >
                    <Cross1Icon />
                  </button>
                </div>

                <div className='stock-price'>
                  <h3>{product.stock_quantity} in stock</h3>
                  <h3>${product.price}</h3>
                </div>
              </div>
              <div className='desc-cart'>
                <p>{product.description}</p>
                <button
                  disabled={product.stock_quantity === 0 ? true : false}
                  className={'add-to-cart-btn'}
                  onClick={async () => {
                    const cart = await fetch(`/api/cart`, {
                      credentials: 'include',
                    });

                    if (cart.status === 401) {
                      navigate('/login');
                      return;
                    }

                    const cartData = await cart.json();

                    const productInCart = cartData.find(
                      (item) => item.product_id === product.id
                    );

                    if (productInCart) {
                      return;
                    }

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
                      setOpenDialog(false);
                    } else {
                      await checkLoggedIn();
                      if (response.status === 401) {
                        navigate('/login');
                      }
                    }
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
                disabled={product.stock_quantity === 0 ? true : false}
                onClick={async () => {
                  const cart = await fetch(`/api/cart`, {
                    credentials: 'include',
                  });

                  if (cart.status === 401) {
                    navigate('/login');
                    return;
                  }

                  const cartData = await cart.json();

                  const productInCart = cartData.find(
                    (item) => item.product_id === product.id
                  );

                  if (productInCart) {
                    return;
                  }

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
                onClick={async () => {
                  const response = await fetch(`/api/auth/me`, {
                    credentials: 'include',
                  });

                  if (response.status === 200) {
                    setOpen(true);
                  } else {
                    await checkLoggedIn();
                    if (response.status === 401) {
                      navigate('/login');
                    }
                  }
                }}
              >
                <IoBagHandleOutline className='product-icon' />
              </button>
            </div>
          )}
        </figure>

        {isLoaded && (
          <div>
            <h3 onClick={handleClickOpen}>{product.name}</h3>
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
