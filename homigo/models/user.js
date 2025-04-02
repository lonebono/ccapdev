//Import Relavent Modules
import mongoose, { Schema, models } from "mongoose";

//Define the User Schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, //Email should be unique
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, //Basic Email Validation
    },
    password: {
      type: String,
      required: true,
    },
    city: {
        type: String,
        required: false,
    },

    preferredNickname: {
        type: String,
        required: false,
    },
    profilePic: {
      type: String,
      required: false, 
    },
    bio: {
        type: String,
        required: false,
    },
    role: {
      type: String,
      default: "Guest",
      required:false,
    },

  },
  { timestamps: true }
);

//Checks if user already exists, if not, then creates a user schema, then exports the User model so we can use it
const User = models.User || mongoose.model("User", userSchema);
export default User;