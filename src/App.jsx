import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext'; // Create SessionContext
import Login from '../src/authentication/login';
import Dashboard from './dashboard/dashboard';
import Employees from './components/employees/employees';
import Topnav from './components/topnav';
import '../Styles/App.css';

function App() {
  return (
    <SessionProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/topnav" element={<Topnav/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </SessionProvider>
  );
}

export default App;
