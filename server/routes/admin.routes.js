import express from 'express';
import {
	createAdmin,
	loginAdmin,
	refreshAdminToken,
	logoutAdmin,
	getCurrentAdmin,
	getCloudinaryUploadSignature,
} from '../controllers/adminController.js';
import { requireAdminAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', createAdmin);
router.post('/login', loginAdmin);
router.post('/refresh-token', refreshAdminToken);
router.post('/logout', logoutAdmin);
router.get('/me', requireAdminAuth, getCurrentAdmin);
router.post('/cloudinary-signature', requireAdminAuth, getCloudinaryUploadSignature);



export default router;
