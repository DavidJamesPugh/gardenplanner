import React, { useState } from 'react';

const Login = ({ setIsLoggedIn }) => {
  // State for username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Handle login button click
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsLoggedIn(true);
        console.log('Logged in successfully:', data);
      } else {
        console.log('Login failed:', data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  // Handle create account button click
  const handleCreateAccount = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/login/createaccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Account created successfully:', data);
      } else {
        console.log('Account creation failed:', data.message);
      }
    } catch (error) {
      console.error('Error during account creation:', error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <div>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      <div>
        <button onClick={handleLogin}>Log In</button>
        <button onClick={handleCreateAccount}>Create Account</button>
      </div>
    </div>
  );
};

export default Login;
