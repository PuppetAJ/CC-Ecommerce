import React, { useState, useEffect, useCallback } from 'react';
import Skeleton from '@mui/material/Skeleton';

function HeroProduct({ productID }) {
  const [product, setProduct] = useState({});

  const fetchData = useCallback(async () => {
    const response = await fetch(`/api/products/${productID}`);
    const data = await response.json();
    setProduct(data);
  }, [productID]);

  useEffect(() => {
    fetchData();
  }, [fetchData, productID]);

  // async function fetchData() {
  //   const response = await fetch(`/api/products/${productID}`);
  //   const data = await response.json();
  //   setProduct(data);
  // }

  return (
    <div className='hero-card'>
      {!product.name && !product.category && (
        <Skeleton variant='rect' width='100%' height='100%' />
      )}
      <figure className='hero-img-container'>
        <img
          src={`./images/hero-product-${productID}.jpg`}
          alt='placeholder'
          className='hero-img'
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
          <h3>{product.name}</h3>
          <p>{product.category}</p>
        </div>
      )}
    </div>
  );
}

export default HeroProduct;
