import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import "boxicons/css/boxicons.min.css";
import "../styles/sidebar.css";
function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <nav ref={sidebarRef}  className={`sidebar ${isSidebarOpen ? "" : "close"}`}>
      <header className="py-2">
        <i
          className={`bx ${
            isSidebarOpen ? "bx-chevron-left" : " bx-chevron-right"
          } toggle`}
          onClick={toggleSidebar}
        ></i>
      </header>
      <div className="menu-bar">
        <ul className="menu-links">
          <li className="nav-link">
            <NavLink to="/">
              <i className="bx bx-home-alt icon text-[#adb5bd]"></i>
              <span className="text nav-text">Dashboard</span>
            </NavLink>
          </li>
          <li className="nav-link">
            <NavLink to="/topics-list">
            <i className='bx bx-list-ol icon text-[#adb5bd]'></i>
              <span className="text nav-text">Keywords list</span>
            </NavLink>
          </li>
          <li className="nav-link">
            <NavLink to="/packages">
            <i className='bx bx-package icon text-[#adb5bd]'></i>
              <span className="text nav-text">Packages</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Sidebar;
