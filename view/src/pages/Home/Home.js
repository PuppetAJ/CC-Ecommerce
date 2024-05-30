import React, { useEffect } from 'react';
import Header from '../../components/Header/Header';

import { useLoginStore } from '../../store/loggedIn';

function Home() {
  const { loggedIn, checkLoggedIn } = useLoginStore();
  useEffect(() => {
    checkLoggedIn();
  }, [checkLoggedIn]);

  return (
    <div className='container'>
      <Header loggedIn={loggedIn} />
    </div>
  );
}

export default Home;
