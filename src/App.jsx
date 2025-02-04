import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../src/authentication/login'; 
import Dashboard from './dashboard/dashboard'; 
import Payroll from './components/payroll';  // Import the Payroll component

import '../frontend/App.css';

function App() {
  return (
    <Router>
      <div className="app-container">

        <Routes>
          <Route path="/login" element={<Login />} /> 
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/" element={<Login />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
