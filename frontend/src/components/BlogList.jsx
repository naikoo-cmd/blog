import React, { useState } from "react";
import { motion } from "framer-motion";
import BlogCard from "./BlogCard";
import SubscriptionsBlog from "./SubscriptionsBlog";

const categories = [
  { key: "all", label: "All" },
  { key: "technology", label: "Technology" },
  { key: "finance", label: "Finance" },
  { key: "lifestyle", label: "Lifestyle" },
];

const BlogList = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div>
      <div className="flex justify-center gap-4 sm:gap-8 my-10">
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
    </div>
  );
};

export default BlogList;
