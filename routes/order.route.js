const express = require('express')

const {
    getOrders,
    getByIdOrder,
    createOrder,
    updateOrder,
    deleteOrder,
    getOrdersInRadius
} = require('../controllers/orders/orders.controllers');

// Include resource routers
const jobsRouter = require('./jobs.route')

const router = express.Router();

const {protect} = require("../middleware/auth");

// Re-route into other resource routers
router
    .use('/:orderId/jobs', jobsRouter)

router
    .route('/radius/:zipcode/:distance')
    .get(getOrdersInRadius);

router
    .route('/')
    .get(getOrders)
    .post(createOrder)

router
    .route('/:id')
    .get(getByIdOrder)
    .put(protect, updateOrder)
    .delete(deleteOrder)

module.exports = router
