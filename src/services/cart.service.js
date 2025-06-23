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
  console.log("deleteBuyerCart service called with buyerId:", buyerId);

  const deleted = await cart.destroy({
    where: {
      buyer_id: buyerId,
    },
  });

  if (deleted > 0) {
    return { success: true, message, deletedCount: deleted };
  } else {
    return { success: false, message, deletedCount: 0 };
  }
};


export {
  createCart,
  getCart,
  updateCart,
  deleteCart,
  deleteBuyerCart,
};
