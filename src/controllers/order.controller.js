import {
    createOrder,
    getSellerOrders,
    getSellerOrderById,
    updateOrderStatus,
    sendOrderAcceptedNotification,

    getBuyerOrders,
    getBuyerOrderById,
    cancelBuyerOrder,
    updateBuyerOrderAddress,
    calculateOrderDetails,
    deleteOrderItem
} from '../services/order.service.js';

const createBuyerOrderController = async (req, res) => {

    try {

        const products = req.body.products;
        
        const orderDetails = await calculateOrderDetails(products);
        console.log(orderDetails);
        
        const order = await createOrder({ buyer_id: req.user.id, ...orderDetails, ...req.body });

        return res.status(200).json({
            error: false,
            message: 'Order created successfully!',
            data: order
        });

    } catch (error) {

        throw Error(error);

    }
};

const getBuyerOrdersController = async (req, res) => {

    try {

        const orders = await getBuyerOrders({ buyerId: req.user.id });

        return res.status(200).json({
            error: false,
            message: 'Order retrived successfully!',
            data: orders
        });

    } catch (error) {

        throw Error(error);

    }
};

const getBuyerOrderByIdController = async (req, res) => {

    try {

        const order = await getBuyerOrderById(req.params.id);

        return res.status(200).json({
            error: false,
            message: 'Order retrived by id successfully!',
            data: order
        });

    } catch (error) {

        throw Error(error);

    }
};

const cancelBuyerOrderController = async (req, res) => {

    try {

        const cancleOrder = await cancelBuyerOrder(req.params.id);
        const deleteWithOrderItem = await deleteOrderItem(req.params.id);

        return res.status(200).json({
            error: false,
            message: 'Order deleted successfully!',
            data: cancleOrder, deleteWithOrderItem
        });

    } catch (error) {

        throw Error(error);

    }
};

const updateBuyerOrderAddressController = async (req, res) => {

    try {

        const updateAddress = await updateBuyerOrderAddress({
            id: req.params.id,
            ...req.body
        });

        return res.status(200).json({
            error: false,
            message: 'Order address updated successfully!',
            data: updateAddress
        });

    } catch (error) {

        throw Error(error);

    }
};

const getSellerOrdersController = async (req, res) => {

    try {

        const ordersWithItems = await getSellerOrders({ sellerId: req.user.id });

        return res.status(200).json({
            error: false,
            message: 'Order retrived successfully!',
            data: ordersWithItems
        });

    } catch (error) {

        throw Error(error);

    }
};

const getSellerOrderByIdController = async (req, res) => {

    try {

        const order = await getSellerOrderById({ orderId: req.params.id });

        return res.status(200).json({
            error: false,
            message: 'Order retrived by id successfully!',
            data: order
        });

    } catch (error) {

        throw Error(error);

    }
};

const updateOrderStatusAndNotifyController = async (req, res) => {
    try {
        const orderId = req.params.id;
        const newStatus = req.body.status;
        const updatedOrderStatus = await updateOrderStatus(orderId, newStatus);
        let emailResult = null;
        if (newStatus === 'accepted') {
            emailResult = await sendOrderAcceptedNotification(orderId);
        }
        return res.status(200).json({
            error: false,
            message: `Order status updated to "${newStatus}" successfully!` +
                (emailResult ? ' Email sent successfully!' : ''),
            data: {
                order: updatedOrderStatus,
                ...(emailResult && { email: emailResult })
            }
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        return res.status(500).json({
            error: true,
            message: "Failed to update order status.",
            details: error.message
        });
    }
};


export {
    getSellerOrdersController,
    getSellerOrderByIdController,
    createBuyerOrderController,
    getBuyerOrdersController,
    getBuyerOrderByIdController,
    cancelBuyerOrderController,
    updateBuyerOrderAddressController,
    updateOrderStatusAndNotifyController
}

