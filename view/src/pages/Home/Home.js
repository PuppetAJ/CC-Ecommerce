import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Hero from '../../components/Hero/Hero';
import MidSection from '../../components/MidSection/MidSection';
import { useLoginStore } from '../../store/loggedIn';
import ProductList from '../../components/ProductList/ProductList';
import Blog from '../../components/Blog/Blog';
import Newsletter from '../../components/Newsletter/Newsletter';
import Footer from '../../components/Footer/Footer';

function Home() {
  const { checkLoggedIn } = useLoginStore();
  const [mode, setMode] = useState('All');
  const [open, setOpen] = useState(false);
  useEffect(() => {
    checkLoggedIn();
  }, [checkLoggedIn]);

  return (
    <div className='container'>
      <Header open={open} setOpen={setOpen} />
      <Hero />
      <MidSection />
      <ProductList setOpen={setOpen} mode={mode} setMode={setMode} />
      <Blog />
      <Newsletter />
      <Footer />
    </div>
  );
}

export default Home;
