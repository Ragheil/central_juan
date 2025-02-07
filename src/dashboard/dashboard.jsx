import { useSession } from '../context/SessionContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserIcon, BriefcaseIcon, Menu, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import '../../Styles/dashboard/dashboard.css';

function Dashboard() {
  const { user, setUser } = useSession();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsDropdown, setSettingsDropdown] = useState(false);

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
    <div className="dashboard-container flex h-screen bg-gray-100">
      {/* Left Navigation Menu */}
      <div
        className={`${
          menuOpen ? 'w-64' : 'w-16'
        } bg-indigo-700 text-white flex flex-col transition-all duration-300`}
      >
        <button
          className="p-4 text-white hover:bg-indigo-600 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu size={24} />
        </button>

        <div className="flex flex-col mt-8 space-y-4">
          <Link
            to="/employees"
            state={{ user }}
            className="flex items-center px-4 py-2 hover:bg-indigo-600"
          >
            <UserIcon size={18} className="mr-3" />
            {menuOpen && <span>Employees</span>}
          </Link>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="flex-1">
        <div className="header-container flex h-20 bg-white items-center justify-between px-4 shadow">
          <h1 className="text-2xl font-semibold">central_juan</h1>

          {/* Settings Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSettingsDropdown(!settingsDropdown)}
              className="flex items-center bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg"
            >
              <span>Settings</span>
              <ChevronDown size={18} className="ml-2" />
            </button>

            {settingsDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
                >
                  <LogOut size={18} className="mr-3" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Popup Confirmation */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl mb-4">Are you sure you want to log out?</h2>
              <div className="flex justify-end space-x-4">
                <button onClick={cancelLogout} className="px-4 py-2 bg-gray-300 rounded">
                  No
                </button>
                <button onClick={confirmLogout} className="px-4 py-2 bg-red-500 text-white rounded">
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
