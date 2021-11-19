const express = require('express')
const router = express.Router()
const {
    getOrders,
    getByIdOrder,
    createOrder,
    updateOrder,
    deleteOrder
} = require('../controllers/orders/orders.controllers')

router.route('/')
    .get(getOrders)
    .post(createOrder)

router.route('/:id')
    .get(getByIdOrder)
    .put(updateOrder)
    .delete(deleteOrder)

module.exports = router
