import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/sidebar.jsx";
import Dashboard from "./components/dashboard/dashboard";
import Login from "./authentication/login";
import Employee from "./components/employees/employees";

function App() {
  // Simple authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simulate a successful login by setting the authentication state to true
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        {/* Login route (show first) */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Redirect to Login if not authenticated, else show Sidebar with content */}
        <Route path="/" element={isAuthenticated ? <Sidebar /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<Employee />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
