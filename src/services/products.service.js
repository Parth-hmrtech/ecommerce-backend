import product from '../models/products.js';
import categories from '../models/categories.js';
import subCategories from '../models/subCategories.js';
import wishlist from '../models/wishlist.js';

const createProduct = async ({ seller_id, ...productBody }) => {
  
    const createdProduct = await product.create({
        seller_id, ...productBody
    });
  
    return createdProduct;
};
const uploadProductImage = async ({ product_id, image_urls }) => {
  if (!Array.isArray(image_urls)) {
    throw new Error("image_urls must be an array");
  }

  const formattedImages = image_urls.map((url) => ({ image_url: url }));

  const result = await product.update(
    { image_url: formattedImages },
    { where: { id: product_id } }
  );

  return result[0];
};


const getProduct = async (userId) => {
  
    const products = await product.findAll({
  
        where: { seller_id: userId.id },
  
        include: [
            {
                model: categories,
                as: 'category',
            },
            {
                model: subCategories,
                as: 'subCategory',
            },
        ],
  
    });
  
    return products;
};

const updateProduct = async ({ productId, ...updateProductRecords }) => {

    const updatedProduct = await product.update({
        ...updateProductRecords
    }, { where: { id: productId } });

    return updatedProduct[0] > 0 ? true : false;
}

const deleteProduct = async (productId) => {
  
    const deletedProduct = await product.destroy({
        where: {
            id: productId,
        },
    });
  
    return deletedProduct;
};

const fatchAllProducts = async () => {
  
    const products = await product.findAll({
  
        include: [
            {
                model: categories,
                as: 'category',
                attributes: { exclude: ['deleted_at'] },
            },
            {
                model: subCategories,
                as: 'subCategory',
                attributes: { exclude: ['deleted_at'] },
            },
        ],
  
    });
  
    return products;
};

const fetchProductById = async (id) => {
    const productData = await product.findOne({
        where: { id },
        include: [
            {
                model: categories,
                as: 'category',
                attributes: { exclude: ['deleted_at'] },
            },
            {
                model: subCategories,
                as: 'subCategory',
                attributes: { exclude: ['deleted_at'] },
            },
        ],
    });

    return productData;
};

const createWishlist = async ({ buyer_id, ...wishlistBody }) => {

    const wishlistItem = await wishlist.create({
        buyer_id,
        ...wishlistBody,
    });
  
    return wishlistItem;
};

const getWishlist = async (userId) => {
  
    const wishlistItem = await wishlist.findAll({
  
        where: {
            buyer_id: userId,
        },
  
    });
  
    return wishlistItem;
};

const deleteWishlist = async (productId) => {
console.log(productId);

    const deletedCount = await wishlist.destroy({
        where: {
            product_id: productId,
        },
    });
    console.log(deletedCount);
    
    return deletedCount > 0;
};

export {
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
}