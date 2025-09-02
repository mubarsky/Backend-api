import express from 'express';
import {
  getSingleUser,
  getAllUsers,
  forgotPassword,
  loginUser,
  registerUser,
  updateUser,
  deleteUser,
  verifyOtp,
  resetPassword
} from "../controllers/user.controller.js"; // 

const router = express.Router();
// register
router.post("/create-user", registerUser);

// login route
router.post("/login", loginUser)

// forgot password route
 router.post("/forgotPassword", forgotPassword);


// all user endpoint
router.get("/users", getAllUsers);

// single user endpoint
router.get("/:id", getSingleUser); 

// update user endpoint
router.put("/:id", updateUser);

// delete user endpoint
router.delete("/:id", deleteUser)

// verify otp endpoint
router.post("/verifyotp", verifyOtp);

// reset password endpoint
router.post("/reset-password", resetPassword);

export default router;