import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Hero from '../../components/Hero/Hero';
import MidSection from '../../components/MidSection/MidSection';
import ProductList from '../../components/ProductList/ProductList';
import Blog from '../../components/Blog/Blog';
import Newsletter from '../../components/Newsletter/Newsletter';
import Footer from '../../components/Footer/Footer';
import { useLoginStore } from '../../store/loggedIn';
import { useCartStore } from '../../store/cart';

function Home() {
  const { checkLoggedIn, loggedIn } = useLoginStore();
  const { checkCart } = useCartStore();
  const [mode, setMode] = useState('All');
  useEffect(() => {
    checkLoggedIn();
  }, [checkLoggedIn]);

  useEffect(() => {
    if (loggedIn) {
      checkCart();
    }
  }, [loggedIn, checkCart]);

  return (
    <div className='container'>
      <Header />
      <Hero />
      <MidSection />
      <ProductList mode={mode} setMode={setMode} />
      <Blog />
      <Newsletter />
      <Footer />
    </div>
  );
}

export default Home;
