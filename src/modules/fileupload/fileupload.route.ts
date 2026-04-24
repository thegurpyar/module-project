import { Router } from "express";
import multer from "multer";
import { uploadFile, getFile } from "./fileupload.controller";
import { auth } from "../../middlewares/auth.middleware";
import { singleUpload } from "../../config/multer";
const router = Router();
const upload = multer();

/**
 * @swagger
 * components:
 *   schemas:
 *     FileUploadResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "File uploaded successfully"
 *         key:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000.jpg"
 *         url:
 *           type: string
 *           example: "http://localhost:5000/uploads/123e4567-e89b-12d3-a456-426614174000.jpg"
 *         filename:
 *           type: string
 *           example: "document.jpg"
 *         size:
 *           type: integer
 *           example: 1024000
 *         mimetype:
 *           type: string
 *           example: "image/jpeg"
 *     FileInfoResponse:
 *       type: object
 *       properties:
 *         fileUrl:
 *           type: string
 *           example: "http://localhost:5000/uploads/123e4567-e89b-12d3-a456-426614174000.jpg"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "No file uploaded"
 *         error:
 *           type: string
 *           example: "Error details in development mode"
 */

/**
 * @swagger
 * /api/fileupload:
 *   post:
 *     summary: Upload a single file
 *     description: Upload a single file to the server. Supports images, videos, and PDF files up to 50MB.
 *     tags: [File Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload (images, videos, PDF)
 *             required:
 *               - file
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileUploadResponse'
 *       400:
 *         description: Bad request - No file uploaded or invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", singleUpload,auth, uploadFile);

/**
 * @swagger
 * /api/fileupload/{id}:
 *   get:
 *     summary: Get file URL by ID
 *     description: Retrieve the public URL for an uploaded file using its unique ID
 *     tags: [File Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique file identifier (filename with extension)
 *         example: "123e4567-e89b-12d3-a456-426614174000.jpg"
 *     responses:
 *       200:
 *         description: File URL retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileInfoResponse'
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", getFile);

export default router;
