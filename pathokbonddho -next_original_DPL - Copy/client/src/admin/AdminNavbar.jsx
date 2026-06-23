import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";

function AdminNavbar({ toggleSidebar }) {  // Accept toggleSidebar function as a prop
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, LogoutUser } = useAuth();

  const handleLogout = () => {
    LogoutUser();
    navigate("/login");
  };

  return (
    <nav className="sb-topnav custom-font-initial navbar navbar-expand navbar-dark bg-dark">
      <a className="navbar-brand ps-3" href="#">
        Admin Panel
      </a>

      {/* Sidebar Toggle Button */}
      <button
        className="btn btn-light btn-sm order-1 order-lg-0 me-4 me-lg-0"
        id="sidebarToggle"
        onClick={toggleSidebar} // Call the toggle function
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Navbar Search */}
      <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
        <div className="input-group">
          <input className="form-control" type="text" placeholder="Search for..." />
          <button className="btn btn-primary" id="btnNavbarSearch" type="button">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </form>

      {/* Navbar */}
      <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            id="navbarDropdown"
            href="#"
            role="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
          >
            <i className="fas fa-user fa-fw"></i>
          </a>
          <ul className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? 'show' : ''}`}>
            <li><a className="dropdown-item" href="#!">Settings</a></li>
            <li><a className="dropdown-item" href="#!">Activity Log</a></li>
            <li><hr className="dropdown-divider" /></li>
            {isLoggedIn ? (
              <li>
                <button type="button" onClick={handleLogout} className="btn w-100 dropdown-item btn-danger">
                  Logout
                </button>
              </li>
            ) : null}
          </ul>
        </li>
      </ul>
    </nav>
  );
}

export default AdminNavbar;
