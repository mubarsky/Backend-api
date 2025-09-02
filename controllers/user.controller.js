import User from "../model/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {sendMail} from "../utils/mailer.js";
import crypto from "crypto";

//Register Endppoint

export const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, role, number } = req.body;

    // find if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).send({
        message: "User already exists with this email",
      });
    }

    //salting /salt round
    const salt = await bcrypt.genSalt(12);

    //hashing password
    const hashedPassword = await bcrypt.hash(password, salt);

    //create a new user
    const newUser = await User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role,
      number,
    });

    const createdUser = await newUser.save();
    return res.status(201).json({
      message: `${createdUser} user created successfully`,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

//login endppoint
export const loginUser = async (req, res) => {
  try {
    const { email } = req.body;
    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    // check if password matches
    const checkIfPasswordMatches = await bcrypt.compare(
      req.body.password,
      user.password
    );
    // if password does not match
    if (!checkIfPasswordMatches) {
      return res.status(401).json({
        message: "Invalid User credentials",
      });
    }
    // generate JWT token
    const token = await jwt.sign(
      {
        id: user._id,
        
       },
      process.env.JWT_SECRET
    );
    // omit password from response
    const { password, ...otheruserData } = user._doc;
    return res.status(200).json({
      message: "User logged in successfully",
      otheruserData,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

//forgot password

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      })
    }
    // generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    
    // set OTP expiration time (e.g., 10 minutes from now)
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // save user with OTP
    await user.save();

    // send OTP via email
    await sendMail({
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
  
    });
    
    // response to client
    return res.status(200).json({
      message: "OTP sent to email",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// verify otp 
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP or email",
      });
    }
    // check otp expiration
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({
        message: "OTP has expired",
      })
    }

    user.otp = null;
    user.otpExpires = null;
    await user.save();
    return res.status(200).json({
      message: "OTP verified successfully",
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    }); 
  }
}

// reset password
export const resetPassword = async (req, res) => {
 
  try {
     const { email, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and new password are required",
      })
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    // hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // update user's password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Password reset successfully",
   })
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}


// get all users
export const getAllUsers = async (req, res) => { 
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).json({
        message: "No users found",
      });
    }
    return res.status(200).json({
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}


// get single user

export const getSingleUser = async (req, res) => { 
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    console.log(user);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: `${user.firstname} retrieved successfully`,
      user,
    
    })
  } catch (error) {
    return res.status(500).json({
      message:" Internal server error",
      error: error.message,
    })
  }
}

// update user
// update user endpoint
// update user
export const updateUser = async (req, res) => {
  // get user id to update
  const { id } = req.params;
  const { firstname, lastname, email, password, role, address } = req.body;

  try {
    // find user by id
    const user = await User.findById(id);
    if (!user) { 
      return res.status(404).json({
        message: "User not found",
      });
    }
    // hash password before saving
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // update user details
    const userToUpdate = await User.findByIdAndUpdate(
      id,
      {
        firstname: firstname || user.firstname,
        lastname: lastname || user.lastname,
        email: email || user.email,
        password: hashedPassword || user.password,
        role: role || user.role,
        address: address || user.address,
      },
      { new: true }
    );
    return res.status(200).json({
      message: `${userToUpdate.firstname} updated successfully`,
      userToUpdate,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
// delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      message: `${user.firstname} deleted successfully`,
      user,
    })

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}