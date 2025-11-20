import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDate } from "../data/blogPosts";
import { getPublishedBlogById, getApprovedComments, createComment } from "../utils/api.js";
import Footer from "../components/Footer";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchBlog();
    fetchComments();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await getPublishedBlogById(id);
      if (response.success && response.data) {
        setPost(response.data);
      } else {
        setError("Blog post not found");
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
      setError(err.message || "Failed to load blog post");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await getApprovedComments(id);
      if (response.success && response.data) {
        setComments(response.data);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) {
      showToast("Please enter a comment", "error");
      return;
    }

    try {
      setIsSubmittingComment(true);
      const response = await createComment(id, commentAuthor, commentContent);
      if (response.success) {
        setCommentAuthor("");
        setCommentContent("");
        showToast("Comment submitted successfully! It will be reviewed before being published.", "success");
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
      showToast(err.message || "Failed to submit comment", "error");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const getTagColor = (tag) => {
    const tagLower = tag?.toLowerCase() || "";
    if (tagLower === "technology") return "bg-blue-100 text-blue-600";
    if (tagLower === "finance") return "bg-green-100 text-green-600";
    if (tagLower === "lifestyle") return "bg-pink-100 text-pink-600";
    return "bg-gray-100 text-gray-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Blog Post Not Found</h1>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const mainImage = post.thumbnailUrl || (post.images && post.images[0]?.url) || "";
  const additionalImages = post.images && post.images.length > 0 
    ? (post.thumbnailUrl ? post.images : post.images.slice(1))
    : [];

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg shadow-xl font-semibold text-sm transition-all duration-300 ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : toast.type === "error"
              ? "bg-red-500 text-white"
              : "bg-primary text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <article className="min-h-screen bg-white relative">
        {/* Main Image Section - Reduced Size */}
        <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
          {mainImage && (
            <>
              {/* Back Button - Above Image Container */}
              <div className="mb-4">
                <button
                  onClick={() => navigate(-1)}
                  className="bg-white/95 hover:bg-white text-gray-800 rounded-full p-3 transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm"
                  aria-label="Go back"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>

              <div className="relative w-full h-[30vh] sm:h-[35vh] lg:h-[40vh] rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src={mainImage} 
                  alt={post.title} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/1200x600?text=No+Image";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* Additional Images Thumbnails */}
              {additionalImages.length > 0 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                  {additionalImages.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImage(image.url)}
                      className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-xl transition-all hover:scale-105"
                    >
                      <img
                        src={image.url}
                        alt={`${post.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/200?text=No+Image";
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Additional Images Thumbnails (when no main image) */}
          {!mainImage && (
            <>
              {/* Back Button - When no main image */}
              <div className="mb-4">
                <button
                  onClick={() => navigate(-1)}
                  className="bg-white/95 hover:bg-white text-gray-800 rounded-full p-3 transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm"
                  aria-label="Go back"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
              {post.images && post.images.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {post.images.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImage(image.url)}
                      className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-xl transition-all hover:scale-105"
                    >
                      <img
                        src={image.url}
                        alt={`${post.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/200?text=No+Image";
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Content Section */}
        <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${mainImage ? "mt-0" : "mt-20"} relative z-10`}>
          {/* Card Container */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12">
            {/* Tag */}
            <div className="mb-4">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getTagColor(post.tag)}`}>
                {post.tag}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 leading-tight">
              {post.title}
            </h1>

            {/* Subtitle */}
            {post.subtitle && (
              <p className="text-xl text-gray-600 mb-4">{post.subtitle}</p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-gray-600 text-sm sm:text-base">{formatDate(post.createdAt)}</span>
              </div>
            </div>

            {/* Article Content */}
            <div
              className="prose prose-lg sm:prose-xl max-w-none
                prose-headings:font-bold prose-headings:text-gray-900
                prose-p:text-gray-700 prose-p:leading-relaxed
                prose-p:mb-6
                prose-h2:mt-8 prose-h2:mb-4
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900
                prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

          </div>

          {/* Share Section */}
          <div className="mt-8 mb-12 text-center">
            <p className="text-gray-600 mb-4 font-medium">Share this article</p>
            <div className="flex justify-center gap-4">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(
                  window.location.href
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                aria-label="Share on Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                aria-label="Share on Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
                aria-label="Share on LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments ({comments.length})</h2>

            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="mb-8 bg-gray-50 rounded-lg p-6">
              <div className="mb-4">
                <label htmlFor="commentAuthor" className="block text-sm font-medium text-gray-700 mb-2">
                  Name (Optional)
                </label>
                <input
                  type="text"
                  id="commentAuthor"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  placeholder="Your name (leave blank for anonymous)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="commentContent" className="block text-sm font-medium text-gray-700 mb-2">
                  Comment <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="commentContent"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Write your comment here..."
                  rows={4}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingComment || !commentContent.trim()}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingComment ? "Submitting..." : "Submit Comment"}
              </button>
              <p className="mt-2 text-xs text-gray-500">
                Your comment will be reviewed before being published.
              </p>
            </form>

            {/* Comments List */}
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
            ) : (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment._id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{comment.author || "Anonymous"}</p>
                        <p className="text-sm text-gray-500">{formatDate(comment.createdAt)}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Image Popup Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] mx-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Close"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default BlogDetail;
