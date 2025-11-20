import express from "express";
import multer from "multer";
import { authenticate } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { createBlog, getAllBlogs, deleteBlog } from "../controllers/blogController.js";

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
// Requires: thumbnail (file upload)
router.post(
  "/blogs",
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
  createBlog
);

// Get all blogs route
// GET /api/admin/blogs
router.get("/blogs", getAllBlogs);

// Delete blog route
// DELETE /api/admin/blogs/:id
router.delete("/blogs/:id", deleteBlog);

export default router;
