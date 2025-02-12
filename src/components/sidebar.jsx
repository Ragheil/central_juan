import React, { useState } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom"; 
import { LogOut } from "lucide-react"; 
import { useSession } from '../context/SessionContext'; // Import the context

const Navbar = () => {
  const { user } = useSession(); // Access user from context
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Define menu items for navigation
  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Employee", path: "/employees" },
    { name: "Attendance", path: "/attendance" },
    { name: "Department", path: "/department" },
  ];

  // Optionally, you can add admin-specific items
  const adminMenuItems = [
    { name: "Admin Panel", path: "/admin" },
    // Add more admin-specific items here
  ];

  const toggleSettingsDropdown = () => setShowSettingsDropdown(!showSettingsDropdown);
  const openLogoutModal = () => setShowLogoutModal(true);
  const cancelLogout = () => setShowLogoutModal(false);
  const confirmLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");
    setShowLogoutModal(false);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <div className="text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/src/assets/cjrb.png" alt="Logo" className="w-20 h-20" />
        </div>

        <div className="flex justify-end flex-2 ml-4 mr-4">
          <nav className="flex space-x-4 p-3 rounded-full">
            {/* Render admin menu items if the user is an admin */}
            {user && user.role === 'admin' && adminMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-full text-white transition-all duration-300 ${
                  location.pathname === item.path ? "bg-black" : "bg-gray-600 hover:bg-gray-500"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
    {/* Middle Section: Navigation Links */}
    <div className="flex justify-end flex-2 ml-4 mr-4">
      <nav className="flex space-x-4 bg-gray-600 font-albert p-3 rounded-full">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-4 py-2 rounded-full text-white transition-all duration-300 ${
              location.pathname === item.path ? "bg-black" : "bg-gray-600 hover:bg-gray-500"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>

        <div className="relative">
          <button
            onClick={toggleSettingsDropdown}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center"
          >
            <span>Settings</span>
          </button>

          {showSettingsDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg">
              <button
                onClick={openLogoutModal}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg flex items-center"
              >
                <LogOut size={18} className="mr-2" /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto p-4">
        <Outlet />
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl mb-4">Are you sure you want to log out?</h2>
            <div className="flex justify-end space-x-4">
              <button onClick={cancelLogout} className="px-4 py-2 bg-gray-300 rounded">
                No
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;