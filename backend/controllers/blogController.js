import Blog from "../models/Blog.js";

/**
 * Create a new blog post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createBlog = async (req, res) => {
  try {
    // Extract data from request body
    const { title, subtitle, tag, description, content, status } = req.body;

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

    // Status is optional, defaults to "draft" if not provided
    const blogStatus = status && status.trim() ? status.trim() : "draft";

    // Handle thumbnail (optional, single file)
    let thumbnailUrl = "";
    let thumbnailId = "";
    if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      thumbnailUrl = req.files.thumbnail[0].path;
      thumbnailId = req.files.thumbnail[0].filename;
    } else if (req.file) {
      // Fallback for single file upload
      thumbnailUrl = req.file.path;
      thumbnailId = req.file.filename;
    }

    // Handle additional images (optional, multiple files)
    const images = [];
    if (req.files && req.files.images && Array.isArray(req.files.images)) {
      req.files.images.forEach((file) => {
        if (file.path && file.filename) {
          images.push({
            url: file.path,
            publicId: file.filename,
          });
        }
      });
    }

    // Create new blog post
    const blog = new Blog({
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : "",
      tag: tag.trim(),
      thumbnailUrl,
      thumbnailId,
      images,
      description: description.trim(),
      content: content.trim(),
      status: blogStatus,
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
 * Get all published blog posts (public route)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getPublishedBlogs = async (req, res) => {
  try {
    // Fetch only published blogs, sorted by createdAt (newest first)
    const blogs = await Blog.find({ status: "published" }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Published blogs retrieved successfully",
      data: blogs,
    });
  } catch (error) {
    console.error("Error fetching published blogs:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * Get a single published blog post by ID (public route)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getPublishedBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Blog ID is required",
      });
    }

    const blog = await Blog.findOne({ _id: id, status: "published" });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Published blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Published blog retrieved successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Error fetching published blog:", error);
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

/**
 * Get a single blog post by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Blog ID is required",
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog retrieved successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
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

/**
 * Update a blog post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, tag, description, content, status } = req.body;

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

    // Validate required fields if provided
    if (title !== undefined && (!title || !title.trim())) {
      return res.status(400).json({
        success: false,
        message: "Title cannot be empty",
      });
    }

    if (tag !== undefined && (!tag || !tag.trim())) {
      return res.status(400).json({
        success: false,
        message: "Tag cannot be empty",
      });
    }

    if (description !== undefined && (!description || !description.trim())) {
      return res.status(400).json({
        success: false,
        message: "Description cannot be empty",
      });
    }

    if (content !== undefined && (!content || !content.trim())) {
      return res.status(400).json({
        success: false,
        message: "Content cannot be empty",
      });
    }

    // Update fields if provided
    if (title !== undefined) blog.title = title.trim();
    if (subtitle !== undefined) blog.subtitle = subtitle ? subtitle.trim() : "";
    if (tag !== undefined) blog.tag = tag.trim();
    if (description !== undefined) blog.description = description.trim();
    if (content !== undefined) blog.content = content.trim();
    if (status !== undefined && ["published", "draft"].includes(status)) {
      blog.status = status;
    }

    // Handle thumbnail update if new file is uploaded
    if (req.file) {
      // Import cloudinary
      const cloudinary = (await import("../config/cloudinary.js")).default;
      
      // Delete old thumbnail from Cloudinary if it exists
      if (blog.thumbnailId) {
        cloudinary.uploader.destroy(blog.thumbnailId, (error) => {
          if (error) {
            console.error("Error deleting old thumbnail:", error);
          }
        });
      }

      // Extract Cloudinary data from new uploaded file
      const thumbnailUrl = req.file.path;
      const thumbnailId = req.file.filename;

      if (thumbnailUrl && thumbnailId) {
        blog.thumbnailUrl = thumbnailUrl;
        blog.thumbnailId = thumbnailId;
      }
    }

    // Save updated blog
    const updatedBlog = await blog.save();

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
    }
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
 * Update blog post status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateBlogStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Blog ID is required",
      });
    }

    if (!status || !["published", "draft"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status is required and must be either 'published' or 'draft'",
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

    // Update the blog status
    blog.status = status;
    const updatedBlog = await blog.save();

    return res.status(200).json({
      success: true,
      message: `Blog ${status === "published" ? "published" : "unpublished"} successfully`,
      data: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog status:", error);
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
