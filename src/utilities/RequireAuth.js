import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { message } from "antd";

const RequireAuth = ({ allowedRoles }) => {
  const location = useLocation();
  let login_data = null;
  let isAuthenticated = false;
  let userRole = null;

  // Safely parse login_data from localStorage
  try {
    if (typeof window !== "undefined") {
      login_data = JSON.parse(localStorage.getItem("login_data") || "{}");
      isAuthenticated =
        login_data &&
        login_data.token &&
        login_data.user &&
        login_data.user.role;
      userRole = isAuthenticated ? login_data.user.role : null;
    }
  } catch (error) {
    console.error("Error parsing login_data:", error);
    localStorage.removeItem("login_data"); // Clear invalid data
    isAuthenticated = false;
  }

  // If not authenticated, redirect to the appropriate login page
  if (!isAuthenticated) {
    const loginPath = allowedRoles.includes("ADMIN")
      ? "/sign-in/admin"
      : allowedRoles.includes("DESA")
      ? "/sign-in/desa"
      : allowedRoles.includes("KADER_POSYANDU")
      ? "/sign-in/kader-posyandu"
      : allowedRoles.includes("TENAGA_KESEHATAN")
      ? "/sign-in/tenaga-kesehatan"
      : "/sign-in";

    message.open({
      type: "error",
      content: "Silakan login terlebih dahulu",
    });

    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // If authenticated but role is not allowed, redirect to the user's dashboard
  if (!allowedRoles.includes(userRole)) {
    const redirectPath =
      userRole === "ORANG_TUA"
        ? "/dashboard"
        : userRole === "KADER_POSYANDU"
        ? "/kader-posyandu/dashboard"
        : userRole === "TENAGA_KESEHATAN"
        ? "/tenaga-kesehatan/dashboard"
        : userRole === "DESA"
        ? "/desa/dashboard"
        : userRole === "ADMIN"
        ? "/admin/dashboard/desa"
        : "/sign-in";

    message.open({
      type: "error",
      content: "Akses ditolak. Anda tidak memiliki izin untuk halaman ini.",
    });

    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If authenticated and role is allowed, render the protected route
  return <Outlet />;
};

export default RequireAuth;
