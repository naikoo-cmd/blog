import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/favicon.svg";
import useTheme from "../hooks/useTheme.js";

const Navbar = () => {
  const location = useLocation();
  const isBlogDetailPage = location.pathname.startsWith("/blog/") && location.pathname !== "/blog";
  const { theme, toggleTheme } = useTheme();

  const handleLogin = () => {
    // Redirect to the login page
    window.location.href = "/admin";
  };

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-bold text-primary hover:text-primary/80 transition-colors"
          >
            <img src={logo} alt="logo" className="w-10 h-10" />
            <span className="hidden sm:inline">Blog | Nico Aramy</span>
            <span className="sm:hidden">Blog</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="p-2 rounded-full border border-primary/20 text-primary hover:bg-primary/10 transition-colors duration-200"
            >
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v1.5m0 12v1.5M5.636 5.636l1.06 1.06m10.607 10.607l1.06 1.06M4.5 12H6m12 0h1.5m-2.804-6.364l-1.06 1.06m-7.778 7.778l-1.06 1.06M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                  />
                </svg>
              )}
            </button>

            {/* Login Button - Hidden on blog detail pages */}
            {!isBlogDetailPage && (
              <button
                onClick={handleLogin}
                className="px-4 sm:px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 active:bg-primary/95 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm sm:text-base"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
