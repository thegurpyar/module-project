// fileUploadService.ts
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

// Configuration for easy S3 migration later
const STORAGE_TYPE = process.env.STORAGE_TYPE || "local"; // "local" or "s3"
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(process.cwd(), "uploads");

// S3 Configuration (commented out for future use)
// import {
//   S3Client,
//   PutObjectCommand,
//   DeleteObjectCommand,
//   GetObjectCommand,
// } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// const s3Client = new S3Client({
//   region: process.env.AWS_REGION || "eu-north-1",
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// const BUCKET_NAME = process.env.AWS_S3_BUCKET || "influelo-bucket";

export const uploadSingle = async (
  file: any,
): Promise<string> => {
  try {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(UPLOADS_DIR, fileName);

    // Ensure uploads directory exists
    await fs.mkdir(UPLOADS_DIR, { recursive: true });

    // Handle file from disk storage (multer diskStorage)
    if (file.path) {
      // Move/rename the file from temporary location to final location
      await fs.rename(file.path, filePath);
    } else if (file.buffer) {
      // Handle file from memory storage (fallback)
      await fs.writeFile(filePath, file.buffer);
    } else {
      throw new Error("No file data available");
    }

    return fileName;
  } catch (error) {
    console.error("Error uploading file to local storage:", error);
    throw new Error("Failed to upload file");
  }
};

export const getFileUrl = async (key: string): Promise<string> => {
  try {
    // For local storage, return a URL that can be served by the application
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    return `${baseUrl}/uploads/${key}`;
  } catch (error) {
    console.error("Error generating file URL:", error);
    throw new Error("Failed to generate file URL");
  }
};

export const deleteFile = async (key: string): Promise<boolean> => {
  try {
    const filePath = path.join(UPLOADS_DIR, key);
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error("Error deleting file from local storage:", error);
    return false;
  }
};

export const deleteOldFile = async (
  oldFileKey: string | undefined,
): Promise<void> => {
  if (!oldFileKey) return;

  try {
    await deleteFile(oldFileKey);
  } catch (error) {
    console.error("Error deleting old file:", error);
    // Don't throw error as we don't want to fail the main operation
  }
};
