import express from 'express';
import multer from 'multer';

import {
    getUserController,
    resetPasswordController,
    updateUserController
} from '../controllers/user.controller.js';
import { userAuthMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // or use custom storage


router.get('/profile', userAuthMiddleware, getUserController);
router.put('/profile/:id', userAuthMiddleware, upload.single('image'), updateUserController);
router.post('/reset-password', userAuthMiddleware, resetPasswordController);

export default router;
