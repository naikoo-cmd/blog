import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  {
    label: "Dashboard",
    to: "/admin",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M3 12l9-9 9 9" />
        <path d="M9 21V9h6v12" />
      </svg>
    ),
  },
  {
    label: "Add Blog",
    to: "/admin/addBlog",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12M6 12h12" />
      </svg>
    ),
  },
  {
    label: "List Blog",
    to: "/admin/listBlog",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
  },
  {
    label: "Comments",
    to: "/admin/comments",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 12c0 4.97-4.03 9-9 9a9.6 9.6 0 01-4.19-.95L3 21l.95-4.19A9.6 9.6 0 013 12c0-4.97 4.03-9 9-9s9 4.03 9 9z"
        />
      </svg>
    ),
  },
];

const Sidebar = ({ onNavigate, onLogout }) => {
  const navigate = useNavigate();

  const handleBackToSite = () => {
    navigate("/");
    if (onNavigate) onNavigate();
  };

  return (
    <div className="flex flex-col h-full border-r border-gray-100">
      <div className="px-6 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
            MB
          </div>
          <div>
            <p className="text-sm text-gray-500">Admin Area</p>
            <p className="text-xl font-semibold text-gray-800">MyBlog</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/admin"}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive ? "bg-primary text-white shadow-md shadow-primary/20" : "text-gray-600 hover:bg-primary/10"
              }`
            }
          >
            <span className="text-gray-400">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 pb-6 space-y-3">
        <button
          onClick={handleBackToSite}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l-7 7 7 7" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20" />
          </svg>
          Back to Site
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4-4-4" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 12h14" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h6M3 19h6" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
