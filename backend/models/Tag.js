import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  isPredefined: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Tag = mongoose.model("Tag", tagSchema);

export default Tag;

