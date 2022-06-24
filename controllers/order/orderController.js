const OrderModel = require('../../models/OrderModel');


// @desc Create new order
// @route POST /api/orders  
// @access Private  
module.exports.addOrderItems = async (req,res) => {
    const { orderItems , shippingAddress , paymentMethod , taxPrice , shippingPrice  , totalPrice} = req.body;

    let newOrder;

    if(orderItems && orderItems.length == 0){
        return res.status(400).json({message:"No order items"})
    }else{
        try {
           newOrder = await OrderModel.create( {
                orderItems , 
                shippingAddress , 
                paymentMethod , 
                taxPrice , 
                shippingPrice  , 
                totalPrice,
                name:req.user._id
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({message:"An error occured"})
        }
    }

    res.json(newOrder);
} 

// @desc Get order info
// @route GET /api/order/:id 
// @access Private  
module.exports.getOrder = async (req,res) => {

    let order;

    try {
        order = await OrderModel.findById(req.params.id).populate('name','-password');
    } catch (error) {
        return res.status(500).json({message:"An error occured"});
    }

    if(!order){
        return res.status(404).json({message:"Order not found"});
    }
    return res.json(order);
}

// @desc Update order status to paid
// @route POST /api/order/:id/pay
// @access Private  
module.exports.updateOrderToPaid = async (req,res) => {
    let order;

    try {
        order = await OrderModel.findById(req.params.id).populate('name','-password');
    } catch (error) {
        return res.status(500).json({message:"An error occured"});
    }

    if(!order){
        return res.status(404).json({message:"Order not found"});
    }

    order.isPaid = true;
    order.isPaidAt = Date.now();
    order.paymentResult = {
        id:req.body.paymentResult.id,
        status:req.body.paymentResult.status,
        update_time:req.body.paymentResult.update_time,
        email_address:req.body.paymentResult.payer.email_address
    }

    try {
        await order.save();
    } catch (error) {
        return res.status(404).json({message:"Order not found"});
    }

    return res.json(order);
}

// @desc Update order status to delivered
// @route POST /api/order/:id/deliver
// @access Admin  
module.exports.updateOrderToDelivered = async (req,res) => {
    let order;

    try {
        order = await OrderModel.findById(req.params.id).populate('name','-password');
    } catch (error) {
        return res.status(500).json({message:"An error occured"});
    }

    if(!order){
        return res.status(404).json({message:"Order not found"});
    }

    order.isDelivered = true;
    order.isisDeliveredAt = Date.now();

    try {
        await order.save();
    } catch (error) {
        return res.status(404).json({message:"Order not found"});
    }

    return res.json(order);
}

// @desc Get all user orders
// @route GET /api/user_orders
// @access Private
module.exports.getUserOders = async (req,res) => {

    let orders;

    try {
        orders = await OrderModel.find({name:req.user._id})
    } catch (error) {
        res.status(500).json({message:"An error occured"});
    }

    return res.json(orders);
}

// @desc Get all orders
// @route GET /api/orders
// @access Admin
module.exports.fetchAllOrders = async (req,res) => {

    let orders;

    try {
        orders = await OrderModel.find();
    } catch (error) {
        return res.srtatus(500).json({message:"An error occured"});
    }

    return res.json(orders);
}