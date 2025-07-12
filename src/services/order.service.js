import order from '../models/order.js';
import users from '../models/user.js';
import product from '../models/products.js';
import sequelize from '../config/dbConnect.js';
import orderItems from '../models/orderItem.js';
import { sendOrderAcceptedEmail } from '../utils/emailOrderService.js';  // adjust relative path if needed

const createOrder = async ({ buyer_id, products, ...orderBody }) => {
   
    console.log(buyer_id);
    
    const t = await sequelize.transaction();

    try {

        const orderRecord = await order.create({
            buyer_id,
            ...orderBody,
            order_date: new Date(),
            status: 'Pending',
        }, { transaction: t });

        let orderItemsData = [];

        for (const item of products) {

            const { product_id, quantity } = item;
            const productData = await product.findOne({
                where: { id: product_id },
                transaction: t,
            });

            if (!productData) {
                throw new Error(`Product with ID ${product_id} not found`);
            }

            orderItemsData.push({
                order_id: orderRecord.id,
                product_id,
                price: productData.price,
                quantity,
            });

        }

        await orderItems.bulkCreate(orderItemsData, {
            transaction: t,
            validate: true,
        });

        await t.commit();
        return orderRecord;

    } catch (error) {

        await t.rollback();
        throw error;

    }
};

const getBuyerOrders = async ({ buyerId }) => {
    
    const ordersWithItems = await order.findAll({

        where: { buyer_id: buyerId },

        include: [
            {
                model: orderItems,
            }
        ]
    });
    
    return ordersWithItems;

};

const getBuyerOrderById = async (orderId) => {

    const orders = await order.findByPk(orderId);

    return orders;
};

const cancelBuyerOrder = async (orderId) => {

    const orders = await order.findByPk(orderId);

    orders.status = 'Cancelled';

    const updatedOrder = await orders.save();

    return updatedOrder;
};

const updateBuyerOrderAddress = async ({ id, ...body }) => {

    const orders = await order.findByPk(id);

    orders.delivery_address = body.delivery_address;

    await orders.save();
    return orders;
};

const getSellerOrders = async ({ sellerId }) => {

    const ordersWithItems = await order.findAll({

        // where: { seller_id: sellerId },

        include: [
            {
                model: orderItems,
            }
        ]

    });

    return ordersWithItems;
};

const getSellerOrderById = async ({ orderId }) => {

    const orderData = await order.findByPk(orderId, {

        include: [
            {
                model: orderItems,
            }
        ]

    });

    return orderData;
};
const updateOrderStatus = async (orderId, status) => {
    const orders = await order.findByPk(orderId);
    if (!orders) throw new Error('Order not found');

    orders.status = status;
    await orders.save();

    return orders;
};


const sendOrderAcceptedNotification = async (orderId) => {
    const orders = await order.findByPk(orderId);
    if (!orders) throw new Error('Order not found');

    const buyer = await users.findByPk(orders.buyer_id);
    if (!buyer) throw new Error('Buyer not found');

    await sendOrderAcceptedEmail(buyer.email, orderId);

    return { emailSentTo: buyer.email };
};


const calculateOrderDetails = async (products) => {

    let total_amount = 0;
    let seller_id = null;

    for (const item of products) {

        const products = await product.findByPk(item.product_id);

        seller_id = products.seller_id;
        total_amount = total_amount + item.quantity * products.price;

    }
    console.log(seller_id);
    console.log(total_amount);
    
    return { seller_id, total_amount };
};

const deleteOrderItem = async (orderId) => {

    const result = await orderItems.destroy({

        where: {
            order_id: orderId,
        },

    });

    return result;
};

export {
    createOrder,
    getSellerOrders,
    getSellerOrderById,
    updateOrderStatus,
    getBuyerOrders,
    getBuyerOrderById,
    cancelBuyerOrder,
    updateBuyerOrderAddress,
    calculateOrderDetails,
    sendOrderAcceptedNotification,
    deleteOrderItem
} 
