import React, { useState, useEffect, useCallback } from 'react';
import Skeleton from '@mui/material/Skeleton';
import ProductModal from '../ProductModal/ProductModal';

function HeroProduct({ productID }) {
  const [product, setProduct] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchData = useCallback(async () => {
    const response = await fetch(`/api/products/${productID}`);
    const data = await response.json();
    setProduct(data);
  }, [productID]);

  useEffect(() => {
    fetchData();
  }, [fetchData, productID]);

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
      <ProductModal
        handleClose={handleClose}
        openDialog={openDialog}
        isLoaded={isLoaded}
        product={product}
        setOpenDialog={setOpenDialog}
      />
      <div className='hero-card'>
        {!product.name && !product.category && (
          <Skeleton variant='rect' width='100%' height='100%' />
        )}
        <figure className='hero-img-container'>
          <img
            src={`./images/hero-product-${productID}.jpg`}
            alt='placeholder'
            className='hero-img'
            onLoad={handleImageLoaded}
          />
        </figure>
        {!product.name && !product.category && (
          <div className='hero-text'>
            <Skeleton variant='text' width='10rem' height='1.5rem' />
            <Skeleton variant='text' width='8rem' />
          </div>
        )}
        {product.name && product.category && (
          <div className='hero-text'>
            <h3 onClick={handleClickOpen}>{product.name}</h3>
            <p>{product.category}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default HeroProduct;
