import React, { useEffect, useState } from "react";
import bgAdmin from "../../../assets/img/bgAdmin.svg";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./Style.css";
import { Outlet } from "react-router-dom";
import { FaBars } from "react-icons/fa"; // Importing FaBars for the toggle button icon

const DashboardLayout = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 768px)").matches
  );

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setShowSidebar(!mobile); // Hide sidebar on mobile, show on desktop
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navbarLinks = [];

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <>
      <div
        className="flex w-full min-h-screen"
        style={{
          background: `url(${bgAdmin})`,
          color: "#b41318",
          backgroundPosition: "right 0px top 0px",
        }}
      >
        <Sidebar
          showSidebar={showSidebar}
          isMobile={isMobile}
          closeSidebar={toggleSidebar} // Pass toggleSidebar as closeSidebar
        />
        <div
          className={`flex flex-col w-full ${
            !isMobile && showSidebar ? "ml-80" : ""
          }`} // Apply ml-80 only in non-mobile view
        >
          {/* Toggle button visible only when screen width is <= 768px */}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="fixed top-4 left-4 z-50 p-2 bg-[#b41318] text-white rounded-md hover:bg-[#961012] focus:outline-none"
              aria-label="Toggle Sidebar"
            >
              <FaBars size={24} />
            </button>
          )}
          <Navbar navbarLink={navbarLinks} />
          <div className="md:ml-28 ml-8 mt-4 pr-8 pb-8">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
