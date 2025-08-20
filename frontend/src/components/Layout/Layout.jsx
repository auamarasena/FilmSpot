import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

const Layout = () => {
  const location = useLocation();

  // Define the paths where the Navbar should NOT be displayed
  const noNavPaths = [
    "/admin-dash",
    "/movie-manage",
    "/time-manage",
    "/theatre-manage",
    "/sign-in",
    "/sign-in-admin",
    "/reg-form",
  ];

  // Check if the current path starts with any of the noNavPaths
  const showNav = !noNavPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {showNav && <Navbar />}
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
