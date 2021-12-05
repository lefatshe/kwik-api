const Order = require('../../models/order.model');
const ErrorResponse = require('../../utils/errorResponse');

// ----------------------------------------------------------
// @desc:   getOrders
// @route:   GET /api/v1/orders
// @access:   Public
exports.getOrders = async (req, res, next) => {
    try {
        const order = await Order.find()
        res
            .status(200)
            .json({
                success: true,
                count: order.length,
                data: order
            })
    } catch (err) {
        next(err)
    }
}

// ----------------------------------------------------------
// @desc:   getOrder ID
// @route:   GET /api/v1/orders/:id
// @access:   Public
exports.getByIdOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return next(
                ErrorResponse(`Orders not found with id`, 404)
            );
        }

        res.status(200).json({success: true, data: order});

    } catch (err) {
        next(err)
    }
}

// ----------------------------------------------------------
// @desc:   Create new order
// @route:   POST /api/v1/order
// @access:   Private
exports.createOrder = async (req, res, next) => {
    try {
        const order = await Order.create(req.body)
        res.status(201).json({success: true, data: order})
    } catch (err) {
        next(err)
    }
}

// ----------------------------------------------------------
// @desc:   Update order
// @route:   PUT /api/v1/order/:id
// @access:   Private
exports.updateOrder = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        if (!order) {
            return next(
                new ErrorResponse(`Orders not found with id ${req.params.objectId}`, 404)
            );
        }

        res.status(200).json({success: true, data: order})
    } catch (err) {
        next(err)
    }
}

// ----------------------------------------------------------
// @desc:   Delete order
// @route:   DELETE /api/v1/order/:id
// @access:   Private
exports.deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id)

        if (!order) {
            // return res.status(400).json({success: false})
            return next(
                new ErrorResponse(`Orders not found with id ${req.params.objectId}`, 404)
            );
        }

        res.status(200).json({success: true, data: {}})
    } catch (e) {
        next.err()
    }
}
