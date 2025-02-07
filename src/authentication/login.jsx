import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../Styles/authentication/login.css'; // Import the CSS file
import { useSession } from '../context/SessionContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // State to store error message
  const navigate = useNavigate();
  const { setUser } = useSession();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost/central_juan/backend/login.php',
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.message === 'Login successful') {
        setUser({ username, role: response.data.role });
        navigate('/dashboard');
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('Server error or invalid credentials');
      openModal();
      setErrorMessage('Server error or invalid credentials');
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Modal functionality
  const openModal = () => {
    document.getElementById("errorModal").style.display = "block";
  };

  const closeModal = () => {
    document.getElementById("errorModal").style.display = "none";
  };

  return (
    <div className="login-container flex bg-indigo-700 justify-center items-center h-screen w-screen"> 
        <div>
          <img src="../../frontend/images/central_logo.png" alt="Central Logo" className="logo" />
        </div>
        <div className="login-form-section">
            <form onSubmit={handleLogin}>
            <div>
              <input placeholder='Username' type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="relative">
              <input 
                placeholder='Password' 
                type={passwordVisible ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="p-2 pl-4 pr-10 w-full border rounded-lg"
              />
              <span 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer pb-3" 
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? '👁️' : '🙈'}
              </span>
            </div>

            <button type="submit">Login</button>
          </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>

        {/* Error Modal */}
        <div id="errorModal" className="modal">
          <div className="modal-content">
            <p>{errorMessage}</p>
            <button className="ok-button" onClick={closeModal}>OK</button>
          </div>
        </div>
      </div>
  );
}

export default Login;
