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
        message: "Title is required"
      });
    }

    if (!tag || !tag.trim()) {
      return res.status(400).json({
        success: false,
        message: "Tag is required"
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Description is required"
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Content is required"
      });
    }

    // Check if thumbnail file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail image is required"
      });
    }

    // Extract Cloudinary data from uploaded file
    const thumbnailUrl = req.file.path; // Cloudinary secure_url
    const thumbnailId = req.file.filename; // Cloudinary public_id

    if (!thumbnailUrl || !thumbnailId) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload thumbnail image"
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
      content: content.trim()
    });

    // Save to MongoDB
    const savedBlog = await blog.save();

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Blog created",
      data: savedBlog
    });

  } catch (error) {
    console.error("Error creating blog:", error);

    // Handle MongoDB validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.message
      });
    }

    // Handle MongoDB save errors
    if (error.name === "MongoError" || error.name === "MongoServerError") {
      return res.status(500).json({
        success: false,
        message: "Failed to save blog to database",
        error: error.message
      });
    }

    // Generic error response
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

