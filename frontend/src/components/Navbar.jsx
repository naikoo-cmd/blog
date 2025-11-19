import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/favicon.svg";

const Navbar = () => {
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

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="px-4 sm:px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 active:bg-primary/95 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm sm:text-base"
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
