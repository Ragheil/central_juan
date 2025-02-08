import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext'; // Create SessionContext
import Login from '../src/authentication/login';
import Dashboard from './components/dashboard/dashboard';
import Sidebar from './components/sidebar';
 import Employees from './components/employees/employees';
 import Department from './components/departments/department';
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

        </Route>
      </Routes>
      </Router>
    </SessionProvider>
  );
}

export default App;