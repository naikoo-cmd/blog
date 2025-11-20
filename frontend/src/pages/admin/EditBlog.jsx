import React from "react";
import { useParams } from "react-router-dom";

const EditBlog = () => {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Blog Post</h1>
        <p className="text-gray-600">Blog ID: {id}</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
        <p className="text-gray-600">Edit blog functionality coming soon...</p>
      </div>
    </div>
  );
};

export default EditBlog;

