const Order = require('../../models/order.model');
const ErrorResponse = require('../../utils/errorResponse');
const asyncHandler = require('../../middleware/async')

// ----------------------------------------------------------
// @desc:   getOrders
// @route:   GET /api/v1/orders
// @access:   Public
exports.getOrders = asyncHandler(async (req, res, next) => {
    const order = await Order.find();
    res.status(200)
        .json({success: true, count: order.length, data: order});
})

// ----------------------------------------------------------
// @desc:   getOrder ID
// @route:   GET /api/v1/orders/:id
// @access:   Public
exports.getByIdOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(
            new ErrorResponse(`Orders not found with id ${req.params.id}`, 404)
        );
    }

    res.status(200).json({success: true, data: order});
})

// ----------------------------------------------------------
// @desc:   Create new order
// @route:   POST /api/v1/order
// @access:   Private
exports.createOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.create(req.body)
    res.status(201).json({
        success: true,
        data: order
    })
})

// ----------------------------------------------------------
// @desc:   Update order
// @route:   PUT /api/v1/order/:id
// @access:   Private
exports.updateOrder = asyncHandler(async (req, res, next) => {

    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!order) {
        return next(
            new ErrorResponse(`Orders not found with id ${req.params.id}`, 404)
        );
    }

    res.status(200).json({success: true, data: order})

})

// ----------------------------------------------------------
// @desc:   Delete order
// @route:   DELETE /api/v1/order/:id
// @access:   Private
exports.deleteOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findByIdAndDelete(req.params.id)
    if (!order) {
        return next(
            new ErrorResponse(`Orders not found with id ${req.params.id}`, 404)
        );
    }
    res.status(200).json({success: true, data: {}})
})
