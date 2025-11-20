import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production";
const JWT_EXPIRES_IN = "4h";

export const updateAdminAccount = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    if (!password || !password.trim()) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const trimmedUsername = username.trim().toLowerCase();
    if (trimmedUsername.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Username must be at least 3 characters long",
      });
    }

    const trimmedPassword = password.trim();
    if (trimmedPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const adminId = req.user?._id;
    const admin = await User.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const usernameExists = await User.findOne({
      username: trimmedUsername,
      _id: { $ne: adminId },
    });

    if (usernameExists) {
      return res.status(400).json({
        success: false,
        message: "Username is already in use",
      });
    }

    admin.username = trimmedUsername;
    admin.password = trimmedPassword;
    await admin.save();

    const token = jwt.sign(
      { userId: admin._id, username: admin.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.json({
      success: true,
      message: "Account updated successfully",
      token,
      user: {
        id: admin._id,
        username: admin.username,
      },
    });
  } catch (error) {
    console.error("Error updating admin account:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

