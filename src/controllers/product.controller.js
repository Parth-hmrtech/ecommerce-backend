import {
    createProduct,
    uploadProductImage,
    getProduct,
    updateProduct,
    deleteProduct,
    fatchAllProducts,
    createWishlist,
    deleteWishlist,
    getWishlist,
    fetchProductById
} from '../services/products.service.js';
import fs from 'fs/promises';
import path from 'path';
import { uploadFile } from '../utils/uploadImage.js';

const createProductController = async (req, res) => {

    try {

        const createdProduct = await createProduct({ seller_id: req.user.id, ...req.body });

        return res.status(200).json({
            error: false,
            message: "Product Created successfully!",
            data: createdProduct,
        });

    } catch (error) {

        throw Error(error);

    }
};

const imageProductController = async (req, res) => {
    try {
        const { product_id } = req.body;
        const image_urls = [];
        
        for (const file of req.files) {
            const result = await uploadFile(file.path); 
            image_urls.push(result);
        }
       
        const updateResult = await uploadProductImage({ product_id, image_urls });

        res.status(200).json({
            message: "Images uploaded successfully",
            updated: updateResult,
            data : image_urls
        });
    } catch (error) {
        console.error(" Error in controller:", error);
        res.status(500).json({ error: error.message });
    }
};


const getProductController = async (req, res) => {

    try {

        const products = await getProduct(req.user);

        return res.status(200).json({
            error: false,
            message: "Product retrieved successfully!",
            data: products,
        });

    } catch (error) {

        throw Error(error);

    }
};

const getProductByIdController = async (req, res) => {
    try {
        const productId = req.params.productId; // get product ID from the route

        const product = await fetchProductById(productId); // you'll need to define this function

        if (!product) {
            return res.status(404).json({
                error: true,
                message: "Product not found!",
            });
        }

        return res.status(200).json({
            error: false,
            message: "Product retrieved successfully!",
            data: product,
        });

    } catch (error) {
        console.error("Error fetching product by ID:", error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
};


const updateProductController = async (req, res) => {

    try {

        const products = await updateProduct({ productId: req.params.id, ...req.body });

        return res.status(200).json({
            error: false,
            message: "Product updated successfully!",
            data: products,
        });

    } catch (error) {

        throw Error(error);

    }
};

const deleteProductController = async (req, res) => {

    try {

        const deletedProduct = await deleteProduct(req.params.id);

        return res.status(200).json({
            error: false,
            message: "Product deleted successfully!",
            data: deletedProduct,
        });

    } catch (error) {

        throw Error(error);

    }
};

const fatchAllProductController = async (req, res) => {

    try {

        const products = await fatchAllProducts();

        return res.status(200).json({
            error: false,
            message: "All product retrived successfully!",
            data: products,
        });

    } catch (error) {

        throw Error(error);

    }
};


const createWishlistController = async (req, res) => {

    try {

        const wishlist = await createWishlist({ buyer_id: req.user.id, ...req.body });

        return res.status(200).json({
            error: false,
            message: "Wishlist create successfully!",
            data: wishlist
        });

    } catch (error) {

        throw Error(error);

    }
};

const getWishlistController = async (req, res) => {

    try {

        const wishlistItem = await getWishlist(req.user.id);

        return res.status(200).json({
            error: false,
            message: "Wishlist retrived successfully!",
            data: wishlistItem
        });

    } catch (error) {

        throw Error(error);

    }
};

const deleteWishlistController = async (req, res) => {

    try {

        const isDeleted = await deleteWishlist(req.params.productId);
        
        return res.status(200).json({
            error: false,
            message: "Wishlist deleted successfully!",
            data: isDeleted
        });

    } catch (error) {

        throw Error(error);

    }
};

export {
    createProductController,
    imageProductController,
    getProductController,
    getProductByIdController,
    updateProductController,
    deleteProductController,
    fatchAllProductController,
    getWishlistController,
    createWishlistController,
    deleteWishlistController,
}