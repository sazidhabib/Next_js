import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../admin/AdminNavbar";
import AdminSidebar from "../admin/AdminSidebar";

const AdminPanel = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);

      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="admin-layout vh-100 d-flex flex-column overflow-hidden">
      {/* Fixed Navbar */}
      <AdminNavbar toggleSidebar={toggleSidebar} className="fixed-top" />

      <div className="d-flex flex-grow-1 position-relative">
        {/* Mobile Overlay */}
        {isMobile && isSidebarOpen && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            style={{
              zIndex: 1030,
              top: '56px' // Start below navbar
            }}
            onClick={closeSidebar}
          ></div>
        )}

        {/* Sidebar - Different behavior for mobile vs desktop */}
        {isMobile ? (
          // Mobile Sidebar - Fixed position that overlays
          <div
            className={`position-fixed h-100 overflow-y-auto bg-dark text-white`}
            style={{
              top: "56px",
              left: "0",
              zIndex: 1040,
              width: "250px",
              transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
              transition: "transform 0.3s ease",
              maxHeight: "calc(100vh - 56px)",
              boxShadow: isSidebarOpen ? "2px 0 10px rgba(0,0,0,0.3)" : "none"
            }}
          >
            <AdminSidebar isSidebarOpen={isSidebarOpen} />
          </div>
        ) : (
          // Desktop Sidebar - Normal flow
          <div
            className={`h-100 overflow-y-auto bg-dark text-white`}
            style={{
              width: isSidebarOpen ? "250px" : "0",
              minWidth: isSidebarOpen ? "250px" : "0",
              maxHeight: "calc(100vh - 56px)",
              transition: "all 0.3s ease",
              flexShrink: 0
            }}
          >
            <AdminSidebar isSidebarOpen={isSidebarOpen} />
          </div>
        )}

        {/* Main Content Area */}
        <div
          className="flex-grow-1 d-flex flex-column"
          style={{
            overflow: "auto",
            maxHeight: "calc(100vh - 56px)",
            width: "100%",
            marginLeft: !isMobile && isSidebarOpen ? "0" : "0"
          }}
          onClick={() => isMobile && isSidebarOpen && closeSidebar()}
        >
          <main className="p-3">
            <div className="container-fluid">
              <Outlet />
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;