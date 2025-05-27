import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { sidebarlink } from "./sidebarLinks";
import DropdownLink from "./DropdownLink";
import { FiLogOut } from "react-icons/fi";
import adminUser from "../../../assets/icon/user.svg";
import sidebarImage from "../../../assets/img/sidebar.svg";

const Sidebar = ({ showSidebar, isMobile, closeSidebar }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  let login_data;
  if (typeof window !== "undefined") {
    login_data = JSON.parse(`${localStorage.getItem("login_data")}`);
  }
  // eslint-disable-next-line
  const [user, setUser] = useState(login_data);

  console.log(user.user.name);
  return (
    <div
      className={`fixed h-screen ${
        showSidebar
          ? `w-80 ${
              isMobile ? "max-w-[80vw]" : ""
            } translate-x-0 border-r-[1px]`
          : "w-0 -translate-x-80"
      } duration-300 z-50 bg-white`} // z-50 for overlay, bg-white for opacity
      style={{
        background: `url(${sidebarImage})`,
        color: "#b41318",
        backgroundPosition: "right -1px top 1px",
      }}
    >
      <div className="flex flex-col py-1 pl-6">
        <button className="my-10 flex items-center">
          <img src={adminUser} alt="User Profile" />
          <span className="font-medium text-sm ml-2 uppercase">
            {user.user.name}
          </span>
        </button>
      </div>
      <div className="py-0 flex flex-col h-full max-h-sidebar-content">
        {sidebarlink.map((link, index) => {
          return (
            <div className={`${index !== 0 ? "mt-4" : ""}`} key={link.title}>
              {link.links.length > 0 && (
                <h6
                  className="font-bold text-sm uppercase px-6 mb-2"
                  style={{ color: "#b41318" }}
                >
                  {link.title}
                </h6>
              )}
              {link.links.map((link) => {
                const isActive = pathname.startsWith(link.path);
                if (link.dropdown) {
                  return (
                    <DropdownLink
                      key={link.title}
                      pathname={pathname}
                      basepath={link.basepath}
                      icon={<link.icon size={20} />}
                      title={link.title}
                      dropdown={link.dropdown}
                      onClick={isMobile ? closeSidebar : undefined} // Close sidebar on click in mobile
                    />
                  );
                } else {
                  return (
                    <Link
                      to={link.path}
                      key={link.path}
                      className={`sidebarlink ${
                        isActive && "bg-rose-400 text-white active"
                      } hover:bg-rose-400 duration-300`}
                      onClick={isMobile ? closeSidebar : undefined} // Close sidebar on click in mobile
                    >
                      {<link.icon size={20} color="#b41318" />}
                      <span
                        className="font-medium text-sm ml-2"
                        style={{ color: "#b41318" }}
                      >
                        {link.title}
                      </span>
                    </Link>
                  );
                }
              })}
            </div>
          );
        })}
        <button
          className="mt-6 flex items-center pl-6 hover:bg-rose-400 h-12"
          onClick={() => {
            navigate("/");
            localStorage.removeItem("login_data");
            if (isMobile) closeSidebar(); // Close sidebar on logout in mobile
          }}
        >
          <FiLogOut />
          <span className="font-medium text-sm ml-2">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
