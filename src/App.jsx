import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext'; // Create SessionContext
import Login from '../src/authentication/login';
import Dashboard from './components/dashboard/dashboard';
import Sidebar from './components/sidebar';
import Employees from './components/employees/employees';
import Department from './components/departments/department';
import Positions from './components/departments/positions/positions';
import Attendance from './components/attendance/attendance';
import '../Styles/App.css';

function App() {
  return (
    <SessionProvider>
      <Router>
      <Routes>
        {/* Login route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route path="/" element={<Sidebar />}>
          <Route index element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/employees" element={<Employees />} /> 
           <Route path="/department" element={<Department />} /> 
           <Route path="/positions" element={<Positions />} /> 
           <Route path="/attendance" element={<Attendance />} /> 



        </Route>
      </Routes>
      </Router>
    </SessionProvider>
  );
}

export default App;