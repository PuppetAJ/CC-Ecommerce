import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Cross1Icon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cart';
import { useLoginStore } from '../../store/loggedIn';

function ProductModal({
  handleClose,
  openDialog,
  setOpenDialog,
  isLoaded,
  product,
}) {
  const navigate = useNavigate();
  const [inCart, setInCart] = useState(false);
  const { checkCart, setCartOpen, cart } = useCartStore();
  const { checkLoggedIn } = useLoginStore();

  useEffect(() => {
    const productInCart = cart.find((item) => item.product_id === product.id);
    if (productInCart) {
      setInCart(true);
    }
  }, [cart, product.id]);
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby='customized-dialog-title'
      open={openDialog}
      maxWidth='md'
    >
      <DialogContent>
        <div className='dialog-content'>
          <figure className='dialog-figure'>
            {product.stock_quantity === 0 && isLoaded && (
              <div className='stock-quantity'>Out of stock</div>
            )}
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
                className={
                  product.stock_quantity !== 0 && !inCart
                    ? 'add-to-cart-btn'
                    : 'add-to-cart-btn disabled'
                }
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
                    setCartOpen(true);
                    setOpenDialog(false);
                  } else {
                    await checkLoggedIn();
                    if (response.status === 401) {
                      navigate('/login');
                    }
                  }
                }}
              >
                {inCart
                  ? 'In Cart'
                  : product.stock_quantity === 0
                  ? 'Out of Stock'
                  : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductModal;
