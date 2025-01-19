import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CreateGarden from './pages/CreateGarden';
import Login from './pages/Login';
import MyGardens from './pages/MyGardens';
import VegetableLibrary from './pages/VegetableLibrary';
import GardenCanvas from './components/GardenCanvas.jsx';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulate login status

  return (
    <>
      <Router>
        <Navbar isLoggedIn={isLoggedIn}/>
        <div className="content-container">
          <Routes>
            <Route path="/" element={<CreateGarden/>}/>
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>}/>
            <Route path="/my-gardens" element={<MyGardens/>}/>
            <Route path="/vegetable-library" element={<VegetableLibrary/>}/>
          </Routes>
        </div>
      </Router>
    </>
);
};

export default App;
