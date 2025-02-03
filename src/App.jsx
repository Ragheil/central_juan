import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../src/authentication/login'; // import Login component
import Dashboard from './dashboard/dashboard'; // import Dashboard component
import '../frontend/App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <h1>React App with Login and Dashboard</h1>

        <Routes>
          <Route path="/login.jsx" element={<Login />} />
          <Route path="/dashboard.jsx" element={<Dashboard />} />
          <Route path="/" element={<Login />} /> {/* Default to Login */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
