import { Link } from 'react-router-dom';
import { UserIcon, BriefcaseIcon } from 'lucide-react';
import '../../frontend/dashboard/dashboard.css'; // Import the CSS file

function Dashboard() {
  // Retrieve the username and role from local storage
  const username = localStorage.getItem('username') || 'Guest';
  const role = localStorage.getItem('role') || 'N/A';

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
        <Link to="/login">
          <button className="dashboard-button">Go to Login Page</button>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
