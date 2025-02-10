import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom"; // Import useNavigate
import { ChevronDown, LogOut } from "lucide-react"; 

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [settingsDropdown, setSettingsDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: "📊" },
    { path: "/employees", name: "Employees", icon: "👥" },
    {path: "/department", name: "Department", icon: "🏢"},
  ];

  // Functions for logout modal
  const openLogoutModal = () => setShowLogoutModal(true);
  const cancelLogout = () => setShowLogoutModal(false);

  const confirmLogout = () => {
    // 1. Clear stored authentication data (localStorage/sessionStorage)
    localStorage.removeItem("token"); // Replace "token" with your auth key
    sessionStorage.removeItem("user");

    // 2. Redirect to login page
    navigate("/login");

    // 3. Close the modal
    setShowLogoutModal(false);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header with search bar and settings */}
      <header className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My App</h1>

        {/* Search Bar */}
        <div className="flex items-center w-full max-w-xl">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 rounded-md bg-white text-black w-full"
          />
        </div>

        {/* Settings Dropdown Button */}
        <div className="relative ml-auto">
          <button
            onClick={() => setSettingsDropdown(!settingsDropdown)}
            className="flex items-center bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-black"
          >
            <span>Settings</span>
            <ChevronDown size={18} className="ml-2" />
          </button>

          {settingsDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md">
              <button
                onClick={openLogoutModal}
                className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
              >
                <LogOut size={18} className="mr-3" />
                Log Out
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`h-full bg-blue-600 text-white transition-all duration-300 ${
            isHovered ? "w-48" : "w-16"
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Logo */}
          <div className="flex items-center justify-center h-16">
            <h1 className="text-2xl font-bold">{isHovered ? "Logo" : "⚡"}</h1>
          </div>

          {/* Menu Items */}
          <nav className="mt-4">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="flex items-center px-4 py-3 hover:bg-blue-500"
              >
                <span className="text-lg">{item.icon}</span>
                {isHovered && <span className="ml-3">{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>

        {/* Dynamic Content (Dashboard, Employees, etc.) */}
        <div className="flex-1  overflow-auto">
          <Outlet />
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
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
  );
};

export default Sidebar;
