import multer from "multer";
import { storage } from "../config/cloudinary.js";

// Configure multer to use Cloudinary storage
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      req.fileValidationError = "Only image files are allowed";
      cb(null, false);
    }
  }
});

