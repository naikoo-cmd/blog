import React, { useState, useEffect } from "react";
import { getAllBlogs, updateBlogStatus } from "../../utils/api.js";

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllBlogs();
      if (response.success && response.data) {
        setBlogs(response.data);
      } else {
        setError("Failed to fetch blogs");
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError(err.message || "Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToggle = async (blogId, currentStatus) => {
    try {
      setUpdatingId(blogId);
      const newStatus = currentStatus === "published" ? "draft" : "published";
      
      // Call the API to update the status
      const response = await updateBlogStatus(blogId, newStatus);
      
      if (response.success) {
        // Update the local state with the new status
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog._id === blogId ? { ...blog, status: newStatus } : blog
          )
        );
      }
    } catch (err) {
      console.error("Error toggling publish status:", err);
      setError(err.message || "Failed to update blog status");
    } finally {
      setUpdatingId(null);
    }
  };

  const publishedCount = blogs.filter((blog) => (blog.status || "published") === "published").length;
  const draftCount = blogs.filter((blog) => (blog.status || "published") === "draft").length;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const latestBlogs = blogs.slice(0, 10); // Show only latest 10 blogs

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your blog overview.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {/* Published Posts Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Published Posts</p>
              <p className="text-4xl font-bold text-gray-900">{publishedCount}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">Active published blog posts</p>
        </div>

        {/* Draft Posts Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
          {draftCount > 0 && (
            <span className="absolute top-4 right-4 bg-yellow-500 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center">
              {draftCount > 99 ? "99+" : draftCount}
            </span>
          )}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Draft Posts</p>
              <p className="text-4xl font-bold text-gray-900">{draftCount}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">Unpublished draft posts</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Latest Blogs Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Latest Blog Posts</h2>
          <p className="text-sm text-gray-600 mt-1">Your most recent posts and their status</p>
        </div>

        {latestBlogs.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-500 text-lg font-medium mb-2">No blog posts yet</p>
            <p className="text-gray-400 text-sm">Create your first blog post to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-12">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">
                    Thumbnail
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {latestBlogs.map((blog, index) => {
                  const status = blog.status || "published";
                  const isPublished = status === "published";

                  return (
                    <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                      {/* Index */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                      </td>

                      {/* Thumbnail */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-12 w-12 shrink-0">
                          <img
                            src={blog.thumbnailUrl}
                            alt={blog.title}
                            className="h-12 w-12 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/48?text=No+Image";
                            }}
                          />
                        </div>
                      </td>

                      {/* Title */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900 max-w-xs truncate">{blog.title}</p>
                        {blog.subtitle && (
                          <p className="text-xs text-gray-500 max-w-xs truncate mt-1">{blog.subtitle}</p>
                        )}
                      </td>

                      {/* Created Date */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{formatDate(blog.createdAt)}</span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {isPublished ? "Published" : "Draft"}
                        </span>
                      </td>

                      {/* Action Button */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handlePublishToggle(blog._id, status)}
                          disabled={updatingId === blog._id}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                            isPublished
                              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                              : "bg-green-500 hover:bg-green-600 text-white"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                          title={isPublished ? "Unpublish post" : "Publish post"}
                        >
                          {updatingId === blog._id ? "Updating..." : isPublished ? "Unpublish" : "Publish"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Show All Link */}
        {blogs.length > 10 && (
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <a href="/admin/listBlog" className="text-sm font-medium text-primary hover:text-primary/80 transition">
              View all {blogs.length} posts →
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
