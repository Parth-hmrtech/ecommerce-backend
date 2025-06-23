import {
    createCart,
    deleteCart,
    getCart,
    updateCart,
    deleteBuyerCart
} from '../services/cart.service.js';

const createCartController = async (req, res) => {
    try {
        const cart = await createCart({ buyer_id: req.user.id, ...req.body });

        return res.status(200).json({
            error: false,
            message: "Cart created successfully!",
            data: cart
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message || "Failed to create cart",
        });
    }
};

const getCartController = async (req, res) => {
    try {
        const cartItems = await getCart({ id: req.user.id });

        return res.status(200).json({
            error: false,
            message: "Cart retrieved successfully!",
            data: cartItems
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message || "Failed to get cart",
        });
    }
};

const updateCartController = async (req, res) => {
    try {
        const updatedCartItems = await updateCart({ cartId: req.params.id, ...req.body });

        return res.status(200).json({
            error: false,
            message: "Cart updated successfully!",
            data: updatedCartItems
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message || "Failed to update cart",
        });
    }
};

const deleteCartController = async (req, res) => {
    try {
        const deletedCart = await deleteCart(req.params.id);

        return res.status(200).json({
            error: false,
            message: "Cart deleted successfully!",
            data: deletedCart
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message || "Failed to delete cart",
        });
    }
};

// 🛒 Controller
const deleteBuyerCartController = async (req, res) => {
  try {
    
    const { buyerId } = req.params;


    const result = await deleteBuyerCart(buyerId);


    return res.status(200).json({
      error: !result.success,
      message: result.message,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting buyer cart:", error);
    return res.status(500).json({
      error: true,
      message: "Failed to delete buyer’s cart.",
    });
  }
};

export {
    createCartController,
    getCartController,
    updateCartController,
    deleteCartController,
    deleteBuyerCartController
};
