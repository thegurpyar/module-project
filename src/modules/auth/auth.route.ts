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

router.get("/me",auth, getMe);

router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);
router.post("/refresh", refreshToken);

router.delete("/delete",auth, deleteUser);
router.post("/change-password",auth, changePassword);


router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user (number-based or admin email login)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@mail.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login successful
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register user with name and number
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [full_name, number]
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: Gurpyar
 *               number:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: User registered successfully
 */

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP for user login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [number, otp]
 *             properties:
 *               number:
 *                 type: string
 *                 example: "9876543210"
 *               otp:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 */

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Send reset password email
 *     tags: [Auth]
 */

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 */

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64a1b2c3d4e5f6789012345"
 *                     full_name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john@example.com"
 *                     number:
 *                       type: string
 *                       example: "9876543210"
 *                     role:
 *                       type: string
 *                       example: "user"
 *                     status:
 *                       type: number
 *                       example: 1
 *                     otpVerified:
 *                       type: boolean
 *                       example: true
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User not authenticated"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User not found"
 */

/**
 * @swagger
 * /api/auth/delete:
 *   delete:
 *     summary: Delete current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
export default router;