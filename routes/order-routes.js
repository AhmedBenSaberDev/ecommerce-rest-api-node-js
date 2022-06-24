const express = require('express');

const checkAuth = require('../middlewares/check-auth');
const isAdmin = require('../middlewares/isAdmin');
const OrderController = require('../controllers/order/orderController');

const router = express.Router();

router.post('/orders',checkAuth,OrderController.addOrderItems);
router.get('/orders',isAdmin,checkAuth,OrderController.fetchAllOrders);
router.get('/user_orders',checkAuth,OrderController.getUserOders);
router.get('/order/:id',checkAuth,OrderController.getOrder);
router.post('/order/:id/pay',checkAuth,OrderController.updateOrderToPaid);
router.get('/order/:id/deliver',checkAuth,isAdmin,OrderController.updateOrderToDelivered);


module.exports = router;