import express from 'express';
import { userAuthMiddleware } from '../middlewares/auth.middleware.js';
import {
    createCategoryController,
    getCategoryController,
    updateCategoryController,
    deleteCategoryController,
    fatchAllCategoryController,
    createSubCategoryController,
    getSubCategoryController,
    updateSubCategoryController,
    deleteSubCategoryController,
    fatchAllSubCategoryController,
    getSubCategoryByCategoryIdController
} from '../controllers/category.controller.js';

const router = express.Router();

router.get('/seller/categories', userAuthMiddleware, getCategoryController);
router.post('/seller/categories', userAuthMiddleware, createCategoryController);
router.put('/seller/categories/:id', userAuthMiddleware, updateCategoryController);
router.delete('/seller/categories/:id', userAuthMiddleware, deleteCategoryController);
router.get('/buyer/categories', fatchAllCategoryController);

router.get('/seller/subcategories', userAuthMiddleware, getSubCategoryController);
router.get('/seller/subcategories/:categoryId', userAuthMiddleware, getSubCategoryByCategoryIdController);
router.post('/seller/subcategories', userAuthMiddleware, createSubCategoryController);
router.put('/seller/subcategories/:id', userAuthMiddleware, updateSubCategoryController);
router.delete('/seller/subcategories/:id', userAuthMiddleware, deleteSubCategoryController);
router.get('/buyer/subcategories', fatchAllSubCategoryController);

export default router;
