import React from 'react';

function ProductListCard({ product }) {
  // console.log(product.stock_quantity);
  return (
    <div className='product-list-card'>
      <img src={`./images/${product.img_name}`} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </div>
  );
}

export default ProductListCard;
