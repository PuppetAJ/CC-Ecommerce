import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Hero from '../../components/Hero/Hero';
import MidSection from '../../components/MidSection/MidSection';

import { useLoginStore } from '../../store/loggedIn';
import ProductList from '../../components/ProductList/ProductList';

function Home() {
  const { loggedIn, checkLoggedIn } = useLoginStore();
  const [mode, setMode] = useState('All');
  useEffect(() => {
    checkLoggedIn();
  }, [checkLoggedIn]);

  return (
    <div className='container'>
      <Header loggedIn={loggedIn} />
      <Hero />
      <MidSection />
      <ProductList mode={mode} setMode={setMode} />
    </div>
  );
}

export default Home;
