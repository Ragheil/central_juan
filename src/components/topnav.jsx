import React, { useState, useEffect, useRef } from "react";

export default function NavbarWithSlideMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      {/* Top Navigation */}
      <div className="topnav-container flex flex-row bg-stone-500 h-16 items-center justify-between px-4">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white bg-stone-700 p-2 rounded-md"
        >
          ☰
        </button>
        <h1 className="text-white text-lg">qwendj</h1>
        <button className="text-white bg-stone-700 p-2 rounded-md">Login</button>
      </div>

      {/* Sliding Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-64 bg-stone-700 p-4 text-white transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="text-lg mb-4">Navigation Menu</h2>
        <ul className="space-y-3">
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </div>
    </div>
  );
}
