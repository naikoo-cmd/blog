import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isAdminAuthenticatedSync, startAdminSession } from "../../utils/adminSession";
import { login } from "../../utils/api";

// Toast component (simple, pure CSS+JS, animated)
const Toast = ({ message, type = "info", onClose }) => {
  // Mount/unmount animation
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 350); // Wait for animation
    }, 1900);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        transform: show ? "translateY(0) scale(1)" : "translateY(-48px) scale(0.96)",
        opacity: show ? 1 : 0,
        filter: show ? "none" : "blur(2px)",
        transition: "all 0.33s cubic-bezier(0.61,0.55,0.34,1.18),filter 0.15s",
        zIndex: 50,
        pointerEvents: "none", // Prevent toast intercepting mouse
      }}
      className={`fixed top-7 left-1/2 -translate-x-1/2 px-6 py-3 rounded shadow-xl shadow-primary/20 font-semibold text-sm ${
        type === "success"
          ? "bg-green-500 text-white"
          : type === "error"
          ? "bg-red-500 text-white"
          : "bg-primary text-white"
      }`}
      data-testid="auth-toast"
    >
      {message}
    </div>
  );
};

// Simple fade+slide animation with inline keyframes
const fadeSlideInStyle = {
  animation: "fadeSlideIn 0.7s cubic-bezier(0.6,0.2,0.1,1) both",
};

const styleSheet = `
@keyframes fadeSlideIn {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.98);
    filter: blur(4px);
  }
  50% {
    opacity: 0.3;
    filter: blur(2px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1.0);
    filter: blur(0);
  }
}
`;

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null); // {message, type}
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname ?? "/admin";

  // Inject animation style tag only once
  useEffect(() => {
    if (!document.getElementById("__login_animation_css__")) {
      const styleTag = document.createElement("style");
      styleTag.textContent = styleSheet;
      styleTag.id = "__login_animation_css__";
      document.head.appendChild(styleTag);
    }
  }, []);

  useEffect(() => {
    if (isAdminAuthenticatedSync()) {
      navigate(redirectPath, { replace: true });
    }
  }, [navigate, redirectPath]);

  // Helper: show toast animation with message and type
  function showToast(message, type = "info") {
    setToast({ message, type });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    showToast("Authenticating…", "info");

    try {
      const { username, password } = form;

      if (!username.trim() || !password.trim()) {
        setError("Username and password are required");
        setSubmitting(false);
        showToast("Username and password are required", "error");
        return;
      }

      const response = await login(username.trim(), password);

      if (response.success && response.token) {
        showToast("Login successful!", "success");
        setTimeout(() => {
          startAdminSession(response.token, response.user);
          navigate(redirectPath, { replace: true });
        }, 650); // Let toast be visible a moment before redirect
      } else {
        const errMsg = response.message || "Login failed";
        setError(errMsg);
        showToast(errMsg, "error");
      }
    } catch (err) {
      setError(err.message || "Invalid credentials");
      showToast(err.message || "Invalid credentials", "error");
    } finally {
      setTimeout(() => setSubmitting(false), 650); // hold submit wait for toast
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleBack = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div
          className="w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg bg-white relative"
          style={fadeSlideInStyle}
        >
          <button
            onClick={handleBack}
            className="absolute left-4 top-4 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-primary rounded transition shadow-sm text-sm font-medium"
            type="button"
            tabIndex={-1}
            aria-label="Kembali ke halaman utama"
          >
            &larr; Back
          </button>
          <div className="mb-6 text-center mt-6">
            <h1 className="text-3xl font-bold">
              <span className="text-primary">Admin</span> Login
            </h1>
            <p className="font-light mt-1 text-gray-500">Enter username and password</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="username">
                Username
              </label>
              <input
                autoFocus
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary/70 bg-gray-50"
                required
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary/70 bg-gray-50"
                required
                placeholder="Your password"
              />
            </div>

            {error && (
              <div className="text-red-600 text-xs mt-1" data-testid="login-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 text-white font-semibold rounded-lg bg-primary hover:bg-primary/90 transition disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
