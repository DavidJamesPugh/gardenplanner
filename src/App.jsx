import React, { useState } from 'react';
import GardenCanvas from './components/GardenCanvas';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Garden Planner</h1>
      </header>
      <main>
        <GardenCanvas />
      </main>
    </div>
  );
}

export default App;