// // fileUploadService.ts
// import {
//   S3Client,
//   PutObjectCommand,
//   DeleteObjectCommand,
//   GetObjectCommand,
// } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { v4 as uuidv4 } from "uuid";
// import path from "path";
// import dotenv from "dotenv";

// dotenv.config();

// const s3Client = new S3Client({
//   region: process.env.AWS_REGION || "eu-north-1",
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// const BUCKET_NAME = process.env.AWS_S3_BUCKET || "influelo-bucket";

// export const uploadSingle = async (
//   file: any,
// ): Promise<string> => {
//   try {
//     const fileExtension = path.extname(file.originalname);
//     const key = `${uuidv4()}${fileExtension}`;

//     const uploadParams = {
//       Bucket: BUCKET_NAME,
//       Key: key,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//     };

//     try {
//       await s3Client.send(new PutObjectCommand(uploadParams));
//     } catch (error) {
//       console.error("Error uploading file to S3:", error);
//       throw new Error("Failed to upload file");
//     }
//     return key;
//   } catch (error) {
//     console.error("Error uploading file to S3:", error);
//     throw new Error("Failed to upload file");
//   }
// };

// export const getFileUrl = async (key: string): Promise<string> => {
//   try {
//     const command = new GetObjectCommand({
//       Bucket: BUCKET_NAME,
//       Key: key,
//     });

//     // Generate a pre-signed URL that's valid for 1 hour
//     return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
//   } catch (error) {
//     console.error("Error generating file URL:", error);
//     throw new Error("Failed to generate file URL");
//   }
// };

// export const deleteFile = async (key: string): Promise<boolean> => {
//   try {
//     const deleteParams = {
//       Bucket: BUCKET_NAME,
//       Key: key,
//     };

//     await s3Client.send(new DeleteObjectCommand(deleteParams));
//     return true;
//   } catch (error) {
//     console.error("Error deleting file from S3:", error);
//     return false;
//   }
// };

// export const deleteOldFile = async (
//   oldFileKey: string | undefined,
// ): Promise<void> => {
//   if (!oldFileKey) return;

//   try {
//     await deleteFile(oldFileKey);
//   } catch (error) {
//     console.error("Error deleting old file:", error);
//     // Don't throw error as we don't want to fail the main operation
//   }
// };
