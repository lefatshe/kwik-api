const express = require('express')

const {
    getOrders,
    getByIdOrder,
    createOrder,
    updateOrder,
    deleteOrder
} = require('../controllers/orders/orders.controllers')

const router = express.Router()

router
    .route('/')
    .get(getOrders)
    .post(createOrder)

router
    .route('/:id')
    .get(getByIdOrder)
    .put(updateOrder)
    .delete(deleteOrder)

module.exports = router
