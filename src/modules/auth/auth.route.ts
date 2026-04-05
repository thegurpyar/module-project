import express from "express";
import {
    login,
    forgotPassword,
    resetPassword,
    logout,
    getMe,
    deleteUser,
    changePassword,
    refreshToken,
    registerUser,
    verifyOtp
} from "./auth.controller";
import { auth } from "../../middlewares/auth.middleware";

const router = express.Router();

router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.get("/me",auth, getMe);
router.delete("/delete",auth, deleteUser);
router.post("/change-password",auth, changePassword);


router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
export default router;