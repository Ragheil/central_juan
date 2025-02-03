import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Function to render the login page
function Login() {
  // State to store the username
  const [username, setUsername] = useState('');
  // State to store the password
  const [password, setPassword] = useState('');
  // Hook to navigate to different pages
  const navigate = useNavigate();

  // Function to handle the login
  const handleLogin = async (e) => {
    // Prevent the default form submission
    e.preventDefault();
    try {
      // Send a POST request to the backend to authenticate the user
      const response = await axios.post(
        'http://localhost/central_juan/backend/login.php',
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      // Display the response message
      alert(response.data.message);
      // If the login is successful, navigate to the dashboard
      if (response.data.message === 'Login successful') {
        navigate('/dashboard');
      }
    } catch (error) {
      // Log any errors that occur during the login
      console.error('Error during login:', error);
      // Display an error message
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
