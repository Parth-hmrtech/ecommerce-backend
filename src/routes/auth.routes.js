import express from 'express';
import multer from 'multer';
import {
    createUserController,
    loginUserController,
    logoutUserController,
    forgotPasswordController
} from '../controllers/auth.controller.js';
import { userAuthMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/register', upload.single('image'), createUserController);
router.post('/login', loginUserController);
router.post('/logout', userAuthMiddleware, logoutUserController);
router.post('/forgot-password', forgotPasswordController);

export default router;
