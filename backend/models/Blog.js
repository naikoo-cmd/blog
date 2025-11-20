import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true,
    default: ""
  },
  tag: {
    type: String,
    required: true,
    trim: true
  },
  thumbnailUrl: {
    type: String,
    required: false,
    default: ""
  },
  thumbnailId: {
    type: String,
    required: false,
    default: ""
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    }
  }],
  description: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["published", "draft"],
    default: "draft",
    required: true
  }
}, {
  timestamps: true // This automatically adds createdAt and updatedAt
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;

