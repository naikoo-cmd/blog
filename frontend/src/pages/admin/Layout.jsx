import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import { clearAdminSession } from "../../utils/adminSession";

const Layout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const logout = () => {
    clearAdminSession();
    navigate("/admin/login", { replace: true });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar - Fixed on all screen sizes */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-white shadow-xl transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onNavigate={closeSidebar} onLogout={logout} />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={closeSidebar} />}

      {/* Main Content - Scrollable */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-72">
        {/* Admin Header - Fixed */}
        <header className="sticky top-0 z-30 flex items-center px-4 sm:px-6 py-4 bg-white shadow">
          <button
            className="lg:hidden p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>
        {/* Admin Content - Scrollable */}
        <main className="flex-1 bg-gray-50 p-4 sm:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
