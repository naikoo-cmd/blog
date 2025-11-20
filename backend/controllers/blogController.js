import Blog from "../models/Blog.js";

/**
 * Create a new blog post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createBlog = async (req, res) => {
  try {
    // Extract data from request body
    const { title, subtitle, tag, description, content } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!tag || !tag.trim()) {
      return res.status(400).json({
        success: false,
        message: "Tag is required",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    // Check if thumbnail file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail image is required",
      });
    }

    // Extract Cloudinary data from uploaded file
    const thumbnailUrl = req.file.path; // Cloudinary secure_url
    const thumbnailId = req.file.filename; // Cloudinary public_id

    if (!thumbnailUrl || !thumbnailId) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload thumbnail image",
      });
    }

    // Create new blog post
    const blog = new Blog({
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : "",
      tag: tag.trim(),
      thumbnailUrl,
      thumbnailId,
      description: description.trim(),
      content: content.trim(),
    });

    // Save to MongoDB
    const savedBlog = await blog.save();

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Blog created",
      data: savedBlog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);

    // Handle MongoDB validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.message,
      });
    }

    // Handle MongoDB save errors
    if (error.name === "MongoError" || error.name === "MongoServerError") {
      return res.status(500).json({
        success: false,
        message: "Failed to save blog to database",
        error: error.message,
      });
    }

    // Generic error response
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * Get all blog posts
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllBlogs = async (req, res) => {
  try {
    // Fetch all blogs, sorted by createdAt (newest first)
    const blogs = await Blog.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Blogs retrieved successfully",
      data: blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * Delete a blog post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Blog ID is required",
      });
    }

    // Check if blog exists
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Import cloudinary
    const cloudinary = (await import("../config/cloudinary.js")).default;
    const publicId = blog.thumbnailId;

    // Delete the blog from DB first
    await Blog.findByIdAndDelete(id);

    // Delete image from Cloudinary
    cloudinary.uploader.destroy(publicId, async (error, result) => {
      if (error || result.result !== "ok") {
        return res.status(500).json({
          success: false,
          message: "Blog DB entry deleted, but failed to remove image from Cloudinary",
          cloudinaryError: error || result,
        });
      }
      return res.status(200).json({
        success: true,
        message: "Blog and image deleted successfully",
      });
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
