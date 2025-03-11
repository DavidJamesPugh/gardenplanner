import React, { useEffect, useState } from 'react';
import axios from "axios";
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
  const [users, setUsers] = useState([]);

  // useEffect(() => {
  //   axios.get("http://localhost:5000/users")
  //     .then((response) => setUsers(response.data))
  //     .catch((error) => console.error(error));
  // }, []);
  return (
    <>
      <Router>
        <h1>Users</h1>
        <ul>
          {/* {users.map(user => ( */}
          {/*   <li key={user.id}>{user.name} - {user.email}</li> */}
          {/* ))} */}
        </ul>
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
