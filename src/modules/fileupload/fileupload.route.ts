import { Router } from "express";
import multer from "multer";
import { uploadFile, getFile } from "./fileupload.controller";
import { auth } from "../../middlewares/auth.middleware";
import { singleUpload } from "../../config/multer";
const router = Router();
const upload = multer();

// Single file upload
router.post("/upload", singleUpload, uploadFile);
router.get("/:id", getFile);
export default router;
