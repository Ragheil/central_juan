import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../frontend/authentication/login.css'; // Import the CSS file

// Function to render the login page
function Login() {
  // State to store the username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
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
  
      if (response.data.message === 'Login successful') {
        localStorage.setItem('username', username);
        localStorage.setItem('role', response.data.role);
        navigate('/dashboard'); // Navigate to dashboard if login is successful
      } else {
        // Show alert only for invalid credentials or error message
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Server error or invalid credentials');
    }
  };
  

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Render the login page
  return (
    <div className="login-container">
      <div className="logo-section">
        <img src="../../frontend/images/central_logo.png" alt="Central Logo" className="logo" />
      </div>
      <div className="login-form-section">
        <h1>Login</h1>
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
          <div className="password-container">
            <label>Password:</label>
            <input
              type={passwordVisible ? 'text' : 'password'} // Toggle input type based on visibility
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="eye-icon" onClick={togglePasswordVisibility}>
              {passwordVisible ? '👁️' : '🙈'} {/* Simple eye icon for toggle */}
            </span>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
