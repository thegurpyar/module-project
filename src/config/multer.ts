import multer from 'multer';
import { Request } from 'express';


const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: any,
  cb: multer.FileFilterCallback
) => {
  
  // Allowed image and video MIME types
  const allowedMimeTypes = [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
    'image/tiff',
    // Videos
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',  // .mov
    'video/x-msvideo',  // .avi
    'video/x-ms-wmv',   // .wmv
    'video/mpeg',       // .mpeg, .mpg
    'video/3gpp',       // .3gp
    'video/3gpp2',      // .3g2
    'video/x-flv',      // .flv
    'video/x-matroska', // .mkv
    'application/pdf'   // .pdf
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(
      'Invalid file type. Only common image and video formats are allowed. ' +
      'Allowed image formats: JPEG, PNG, GIF, WebP, SVG, BMP, TIFF. ' +
      'Allowed video formats: MP4, WebM, OGG, MOV, AVI, WMV, MPEG, 3GP, FLV, MKV' +
      'Allowed document formats: PDF'
    ));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter
});

const handleMulterError = (err: any, req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

export const singleUpload = (req: any, res: any, next: any) => {
  const uploadSingle = upload.single('file');
  uploadSingle(req, res, (err) => {
    if (err) {
      return handleMulterError(err, req, res, next);
    }
    next();
  });
};

export default upload;