import { Link } from 'react-router-dom';

function dashboard() {
  // Retrieve the username and role from local storage
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  return (
    <div className="dashboard-container">
      <h1>Welcome to the Dashboard</h1>
      {/* Display the username and role */}
      <p>Logged in as: {username}</p>
      <p>Role: {role}</p>
      <Link to="/login">Go to Login Page</Link>
    </div>
  );
}

export default dashboard;
