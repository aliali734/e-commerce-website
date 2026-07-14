const { mongoose } = require("../db");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
      match: /^[a-zA-Z0-9_]+$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^\S+@\S+\.\S+$/,
    },
    password: {
      type: String,
      default: null, // null for OAuth-only users
    },
    googleId: {
      type: String,
      default: null,
      unique: true,
      sparse: true, // allows multiple docs with null googleId
    },
    facebookId: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
