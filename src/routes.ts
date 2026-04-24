import { Router } from 'express';
import authRoute from './modules/auth/auth.route';
// import fileuploadRoute from './modules/fileupload/fileupload.route';
import chatRoute from "./modules/chat/chat.route";
import fileuploadRoute from './modules/fileupload/fileupload.route';
const router = Router();

// All routes
router.use('/auth', authRoute);
router.use('/fileupload', fileuploadRoute);
// router.use("/chat",chatRoute);
export default router;
