import express from "express";
import { createComment, getApprovedComments } from "../controllers/commentController.js";

const router = express.Router();

// Create a comment (public route)
// POST /api/comments
router.post("/", createComment);

// Get approved comments for a blog post (public route)
// GET /api/comments/blog/:blogId
router.get("/blog/:blogId", getApprovedComments);

export default router;

