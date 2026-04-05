import express from 'express';
import { getNotifications, markAsRead, registerDevice, updateNotificationPreference ,updateAdminNotificationPreference, getNotificationPreference } from './notifications.controller';
import { auth ,role} from '../../middlewares/auth.middleware';

const router = express.Router();

router.get('/', auth, getNotifications);
router.patch('/', auth, markAsRead);
router.post('/register-device', auth, registerDevice);
router.patch('/update-preference', auth, updateNotificationPreference);
router.patch('/admin/update-preference', auth,role("admin"), updateAdminNotificationPreference);
router.get("/get-preference",auth,getNotificationPreference)
export default router;