import mongoose, { Schema, Document } from "mongoose";
import { User } from "types";

const userSchema = new Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<User>("User", userSchema);
