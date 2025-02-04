import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserIcon, BriefcaseIcon } from 'lucide-react';
import '../../frontend/dashboard/dashboard.css'; // Import the CSS file

function Dashboard() {
  // Retrieve the username and role from local storage
  const username = localStorage.getItem('username') || 'Guest';
  const role = localStorage.getItem('role') || 'N/A';

  const [showPopup, setShowPopup] = useState(false); // State for controlling the logout popup visibility

  const handleLogout = () => {
    setShowPopup(true); // Show the confirmation popup
  };

  const confirmLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setShowPopup(false); // Close the popup
    window.location.href = "/login"; // Redirect to the login page
  };

  const cancelLogout = () => {
    setShowPopup(false); // Close the popup without logging out
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h1>Welcome to the Dashboard</h1>
        </div>
        <div className="dashboard-info">
          <div>
            <UserIcon size={18} style={{ color: '#4a5568' }} />
            <p>Username: <span>{username}</span></p>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <BriefcaseIcon size={18} style={{ color: '#4a5568' }} />
            <p>Role: <span>{role}</span></p>
          </div>
        </div>

        <div className="logout-container">
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>

      {/* Right Navigation Menu */}
      <div className="left-nav">
        <ul>
          <li><Link to="/payroll">Payroll</Link></li>
          {/* You can add more links here as needed */}
        </ul>
      </div>

      {/* Popup for logout confirmation */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Are you sure you want to log out?</h2>
            <div className="popup-buttons">
              <button onClick={confirmLogout} className="popup-confirm">Yes</button>
              <button onClick={cancelLogout} className="popup-cancel">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
