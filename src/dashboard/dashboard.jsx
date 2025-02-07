import { useSession } from '../context/SessionContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserIcon, BriefcaseIcon } from 'lucide-react';
import { useState } from 'react';
import '../../Styles/dashboard/dashboard.css';

function Dashboard() {
  const { user, setUser } = useSession();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const handleLogout = () => {
    setShowPopup(true);
  };

  const confirmLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const cancelLogout = () => {
    setShowPopup(false);
  };

  return (
    <div className='dashboard-container flex flex-col h-screen w-screen bg-red-500 '>
      <div className='header-container flex h-20 w-full items-center justify-between bg-white px-4' >
        <button></button>
        <h1>central_juan</h1>
        <div>settings</div>
      </div>
      
      <div>
        
      </div>
      
    </div>

    // <div className="dashboard-container">
    //   <div className="left-nav">
    //     <Link to="/employees" state={{ user }}>
    //       <button>Employees</button>
    //     </Link>
    //   </div>

    //   <div className="dashboard-card">
    //     <div className="dashboard-header">
    //       <h1>Welcome to the Dashboard</h1>
    //     </div>
    //     <div className="dashboard-info">
    //       <div>
    //         <UserIcon size={18} style={{ color: '#4a5568' }} />
    //         <p>Username: <span>{user?.username || 'Guest'}</span></p>
    //       </div>
    //       <div style={{ marginTop: '0.5rem' }}>
    //         <BriefcaseIcon size={18} style={{ color: '#4a5568' }} />
    //         <p>Role: <span>{user?.role || 'N/A'}</span></p>
    //       </div>
    //     </div>

    //     <div className="logout-container">
    //       <button className="logout-button" onClick={handleLogout}>
    //         Log Out
    //       </button>
    //     </div>

    //     {showPopup && (
    //       <div className="popup">
    //         <div className="popup-content">
    //           <h2>Are you sure you want to log out?</h2>
    //           <div className="popup-buttons">
    //             <button onClick={confirmLogout} className="popup-confirm">Yes</button>
    //             <button onClick={cancelLogout} className="popup-cancel">No</button>
    //           </div>
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // </div>
  );
}

export default Dashboard;
