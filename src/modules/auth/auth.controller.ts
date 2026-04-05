import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import User from "../user/user.model";
import { errorResponse, successResponse } from "../../middlewares/errorHandler";
import { generateToken } from "../../utils/generateToken";
import { invalidateUserSockets } from "../chat/chat";
import { generateOTP } from "../../utils/generateOtp";


export const refreshToken = async (req, res) => {
  console.log("Refresh token request received");
 const { refreshToken: token } = req.body;

  if(!token){
    return errorResponse(res, "No token provided", 401);
  }

  let user;
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);
    if (typeof decoded !== 'string' && 'id' in decoded) {
    user = await User.findById(decoded.id);
} else {
    return errorResponse(res, "Invalid token", 401);
}
    if (!user) return errorResponse(res, "User not found", 404);
    const { accessToken, refreshToken } = generateToken(user);
    return successResponse(res, { accessToken, refreshToken }, "Refresh token successful", 200);
  } catch (error) {
    return errorResponse(res, "Invalid token", 401);
  }
}


export const login = async (req, res) => {
  // Request validation
  await body("email").isEmail().withMessage("Valid email is required").run(req);
  await body("password")
    .notEmpty()
    .withMessage("Password is required")
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: (err as any).param,
      message: err.msg,
    }));
    return errorResponse(res, "Validation failed", 422, formattedErrors);
  }

  try {
    const { email, password } = req.body;

    // Find user (admin or user)
    const user = await User.findOne({ email, isDeleted: false });
    if (!user) return errorResponse(res, "Invalid credentials", 401);

    // query password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return errorResponse(res, "Invalid credentials", 401);


    if (user.status !== 1) {
      return errorResponse(res, "Account inactive please contact support", 401);
    }

    const { accessToken, refreshToken } = generateToken(user);


    return successResponse(
      res,
      {
        user: {
          id: user._id,
          full_name: user.full_name,
          role: user.role,
        },
        tokens:{
          accessToken,
          refreshToken
        }
      },
      "Login successful",
      200
    );
  } catch (err) {
    console.error("login error", err);
    return errorResponse(res, "Login failed", 500);
  }
};

/**
 * Forgot Password
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res) => {
  try {
    // Validate email
    await body("email")
      .isEmail()
      .withMessage("Valid email is required")
      .run(req);

    // Collect errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((err) => ({
        field: (err as any).param,
        message: err.msg,
      }));
      return errorResponse(res, "Validation failed", 422, formattedErrors);
    }

    const { email } = req.body;

    // Find user/admin by email
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, "User with this email does not exist", 404);
    }

    // Generate reset token (valid for 15 minutes)
    const resetToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // // Send reset email
    // try {
    //   await sendMail({
    //     to: email,
    //     subject: "Password Reset Request",
    //     html: `<p>Hi ${user.full_name || "User"},</p>
    //            <p>You requested to reset your password. Click the link below to set a new one:</p>
    //            <a href="${resetUrl}">Reset Password</a>
    //            <p>This link will expire in 15 minutes.</p>`,
    //   });
    // } catch (mailErr) {
    //   console.error("Email sending error:", mailErr.message);
    //   return errorResponse(res, mailErr.message, 500);
    // }

    return successResponse(res, {}, "Password reset link sent successfully");
  } catch (err) {
    console.error("forgotPassword error:", err);
    return errorResponse(res, "Failed to send password reset link", 500);
  }
};

/**
 * Reset Password
 * POST /api/auth/reset-password
 */
export const resetPassword = async (req, res) => {
  try {
    // Validate inputs
    await Promise.all([
      body("token").notEmpty().withMessage("Reset token is required").run(req),
      body("newPassword")
        .matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/)
        .withMessage(
          "Password must be at least 8 characters, contain one uppercase letter and one number"
        )
        .run(req),
    ]);

    // Collect errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((err) => ({
        field: (err as any).param,
        message: err.msg,
      }));
      return errorResponse(res, "Validation failed", 422, formattedErrors);
    }

    const { token, newPassword } = req.body;

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return errorResponse(res, "Invalid or expired reset token", 400);
    }

    // Find user/admin by ID from token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    // Update password
    user.password = newPassword;
    user.passwordChangedAt = new Date();
    await user.save();

    invalidateUserSockets(user._id.toString());
    return successResponse(res, {}, "Password reset successfully");
  } catch (err) {
    console.error("resetPassword error:", err);
    return errorResponse(res, "Failed to reset password", 500);
  }
};

/**
 * Logout
 * POST /api/auth/logout
 */
export const logout = async (req, res) => {
  try {
    return successResponse(res, {}, "Logged out successfully");
  } catch (error) {
    return errorResponse(res, "Failed to Log out", 500);
  }
};


export const getMe = async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return errorResponse(res, "User not authenticated", 401);
  }

  const user = await User.findById(userId).select('-password');
  if (!user) {
    return errorResponse(res, "User not found", 404);
  }

  return successResponse(res, user, "User retrieved successfully");
}

export const deleteUser = async (req, res) => {
  const userId = req.userId;
  await User.findByIdAndUpdate(userId, { isDeleted: true });
  invalidateUserSockets(userId);
  return successResponse(res, {}, "User deleted successfully");
}

export const invalidateUserSessions = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }
    user.passwordChangedAt = new Date();
    await user.save();
    invalidateUserSockets(userId);
    return successResponse(res, {}, "User sessions invalidated successfully");
  } catch (err) {
    return errorResponse(res, err.message || "Server error", 500);
  }
}


export const changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return errorResponse(res, "Old password and new password are required", 400);
    }

    const user = await User.findById(userId).select("+password");

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return errorResponse(res, "Old password is incorrect", 401);
    }

    if (oldPassword === newPassword) {
      return errorResponse(res, "New password must be different from old password", 400);
    }


    user.password = newPassword;
    user.passwordChangedAt = new Date();
    await user.save(); // pre-save hook will hash it

    invalidateUserSockets(userId);

    return successResponse(res, {}, "Password changed successfully");

  } catch (error) {
    console.error("Change Password Error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};




export const registerUser = async (req, res) => {
  try {
    const { number,full_name } = req.body;

    // Validate input
    if (!number || !full_name) {
      return errorResponse(res, "Number and full name are required", 400);
    }

    const cleanNumber = number.trim();

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(cleanNumber)) {
      return errorResponse(res, "Invalid phone number format", 400);
    }

    // Check existing user
    let user = await User.findOne({ number: cleanNumber, isDeleted: false });

    // ================= EXISTING USER =================
    if (user && user.otpVerified) {
      if (user.status === 2) {
        return errorResponse(res, "User is inactive", 400);
      }

      const { accessToken, refreshToken } = generateToken(user);

      return successResponse(
        res,
        {
          user: {
            id: user._id,
            full_name: user.full_name,
            role: user.role,
          },
          tokens: {
            accessToken,
            refreshToken,
          },
        },
        "Login successful",
        200
      );
    }

    // ================= NEW USER =================
    const otp = "9999"; // ✅ correct

    if (user && !user.otpVerified){
      user.otp = otp;
      user.otpValidTill = new Date(Date.now() + 10 * 60 * 1000); // 10 min
      await user.save();

    return successResponse(
      res,
      {
        message: "OTP sent successfully",
        number: cleanNumber,
      },
      "User created, OTP sent",
      201
    );
    }
    user = await User.create({
      full_name:full_name,
      number: cleanNumber,
      role: "user",
      status: 1,
      isDeleted: false,
      otp,
      otpValidTill: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    });

    // 👉 DO NOT remove OTP here

    return successResponse(
      res,
      {
        message: "OTP sent successfully",
        number: cleanNumber,
      },
      "User created, OTP sent",
      201
    );

  } catch (error) {
    console.error("Register User Error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};



export const verifyOtp = async (req, res) => {
  try {
    const { number, otp } = req.body;

    if (!number || !otp) {
      return errorResponse(res, "Number and OTP are required", 400);
    }

    const user = await User.findOne({ number });

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    if(user.otpVerified){
      return errorResponse(res, "Otp already verified", 400);
    }
    if (user.otp !== otp) {
      return errorResponse(res, "Invalid OTP", 401);
    }

    if (user.otpValidTill < new Date()) {
      return errorResponse(res, "OTP has expired", 401);
    }

    user.otpVerified = true;
    await user.save();

    const { accessToken, refreshToken } = generateToken(user);

    return successResponse(
      res,
      {
        user: {
          id: user._id,
          full_name: user.full_name,
          role: user.role,
        },
        tokens: {
          accessToken,
          refreshToken
        }
      },
      "Login successful",
      200
    );
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};


export const resendOtp = async (req, res) => {
  try {
    const { number } = req.body;

    if (!number) {
      return errorResponse(res, "Number is required", 400);
    }

    const cleanNumber = number.trim();

    const user = await User.findOne({ number: cleanNumber, isDeleted: false });

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    if (user.otpVerified) {
      return errorResponse(res, "User already verified", 400);
    }

    // ⛔ Optional: prevent spam (30 sec cooldown)
    if (
      user.otpValidTill &&
      new Date(user.otpValidTill).getTime() - Date.now() > 9 * 60 * 1000
    ) {
      return errorResponse(res, "Please wait before requesting OTP again", 429);
    }

    // ✅ Generate new OTP
    const otp = "9999"

    user.otp = otp;
    user.otpValidTill = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await user.save();

    // 👉 TODO: Send OTP via SMS (Fast2SMS / Twilio)
    // console.log("OTP:", otp);

    return successResponse(
      res,
      {
        message: "OTP resent successfully",
        number: cleanNumber,
      },
      "OTP resent",
      200
    );
  } catch (error) {
    console.error("Resend OTP Error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};