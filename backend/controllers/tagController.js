import Tag from "../models/Tag.js";

/**
 * Get all tags
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find().sort({ isPredefined: -1, displayName: 1 });

    return res.status(200).json({
      success: true,
      message: "Tags retrieved successfully",
      data: tags,
    });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * Create a new tag
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createTag = async (req, res) => {
  try {
    const { name, displayName } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Tag name is required",
      });
    }

    // Check if tag already exists
    const existingTag = await Tag.findOne({ name: name.trim().toLowerCase() });
    if (existingTag) {
      return res.status(400).json({
        success: false,
        message: "Tag already exists",
      });
    }

    const tag = new Tag({
      name: name.trim().toLowerCase(),
      displayName: displayName || name.trim(),
      isPredefined: false,
    });

    const savedTag = await tag.save();

    return res.status(201).json({
      success: true,
      message: "Tag created successfully",
      data: savedTag,
    });
  } catch (error) {
    console.error("Error creating tag:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Tag already exists",
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
 * Delete a tag
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Tag ID is required",
      });
    }

    const tag = await Tag.findById(id);

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    // Prevent deletion of predefined tags
    if (tag.isPredefined) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete predefined tags",
      });
    }

    await Tag.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Tag deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting tag:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid tag ID",
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
 * Initialize predefined tags
 */
export const initializePredefinedTags = async () => {
  try {
    const predefinedTags = [
      { name: "technology", displayName: "Technology" },
      { name: "finance", displayName: "Finance" },
      { name: "lifestyle", displayName: "Lifestyle" },
      { name: "others", displayName: "Others" },
    ];

    for (const tagData of predefinedTags) {
      const existingTag = await Tag.findOne({ name: tagData.name });
      if (!existingTag) {
        await Tag.create({
          ...tagData,
          isPredefined: true,
        });
      }
    }
  } catch (error) {
    console.error("Error initializing predefined tags:", error);
  }
};

