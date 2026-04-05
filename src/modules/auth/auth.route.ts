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
router.post("/refresh", auth,refreshToken);
router.get("/me",auth, getMe);
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