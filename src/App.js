import React from 'react';
import './App.css';
import CityGame from './CityGame';

function App() {
  return (
    <div className="App" style={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <CityGame />
    </div>
  );
}

export default App;
