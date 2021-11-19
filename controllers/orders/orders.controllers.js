// @desc:   getOrders
// @route:   GET /api/v1/orders
// @access:   Public
exports.getOrders = (req, res, next) => {
    res
        .status(200)
        .json({success: true, msg: 'Show all orders'})
}

// @desc:   getOrder ID
// @route:   GET /api/v1/orders/:id
// @access:   Public
exports.getByIdOrder = (req, res, next) => {
    res
        .status(200)
        .json({success: true, msg: `show order ${req.params.id}`})
}

// @desc:   Create new order
// @route:   POST /api/v1/order
// @access:   Private
exports.createOrder = (req, res, next) => {
    res
        .status(200)
        .json({success: true, msg: 'Create new order'})
}

// @desc:   Update order
// @route:   PUT /api/v1/order/:id
// @access:   Private
exports.updateOrder = (req, res, next) => {
    res
        .status(200)
        .json({success: true, msg: `Update order ${req.params.id}`})
}

// @desc:   Delete order
// @route:   DELETE /api/v1/order/:id
// @access:   Private
exports.deleteOrder = (req, res, next) => {
    res
        .status(200)
        .json({success: true, msg: `Delete order ${req.params.id}`})
}
