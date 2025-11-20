import express from "express";
import { getPublishedBlogs, getPublishedBlogById } from "../controllers/blogController.js";

const router = express.Router();

// Get all published blogs (public route)
// GET /api/blogs
router.get("/", getPublishedBlogs);

// Get a single published blog by ID (public route)
// GET /api/blogs/:id
router.get("/:id", getPublishedBlogById);

export default router;

