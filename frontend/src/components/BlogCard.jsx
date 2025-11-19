import React from "react";
import { useNavigate } from "react-router-dom";
import { blogPosts, formatDateShort } from "../data/blogPosts";

const BlogCard = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 my-8">
      {blogPosts.map((post) => (
        <div
          key={post.id}
          onClick={() => navigate(`/blog/${post.id}`)}
          className="cursor-pointer bg-white shadow rounded-xl overflow-hidden flex flex-col transition-transform hover:scale-[1.03] duration-200"
        >
          <div className="h-48 w-full overflow-hidden">
            <img
              src={post.image.replace("w=1200", "w=500")}
              alt={post.title}
              className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col flex-1 p-4">
            <div className="mb-2">
              {/* Tag */}
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium
                  ${
                    post.tag === "Technology"
                      ? "bg-blue-100 text-blue-600"
                      : post.tag === "Finance"
                      ? "bg-green-100 text-green-600"
                      : post.tag === "Lifestyle"
                      ? "bg-pink-100 text-pink-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
              >
                {post.tag}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">{post.title}</h2>
            <p className="text-gray-500 mb-4 line-clamp-3">{post.description}</p>
            <div className="flex justify-between items-center mt-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{formatDateShort(post.date)}</span>
                <span className="mx-2 text-xs text-gray-300">•</span>
                <span className="text-sm font-medium text-primary">{post.creator}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogCard;
