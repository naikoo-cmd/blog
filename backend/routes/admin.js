import express from "express";
import multer from "multer";
import { authenticate } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { createBlog, getAllBlogs, getBlogById, deleteBlog, updateBlog, updateBlogStatus } from "../controllers/blogController.js";
import { updateAdminAccount } from "../controllers/adminController.js";
import { getAllTags, createTag, deleteTag } from "../controllers/tagController.js";
import { getAllComments, updateCommentStatus, deleteComment } from "../controllers/commentController.js";

const router = express.Router();

// All admin routes are protected by the authenticate middleware
router.use(authenticate);

// Example protected admin route
router.get("/dashboard", (req, res) => {
  res.json({
    success: true,
    message: "Admin dashboard data",
    user: {
      id: req.user._id,
      username: req.user.username,
    },
  });
});

// Blog creation route
// POST /api/admin/blogs
// Requires: title, subtitle, tag, description (form fields)
// Optional: thumbnail (single file), images (multiple files)
router.post(
  "/blogs",
  (req, res, next) => {
    upload.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "images", maxCount: 10 }
    ])(req, res, (err) => {
      // Handle multer errors
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
              success: false,
              message: "File size too large. Maximum size is 5MB",
            });
          }
          return res.status(400).json({
            success: false,
            message: "File upload error: " + err.message,
          });
        }
        // Handle file validation errors
        if (req.fileValidationError) {
          return res.status(400).json({
            success: false,
            message: req.fileValidationError,
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      next();
    });
  },
  createBlog
);

// Get all blogs route
// GET /api/admin/blogs
router.get("/blogs", getAllBlogs);

// Get a single blog route
// GET /api/admin/blogs/:id
router.get("/blogs/:id", getBlogById);

// Delete blog route
// DELETE /api/admin/blogs/:id
router.delete("/blogs/:id", deleteBlog);

// Update blog route
// PUT /api/admin/blogs/:id
router.put(
  "/blogs/:id",
  (req, res, next) => {
    upload.single("thumbnail")(req, res, (err) => {
      // Handle multer errors
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
              success: false,
              message: "File size too large. Maximum size is 5MB",
            });
          }
          return res.status(400).json({
            success: false,
            message: "File upload error: " + err.message,
          });
        }
        // Handle file validation errors
        if (req.fileValidationError) {
          return res.status(400).json({
            success: false,
            message: req.fileValidationError,
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      next();
    });
  },
  updateBlog
);

// Update blog status route
// PATCH /api/admin/blogs/:id/status
router.patch("/blogs/:id/status", updateBlogStatus);

// Admin account settings
// PUT /api/admin/account
router.put("/account", updateAdminAccount);

// Tag routes
// GET /api/admin/tags
router.get("/tags", getAllTags);

// POST /api/admin/tags
router.post("/tags", createTag);

// DELETE /api/admin/tags/:id
router.delete("/tags/:id", deleteTag);

// Comment routes
// GET /api/admin/comments
router.get("/comments", getAllComments);

// PATCH /api/admin/comments/:id/status
router.patch("/comments/:id/status", updateCommentStatus);

// DELETE /api/admin/comments/:id
router.delete("/comments/:id", deleteComment);

export default router;
