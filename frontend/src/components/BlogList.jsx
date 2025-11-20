import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BlogCard from "./BlogCard";
import { getPublishedBlogs } from "../utils/api.js";

const BlogList = ({ searchQuery = "" }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [allBlogs, setAllBlogs] = useState([]);
  const [displayedCount, setDisplayedCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([
    { key: "all", label: "All" },
    { key: "technology", label: "Technology" },
    { key: "finance", label: "Finance" },
    { key: "lifestyle", label: "Lifestyle" },
  ]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Reset displayed count when category or search changes
  useEffect(() => {
    setDisplayedCount(10);
  }, [selectedCategory, searchQuery]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await getPublishedBlogs();
      if (response.success && response.data) {
        setAllBlogs(response.data);
        // Extract unique tags from blogs
        const uniqueTags = [...new Set(response.data.map(blog => blog.tag))];
        const existingKeys = categories.map(c => c.key.toLowerCase());
        uniqueTags.forEach(tag => {
          const tagLower = tag.toLowerCase();
          if (!existingKeys.includes(tagLower) && tagLower !== "all") {
            setCategories(prev => [...prev, { key: tagLower, label: tag }]);
          }
        });
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter blogs by category and search query
  const filteredBlogs = allBlogs.filter(blog => {
    // Category filter
    const categoryMatch = selectedCategory === "all" || blog.tag?.toLowerCase() === selectedCategory;
    
    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const searchMatch = !searchQuery || 
      blog.title?.toLowerCase().includes(searchLower) ||
      blog.subtitle?.toLowerCase().includes(searchLower) ||
      blog.tag?.toLowerCase().includes(searchLower) ||
      blog.description?.toLowerCase().includes(searchLower);
    
    return categoryMatch && searchMatch;
  });

  // Get displayed blogs (limited to displayedCount)
  const displayedBlogs = filteredBlogs.slice(0, displayedCount);
  const hasMore = filteredBlogs.length > displayedCount;

  const handleShowMore = () => {
    setDisplayedCount(prev => prev + 10);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center my-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-4 sm:gap-8 my-10">
        {categories.map((cat) => (
          <motion.button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-4 py-2 rounded-full border transition-colors ${
              selectedCategory === cat.key
                ? "bg-primary text-white border-primary"
                : "bg-white text-primary border-primary/30 hover:bg-primary/10"
            }`}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            animate={
              selectedCategory === cat.key
                ? { scale: 1.12, boxShadow: "0px 4px 20px rgba(55, 120, 250, 0.06)" }
                : { scale: 1, boxShadow: "0px 0px 0px rgba(0,0,0,0)" }
            }
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
          >
            {cat.label}
          </motion.button>
        ))}
      </div>
      <BlogCard blogs={displayedBlogs} />
      
      {/* Show More Button */}
      {hasMore && (
        <div className="flex justify-center my-8">
          <button
            onClick={handleShowMore}
            className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md"
          >
            Show Older Posts ({filteredBlogs.length - displayedCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogList;
