// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Make an API request
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Add token to headers if available
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get auth token from localStorage
 */
export const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  
  try {
    const session = window.localStorage.getItem("adminSession");
    if (!session) return null;
    
    const parsed = JSON.parse(session);
    return parsed.token || null;
  } catch (error) {
    return null;
  }
};

/**
 * Login API call
 */
export const login = async (username, password) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
};

/**
 * Verify token API call
 */
export const verifyToken = async () => {
  return apiRequest("/auth/verify", {
    method: "GET",
  });
};

/**
 * Create a new blog post
 * @param {Object} blogData - Blog data including title, subtitle, tag, description, content, and thumbnail file
 */
export const createBlog = async (blogData) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const url = `${API_BASE_URL}/admin/blogs`;
  
  // Create FormData for multipart/form-data
  const formData = new FormData();
  formData.append("title", blogData.title);
  formData.append("subtitle", blogData.subtitle || "");
  formData.append("tag", blogData.tag);
  formData.append("description", blogData.description);
  formData.append("content", blogData.content);
  
  // Append thumbnail file if provided
  if (blogData.thumbnail) {
    formData.append("thumbnail", blogData.thumbnail);
  }
  
  // Get auth token
  const token = getAuthToken();
  
  const config = {
    method: "POST",
    headers: {
      // Don't set Content-Type, let browser set it with boundary for FormData
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  };
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to create blog post");
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

