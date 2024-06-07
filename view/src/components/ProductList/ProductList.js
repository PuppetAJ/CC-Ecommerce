import React, { useEffect, useState, useRef } from 'react';
import ProductListCard from '../ProductListCard/ProductListCard';

function ProductList({ mode, setMode }) {
  const activeRef = useRef(
    document.querySelector('.category-list li.selected')
  );
  const [selected, setSelected] = useState(activeRef.current);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // console.log(mode);
    async function fetchData(endpoint) {
      try {
        setLoading(true);
        const response = await fetch(endpoint);
        const data = await response.json();
        setData(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    if (mode === 'All') {
      fetchData('/api/products');
    } else {
      fetchData('/api/products/category/' + mode);
    }
  }, [mode]);

  useEffect(() => {
    setSelected(activeRef.current);
  }, [activeRef, setSelected]);

  useEffect(() => {
    // console.log(activeRef.current);
    // console.log(selected);
    if (selected) {
      selected.classList.add('selected');
    }
  }, [selected]);

  return (
    <div id='products'>
      <div className='product-list-head'>
        <h1>Popular Products</h1>
        <ul className='category-list'>
          <li
            ref={activeRef}
            className='selected'
            onClick={(e) => {
              setMode('All');
              setSelected((prev) => {
                if (prev) {
                  if (prev === e.target) {
                    return prev;
                  }
                  prev.classList.remove('selected');
                }
                return e.target;
              });
            }}
          >
            All Products
          </li>
          <li
            onClick={(e) => {
              setMode('Accessory');
              setSelected((prev) => {
                if (prev) {
                  if (prev === e.target) {
                    return prev;
                  }
                  prev.classList.remove('selected');
                }
                return e.target;
              });
            }}
          >
            Accessory
          </li>
          <li
            onClick={(e) => {
              setMode('Decoration');
              setSelected((prev) => {
                if (prev) {
                  if (prev === e.target) {
                    return prev;
                  }
                  prev.classList.remove('selected');
                }
                return e.target;
              });
            }}
          >
            Decoration
          </li>
          <li
            onClick={(e) => {
              setMode('Furniture');
              setSelected((prev) => {
                if (prev) {
                  if (prev === e.target) {
                    return prev;
                  }
                  prev.classList.remove('selected');
                }
                return e.target;
              });
            }}
          >
            Furniture
          </li>
        </ul>
      </div>
      <div className='product-list'>
        {loading && <div className='lds-dual-ring'></div>}
        {!loading &&
          data.map((product) => (
            <ProductListCard key={product.id} product={product} />
          ))}
      </div>
    </div>
  );
}

export default ProductList;
