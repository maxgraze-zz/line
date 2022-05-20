import React, { useState } from 'react';
import ChartWidget from './components/ChartWidget';
import './styles.css';

const App = () => {
  const title = 'Unique viewers and editors history';
  return (
    <>
      <div className='App'>
        <header className='App-header'>
          <ChartWidget title={title} />
        </header>
      </div>
    </>
  );
};

export default App;
