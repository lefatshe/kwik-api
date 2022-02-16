const express = require('express')

const {
    getOrders,
    getByIdOrder,
    createOrder,
    updateOrder,
    deleteOrder
} = require('../controllers/orders/orders.controllers');

const router = express.Router();
const {protect} = require("../middleware/auth");

router
    .route('/')
    .get(getOrders)
    .post(protect, createOrder)

router
    .route('/:id')
    .get(getByIdOrder)
    .put(protect,  updateOrder)
    .delete(protect, deleteOrder)

module.exports = router
