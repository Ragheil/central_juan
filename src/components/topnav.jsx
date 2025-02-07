import React, { useState, useEffect, useRef } from "react";

export default function NavbarWithSlideMenu() {
  const [rightMenuOpen, setRightMenuOpen] = useState(false);
  const rightMenuRef = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rightMenuRef.current && !rightMenuRef.current.contains(event.target)) {
        setRightMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close the right menu when opened
  const toggleRightMenu = () => {
    setRightMenuOpen((prev) => !prev);
  };

  return (
    <div>
      {/* Top Navigation */}
      <div className="topnav-container flex flex-row bg-stone-500 h-16 items-center justify-between px-4 sm:px-6 md:px-8">
        {/* Logo or Title */}
        <h1 className="text-white text-lg sm:text-xl md:text-2xl">qwendj</h1>

        {/* Hamburger button for smaller screens */}
        <button
          onClick={toggleRightMenu}
          className="text-white bg-stone-700 p-2 rounded-md hover:bg-stone-600 focus:outline-none sm:hidden"
          aria-label="Toggle right menu"
        >
          ☰
        </button>
      </div>

      {/* Left Sliding Menu (shrinks by default, expands on hover) */}
      <div className="fixed top-0 left-0 h-full w-16 bg-stone-700 p-4 text-white transform transition-all duration-300 ease-in-out hover:w-64 group">
        <div className="flex flex-col items-start">
          <h2 className="text-lg mb-4 text-transparent group-hover:text-white">Left Navigation</h2>
          <ul className="space-y-3 text-transparent group-hover:text-white">
            <li>Home</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>
      </div>

      {/* Right Sliding Menu */}
      <div
        ref={rightMenuRef}
        className={`fixed top-0 right-0 h-full w-64 bg-stone-700 p-4 text-white transform transition-transform duration-300 ease-in-out ${rightMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <h2 className="text-lg mb-4">Right Navigation</h2>
        <ul className="space-y-3">
          <li>Profile</li>
          <li>Settings</li>
        </ul>
      </div>
    </div>
  );
}
