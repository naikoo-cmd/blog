import React from "react";
import { useNavigate } from "react-router-dom";
import { formatDateShort } from "../data/blogPosts";

const BlogCard = ({ blogs = [] }) => {
  const navigate = useNavigate();

  const getTagColor = (tag) => {
    const tagLower = tag?.toLowerCase() || "";
    if (tagLower === "technology") return "bg-blue-100 text-blue-600";
    if (tagLower === "finance") return "bg-green-100 text-green-600";
    if (tagLower === "lifestyle") return "bg-pink-100 text-pink-600";
    return "bg-gray-100 text-gray-600";
  };

  if (blogs.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 my-8 text-center">
        <p className="text-gray-500">No blog posts found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 my-8">
      {blogs.map((post) => {
        const imageUrl = post.thumbnailUrl || (post.images && post.images[0]?.url) || "";
        const date = post.createdAt || new Date().toISOString();
        
        return (
          <div
            key={post._id}
            onClick={() => navigate(`/blog/${post._id}`)}
            className="cursor-pointer bg-white shadow rounded-xl overflow-hidden flex flex-col transition-transform hover:scale-[1.03] duration-200"
          >
            {imageUrl && (
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/500x300?text=No+Image";
                  }}
                />
              </div>
            )}
            <div className="flex flex-col flex-1 p-4">
              <div className="mb-2">
                {/* Tag */}
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTagColor(post.tag)}`}>
                  {post.tag}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">{post.title}</h2>
              {post.subtitle && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-1">{post.subtitle}</p>
              )}
              <p className="text-gray-500 mb-4 line-clamp-3">{post.description}</p>
              <div className="flex justify-between items-center mt-auto">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{formatDateShort(date)}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BlogCard;
