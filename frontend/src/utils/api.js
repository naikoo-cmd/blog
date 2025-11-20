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
  formData.append("status", blogData.status || "published");
  
  // Append thumbnail file if provided
  if (blogData.thumbnail) {
    formData.append("thumbnail", blogData.thumbnail);
  }
  
  // Append additional images if provided
  if (blogData.images && Array.isArray(blogData.images)) {
    blogData.images.forEach((image) => {
      formData.append("images", image);
    });
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

/**
 * Get all blog posts
 */
export const getAllBlogs = async () => {
  return apiRequest("/admin/blogs", {
    method: "GET",
  });
};

/**
 * Get a single blog post by ID
 * @param {string} blogId - The ID of the blog to fetch
 */
export const getBlogById = async (blogId) => {
  return apiRequest(`/admin/blogs/${blogId}`, {
    method: "GET",
  });
};

/**
 * Delete a blog post
 * @param {string} blogId - The ID of the blog to delete
 */
export const deleteBlog = async (blogId) => {
  return apiRequest(`/admin/blogs/${blogId}`, {
    method: "DELETE",
  });
};

/**
 * Update a blog post
 * @param {string} blogId - The ID of the blog to update
 * @param {Object} blogData - Blog data including title, subtitle, tag, description, content, status, and optional thumbnail file
 */
export const updateBlog = async (blogId, blogData) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const url = `${API_BASE_URL}/admin/blogs/${blogId}`;
  
  // Create FormData for multipart/form-data
  const formData = new FormData();
  if (blogData.title !== undefined) formData.append("title", blogData.title);
  if (blogData.subtitle !== undefined) formData.append("subtitle", blogData.subtitle || "");
  if (blogData.tag !== undefined) formData.append("tag", blogData.tag);
  if (blogData.description !== undefined) formData.append("description", blogData.description);
  if (blogData.content !== undefined) formData.append("content", blogData.content);
  if (blogData.status !== undefined) formData.append("status", blogData.status);
  
  // Append thumbnail file if provided
  if (blogData.thumbnail) {
    formData.append("thumbnail", blogData.thumbnail);
  }
  
  // Get auth token
  const token = getAuthToken();
  
  const config = {
    method: "PUT",
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
      throw new Error(data.message || "Failed to update blog post");
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update blog post status
 * @param {string} blogId - The ID of the blog to update
 * @param {string} status - The new status ('published' or 'draft')
 */
export const updateBlogStatus = async (blogId, status) => {
  return apiRequest(`/admin/blogs/${blogId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

/**
 * Update admin account credentials
 * @param {Object} payload - Contains username and password
 */
export const updateAdminAccount = async ({ username, password }) => {
  return apiRequest("/admin/account", {
    method: "PUT",
    body: JSON.stringify({ username, password }),
  });
};

/**
 * Get all published blog posts (public route)
 */
export const getPublishedBlogs = async () => {
  return apiRequest("/blogs", {
    method: "GET",
  });
};

/**
 * Get a single published blog post by ID (public route)
 * @param {string} blogId - The ID of the blog to fetch
 */
export const getPublishedBlogById = async (blogId) => {
  return apiRequest(`/blogs/${blogId}`, {
    method: "GET",
  });
};

/**
 * Get all tags
 */
export const getAllTags = async () => {
  return apiRequest("/admin/tags", {
    method: "GET",
  });
};

/**
 * Create a new tag
 * @param {string} name - The tag name
 * @param {string} displayName - The display name for the tag
 */
export const createTag = async (name, displayName) => {
  return apiRequest("/admin/tags", {
    method: "POST",
    body: JSON.stringify({ name, displayName }),
  });
};

/**
 * Delete a tag
 * @param {string} tagId - The ID of the tag to delete
 */
export const deleteTag = async (tagId) => {
  return apiRequest(`/admin/tags/${tagId}`, {
    method: "DELETE",
  });
};

/**
 * Create a comment
 * @param {string} blogId - The ID of the blog post
 * @param {string} author - The author name (optional, defaults to "Anonymous")
 * @param {string} content - The comment content
 */
export const createComment = async (blogId, author, content) => {
  return apiRequest("/comments", {
    method: "POST",
    body: JSON.stringify({ blogId, author, content }),
  });
};

/**
 * Get approved comments for a blog post
 * @param {string} blogId - The ID of the blog post
 */
export const getApprovedComments = async (blogId) => {
  return apiRequest(`/comments/blog/${blogId}`, {
    method: "GET",
  });
};

/**
 * Get all comments (admin)
 */
export const getAllComments = async () => {
  return apiRequest("/admin/comments", {
    method: "GET",
  });
};

/**
 * Update comment status
 * @param {string} commentId - The ID of the comment
 * @param {string} status - The new status ('pending', 'approved', 'rejected')
 */
export const updateCommentStatus = async (commentId, status) => {
  return apiRequest(`/admin/comments/${commentId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

/**
 * Delete a comment
 * @param {string} commentId - The ID of the comment to delete
 */
export const deleteComment = async (commentId) => {
  return apiRequest(`/admin/comments/${commentId}`, {
    method: "DELETE",
  });
};

