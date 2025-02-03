// Dashboard.jsx
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1>Welcome to the Dashboard</h1>
      <p>You are logged in!</p>
      <Link to="/login">Go to Login Page</Link>
    </div>
  );
}

export default Dashboard;
