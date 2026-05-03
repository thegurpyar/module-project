import { Router } from 'express';
import authRoute from './modules/auth/auth.route';
// import fileuploadRoute from './modules/fileupload/fileupload.route';
import chatRoute from "./modules/chat/chat.route";
import fileuploadRoute from './modules/fileupload/fileupload.route';
import propertyUserRoute from './modules/property/property.user.route';
import adminRoute from './modules/admin/admin.route';
import propertyAdminRoute from './modules/property/property.admin.route';

const router = Router();

// All routes
router.use('/auth', authRoute);
router.use('/fileupload', fileuploadRoute);
router.use('/property/user', propertyUserRoute);
router.use('/admin', adminRoute);
router.use('/property/admin', propertyAdminRoute);
// router.use("/chat",chatRoute);
export default router;
