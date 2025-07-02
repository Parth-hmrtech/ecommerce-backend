import cart from '../models/cart.js';

const createCart = async ({ buyer_id, ...cartItemBody }) => {
  const cartItem = await cart.create({
    buyer_id,
    ...cartItemBody,
  });
  return cartItem;
};

const getCart = async ({ id }) => {
  const cartItems = await cart.findAll({
    where: {
      buyer_id: id,
    },
    order: [['created_at', 'ASC']],
  });
  return cartItems;
};

const updateCart = async ({ cartId, quantity }) => {
  const updated = await cart.update({ quantity }, { where: { id: cartId } });
  return updated[0] > 0;
};

const deleteCart = async (cartId) => {
  const deletedCart = await cart.destroy({
    where: {
      id: cartId,
    },
  });
  return deletedCart;
};


const deleteBuyerCart = async (buyerId) => {
  try {
    const deletedCount = await cart.destroy({
      where: { buyer_id: buyerId },
    });
    console.log(deletedCount);
    
    if (deletedCount > 0) {
      return {
        success: true,
        message: 'Buyer cart deleted successfully.',
        deletedCount,
      };
    } else {
      return {
        success: false,
        message: 'No cart items found for this buyer.',
        deletedCount: 0,
      };
    }
  } catch (error) {
    console.error('Service Error in deleteBuyerCart:', error);
    return {
      success: false,
      message: 'Error deleting buyer cart.',
      deletedCount: 0,
    };
  }
};



export {
  createCart,
  getCart,
  updateCart,
  deleteCart,
  deleteBuyerCart,
};
