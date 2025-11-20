import React, { useEffect, useState } from "react";
import { updateAdminAccount, verifyToken } from "../../utils/api.js";
import { startAdminSession } from "../../utils/adminSession.js";

const Settings = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadAdmin = async () => {
      try {
        const response = await verifyToken();
        if (response.success && response.user) {
          setForm((prev) => ({ ...prev, username: response.user.username || "" }));
        }
      } catch (error) {
        setToast({ type: "error", message: error.message || "Failed to load account info" });
      } finally {
        setLoading(false);
      }
    };

    loadAdmin();
  }, []);

  const validate = () => {
    const newErrors = {};
    const username = form.username.trim();
    const password = form.password.trim();

    if (!username) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      setToast(null);
      const payload = {
        username: form.username.trim(),
        password: form.password.trim(),
      };
      const response = await updateAdminAccount(payload);

      if (response.success) {
        startAdminSession(response.token, response.user);
        setForm((prev) => ({ ...prev, password: "" }));
        setToast({ type: "success", message: "Account updated successfully" });
        setErrors({});
      }
    } catch (error) {
      setToast({ type: "error", message: error.message || "Failed to update account" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-gray-600 text-sm">Loading account settings...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Update your administrator credentials.</p>
      </div>

      {toast && (
        <div
          className={`mb-6 rounded-lg px-4 py-3 text-sm font-medium ${
            toast.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            New Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.username ? "border-red-300" : "border-gray-200"
            }`}
            placeholder="Enter a new username"
            autoComplete="off"
          />
          {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.password ? "border-red-300" : "border-gray-200"
            }`}
            placeholder="Enter a new password"
          />
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          <p className="mt-2 text-xs text-gray-500">Password must be at least 6 characters long.</p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm shadow-sm hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;

