import Comment from "../models/Comment.js";

/**
 * Create a new comment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createComment = async (req, res) => {
  try {
    const { blogId, author, content } = req.body;

    if (!blogId) {
      return res.status(400).json({
        success: false,
        message: "Blog ID is required",
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    const comment = new Comment({
      blogId,
      author: author && author.trim() ? author.trim() : "Anonymous",
      content: content.trim(),
      status: "pending",
    });

    const savedComment = await comment.save();

    return res.status(201).json({
      success: true,
      message: "Comment submitted successfully. It will be reviewed before being published.",
      data: savedComment,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * Get approved comments for a blog post (public route)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getApprovedComments = async (req, res) => {
  try {
    const { blogId } = req.params;

    if (!blogId) {
      return res.status(400).json({
        success: false,
        message: "Blog ID is required",
      });
    }

    const comments = await Comment.find({
      blogId,
      status: "approved",
    })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Comments retrieved successfully",
      data: comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * Get all comments for admin (all statuses)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("blogId", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Comments retrieved successfully",
      data: comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * Update comment status (approve/reject)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateCommentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Comment ID is required",
      });
    }

    if (!status || !["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'pending', 'approved', or 'rejected'",
      });
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    comment.status = status;
    const updatedComment = await comment.save();

    return res.status(200).json({
      success: true,
      message: `Comment ${status === "approved" ? "approved" : status === "rejected" ? "rejected" : "updated"} successfully`,
      data: updatedComment,
    });
  } catch (error) {
    console.error("Error updating comment status:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * Delete a comment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Comment ID is required",
      });
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    await Comment.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

