import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      min: 3,
      max: 30,
      required: true,
    },
    lastname: {
      type: String,
      min: 3,
      max: 30,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    number: {
      type: String,
      required: true,
      unique: true,
      min: 11,
      max: 11,
    },
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
    address: {
      type: String,
      required: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
    profileImage: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2012/04/18/23/36/boy-38262_1280.png",
    },
    refferralCode: {
      type: String,
      default: "",
    }
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const User = mongoose.model('User', userSchema);

export default User;

