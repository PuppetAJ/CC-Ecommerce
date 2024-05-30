import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Register from './pages/Register/Register';

function App() {
  return (
    <div className='main'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
