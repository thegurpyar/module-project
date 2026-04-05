// // src/modules/fileupload/fileupload.controller.ts
// import { Request, Response } from "express";
// import { uploadSingle, getFileUrl } from "../../services/fileUploadService";
// import { successResponse, errorResponse } from "../../middlewares/errorHandler";

// interface MulterRequest extends Request {
//   file?: any;
// }

// export const uploadFile = async (req: MulterRequest, res: Response) => {
//   try {

//     if (!req.file) {
//       return errorResponse(
//         res,
//         'No file uploaded. Please make sure to attach a file with the "file" field name.',
//         400,
//       );
//     }

//     try {
//       // Upload the file to S3
//       const fileKey = await uploadSingle(req.file);

//       // Get the public URL for the uploaded file
//       const fileUrl = await getFileUrl(fileKey);

//       // Return success response with file information
//       return successResponse(res, {
//         message: "File uploaded successfully",
//         key: fileKey,
//         url: fileUrl,
//         filename: req.file.originalname,
//         size: req.file.size,
//         mimetype: req.file.mimetype,
//       });
//     } catch (uploadError) {
//       return errorResponse(
//         res,
//         {
//           message: "Failed to upload file to storage",
//           error:
//             process.env.NODE_ENV === "development"
//               ? uploadError.message
//               : undefined,
//         },
//         500,
//       );
//     }
//   } catch (error) {
//     return errorResponse(
//       res,
//       {
//         message: error.message || "Internal server error",
//         error: process.env.NODE_ENV === "development" ? error.stack : undefined,
//       },
//       500,
//     );
//   }
// };

// export const getFile = async (req: MulterRequest, res: Response) => {
//   const id = req.params.id;
//   const fileUrl = await getFileUrl(id);

//   // Return success response with file information
//   return successResponse(res, {
//     fileUrl,
//   });
// };
