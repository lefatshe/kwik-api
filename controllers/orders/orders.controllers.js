const Order = require('../../models/order.model')


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
    } catch (e) {
        res
            .status(400)
            .json({success: false})
    }
}

// @desc:   getOrder ID
// @route:   GET /api/v1/orders/:id
// @access:   Public
exports.getByIdOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)

        if (!order) {
            return res
                .status(400)
                .json({success: false})
        }
        res
            .status(200)
            .json({success: true, data: order})

    } catch (e) {
        res
            .status(400)
            .json({success: false})
    }
}

// @desc:   Create new order
// @route:   POST /api/v1/order
// @access:   Private
exports.createOrder = async (req, res, next) => {
    try {
        const order = await Order.create(req.body)
        res
            .status(201)
            .json({success: true, data: order})
    } catch (e) {
        res
            .status(400)
            .json({success: false})
    }
}

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
            return res
                .status(400)
                .json({success: false})
        }

        res
            .status(200)
            .json({success: true, data: order})
    } catch (e) {
        res
            .status(400)
            .json({success: false})
    }
}

// @desc:   Delete order
// @route:   DELETE /api/v1/order/:id
// @access:   Private
exports.deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id)

        if (!order) {
            return res
                .status(400)
                .json({success: false})
        }

        res
            .status(200)
            .json({success: true, data: {}})
    } catch (e) {
        res
            .status(400)
            .json({success: false})
    }
}
