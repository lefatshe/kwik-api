const express = require('express')

const {
    getOrders, getByIdOrder, createOrder, updateOrder, deleteOrder, getOrdersInRadius, orderPhotoUpload
} = require('../controllers/orders/orders.controllers');

// Include resource routers
const jobsRouter = require('./jobs.route')

const router = express.Router();

const {protect} = require("../middleware/auth");

// -------------------------------------------------------------------------------------
// Add advanced search
const Order = require('../models/order.model');
const advancedResults = require('../middleware/advancedResults');
// -------------------------------------------------------------------------------------

// Re-route into other resource routers
router
    .use('/:orderId/jobs', jobsRouter)

router
    .route('/radius/:zipcode/:distance')
    .get(getOrdersInRadius);

router
    .route('/:id/photo')
    .put(orderPhotoUpload);


router
    .route('/')
    .get(advancedResults(Order, 'orders'), getOrders)
    .post(createOrder)

router
    .route('/:id')
    .get(getByIdOrder)
    .put(protect, updateOrder)
    .delete(deleteOrder)

module.exports = router
