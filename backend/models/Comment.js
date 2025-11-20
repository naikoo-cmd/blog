import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
    required: true
  },
  author: {
    type: String,
    default: "Anonymous",
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
    required: true
  }
}, {
  timestamps: true // This automatically adds createdAt and updatedAt
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;

