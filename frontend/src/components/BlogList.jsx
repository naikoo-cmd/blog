import React, { useState } from "react";

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
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-4 py-2 rounded-full border transition-colors ${
              selectedCategory === cat.key
                ? "bg-primary text-white border-primary"
                : "bg-white text-primary border-primary/30 hover:bg-primary/10"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div>{/* Blog cards will be filtered by selectedCategory */}</div>
    </div>
  );
};

export default BlogList;
