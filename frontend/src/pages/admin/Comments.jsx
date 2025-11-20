import React, { useState, useEffect } from "react";
import { getAllComments, updateCommentStatus, deleteComment } from "../../utils/api.js";
import ConfirmModal from "../../components/admin/ConfirmModal.jsx";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, commentId: null });

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllComments();
      if (response.success && response.data) {
        setComments(response.data);
      } else {
        setError("Failed to fetch comments");
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError(err.message || "Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (commentId, newStatus) => {
    try {
      setUpdatingId(commentId);
      const response = await updateCommentStatus(commentId, newStatus);
      if (response.success) {
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === commentId ? { ...comment, status: newStatus } : comment
          )
        );
      }
    } catch (err) {
      console.error("Error updating comment status:", err);
      alert(err.message || "Failed to update comment status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteClick = (commentId) => {
    setConfirmModal({ isOpen: true, commentId });
  };

  const handleDeleteConfirm = async () => {
    const { commentId } = confirmModal;
    if (!commentId) return;

    try {
      setDeletingId(commentId);
      await deleteComment(commentId);
      setComments((prev) => prev.filter((comment) => comment._id !== commentId));
      setConfirmModal({ isOpen: false, commentId: null });
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert(err.message || "Failed to delete comment");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setConfirmModal({ isOpen: false, commentId: null });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredComments = filter === "all" 
    ? comments 
    : comments.filter((comment) => comment.status === filter);

  const pendingCount = comments.filter((c) => c.status === "pending").length;
  const approvedCount = comments.filter((c) => c.status === "approved").length;
  const rejectedCount = comments.filter((c) => c.status === "rejected").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">Loading comments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Comments</h1>
        <p className="text-gray-600">Manage and moderate blog comments</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-gray-600 text-sm font-medium mb-1">Total</p>
          <p className="text-3xl font-bold text-gray-900">{comments.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-gray-600 text-sm font-medium mb-1">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-gray-600 text-sm font-medium mb-1">Approved</p>
          <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-gray-600 text-sm font-medium mb-1">Rejected</p>
          <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === status
                ? "bg-primary text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Comments List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredComments.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 text-lg font-medium mb-2">No comments found</p>
            <p className="text-gray-400 text-sm">
              {filter === "all" ? "No comments have been submitted yet" : `No ${filter} comments`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredComments.map((comment) => (
              <div key={comment._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold text-gray-900">
                        {comment.author || "Anonymous"}
                      </p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          comment.status
                        )}`}
                      >
                        {comment.status.charAt(0).toUpperCase() + comment.status.slice(1)}
                      </span>
                    </div>
                    {comment.blogId && comment.blogId.title && (
                      <p className="text-sm text-gray-600 mb-2">
                        On: <span className="font-medium">{comment.blogId.title}</span>
                      </p>
                    )}
                    <p className="text-sm text-gray-500">{formatDate(comment.createdAt)}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 whitespace-pre-wrap">{comment.content}</p>
                <div className="flex gap-2 flex-wrap">
                  {comment.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(comment._id, "approved")}
                        disabled={updatingId === comment._id}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updatingId === comment._id ? "Updating..." : "Approve"}
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(comment._id, "rejected")}
                        disabled={updatingId === comment._id}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updatingId === comment._id ? "Updating..." : "Reject"}
                      </button>
                    </>
                  )}
                  {comment.status === "approved" && (
                    <button
                      onClick={() => handleStatusUpdate(comment._id, "rejected")}
                      disabled={updatingId === comment._id}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updatingId === comment._id ? "Updating..." : "Reject"}
                    </button>
                  )}
                  {comment.status === "rejected" && (
                    <button
                      onClick={() => handleStatusUpdate(comment._id, "approved")}
                      disabled={updatingId === comment._id}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updatingId === comment._id ? "Updating..." : "Approve"}
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteClick(comment._id)}
                    disabled={deletingId === comment._id}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === comment._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
