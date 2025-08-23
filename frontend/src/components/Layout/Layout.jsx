import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const Layout = () => {
  const location = useLocation();

  const noNavPaths = [
    "/admin-dash",
    "/movie-manage",
    "/time-manage",
    "/theatre-manage",
    "/sign-in",
    "/sign-in-admin",
    "/reg-form",
  ];

  const showNavAndFooter = !noNavPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {showNavAndFooter && <Navbar />}
      <main>
        <Outlet />
      </main>
      {showNavAndFooter && <Footer />}
    </>
  );
};

export default Layout;
