import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Function to render the login page
function Login() {
  // State to store the username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // Hook to navigate to different pages
  const navigate = useNavigate();

  // Function to handle the login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost/central_juan/backend/login.php',
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      alert(response.data.message);
  
      if (response.data.message === 'Login successful') {
        localStorage.setItem('username', username);
        localStorage.setItem('role', response.data.role);
        navigate('/dashboard'); // Navigate to dashboard if login is successful
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Server error or invalid credentials');
    }
  };
  
  

  // Render the login page
  return (
    <div className="login-container">
      <h1>Login Page</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
