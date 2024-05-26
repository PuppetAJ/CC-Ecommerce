import React, { useEffect } from 'react';

function Dashboard() {
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const response = await fetch('http://localhost:5000/api/auth/me', {
      credentials: 'include',
    });
    const data = await response.json();
    console.log(data);
  }
  return (
    <div>
      <header className='App-header'>
        <h1>Dashboard</h1>
      </header>
    </div>
  );
}

export default Dashboard;
