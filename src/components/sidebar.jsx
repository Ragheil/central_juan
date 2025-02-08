import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: "📊" },
    { path: "/employees", name: "Employees", icon: "👥" },
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Header with search bar */}
      <header className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My App</h1>
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 rounded-md bg-white text-black w-full max-w-xl"
        />
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
        <div className="flex-1 p-6 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
