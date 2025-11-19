import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isAdminAuthenticated, startAdminSession } from "../../utils/adminSession";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname ?? "/admin";

  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate(redirectPath, { replace: true });
    }
  }, [navigate, redirectPath]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setTimeout(() => {
      const { username, password } = form;
      const validUsername = username.trim().toLowerCase() === "admin";
      const validPassword = password.trim() === "admin123";

      if (!validUsername || !validPassword) {
        setError("Invalid credentials. Try admin / admin123 while DB is offline.");
        setSubmitting(false);
        return;
      }

      startAdminSession();
      setSubmitting(false);
      navigate(redirectPath, { replace: true });
    }, 500);
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg bg-white">
        <div className="mb-6 text-center">
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
  );
};

export default Login;
