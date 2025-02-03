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
          <Route path="/login" element={<Login />} /> {/* Removed .jsx */}
          <Route path="/dashboard" element={<Dashboard />} /> {/* Removed .jsx */}
          <Route path="/" element={<Login />} /> {/* Default to Login */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
