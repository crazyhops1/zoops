import mongoose from "mongoose";





const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,

  },
  password: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    default: ""
  },
  profilePic: {
    type: String,
    default: ""    
  },
  website: {
    type: String,
    default: ""
  },
  gender: {
    type: String,
    enum: ["male", "female", "other",""],
    default: "male"
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const userModel =mongoose.model("User", userSchema);
export default userModel
