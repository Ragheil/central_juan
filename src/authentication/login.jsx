import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../Styles/authentication/login.css'; 
import { useSession } from '../context/SessionContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { setUser } = useSession();
  const bgmainLogin = '/src/assets/bg_mainlogin.jpg';

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://10.0.254.104/central_juan/backend/login.php',
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
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="login-container flex flex-row h-screen w-screen"> 
      <div className='flex flex-2 bg-[url(${bgmainLogin})] bg-no-repeat bg-cover '>
        <div className=' logo-container flex flex-col flex-2 justify-center items-center'>
          <div className='sm:w-30 md:w-50 lg:w-50 pb-50'>
            <img src="../../src/assets/cjrb.png" alt="Central Logo"/>
          </div>
          <div className='w-sm italic text-center justify-center font-bold items-center'>
            <h2>Central Juan IT Solutions offers a full breadth of products and services that boast quality, reliability, and the most value in their category supplied only by leading IT companies.</h2>
          </div>
        </div>
      </div>

      <div className="login-form-section flex-col bg-[url('/src/assets/bg_login.png')]  rounded-l-3xl flex flex-1 justify-center items-center">
      <div className="HRIS text-2xl colo pb-5 text-white text-5xl">
        <h1 className=''>HRIS!</h1>
      </div>
        <div className='login-form rounded-lg lg:w-96 sm:50'>
          <form onSubmit={handleLogin} className='flex flex-col justify-center items-center'>
            <input 
              placeholder='Username' 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              className="p-2 pl-4 bg-white w-full mb-5 border rounded-lg"
            />
            
            {/* Wrap the password input and visibility toggle inside a relative container */}
            <div className="relative w-full mb-5">
              <input 
                placeholder='Password' 
                type={passwordVisible ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="p-2 pl-4 bg-white w-full border rounded-lg"
              />
              
              {/* Password visibility icon */}
              <span 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" 
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? '👁️' : '🙈'}
              </span>
            </div>

            <button className='bg-blue-400 h-10 sm:w-25 lg:w-50 rounded-lg cursor-pointer ' type="submit">Login</button>
          </form>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default Login;
