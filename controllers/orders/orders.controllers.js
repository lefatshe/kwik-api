const Order = require('../../models/order.model');
const ErrorResponse = require('../../utils/errorResponse');
const asyncHandler = require('../../middleware/async')
const geocoder = require('../../utils/geocoder');

// ----------------------------------------------------------
// @desc:   getOrders
// @route:   GET /api/v1/orders
// @access:   Public
exports.getOrders = asyncHandler(async (req, res, next) => {
    let query;

    let queryStr = JSON.stringify(req.query)

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = Order.find(JSON.parse(queryStr))
        .populate('jobs')

    const order = await query

    res
        .status(200)
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
            new ErrorResponse(`Order not found of id ${req.params.id}`, 404)
        )
    }

    return res.status(200).json({success: true, data: order})
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
    const order = await Order.findById(req.params.id)
    if (!order) {
        return next(
            new ErrorResponse(`Orders not found with id ${req.params.id}`, 404)
        );
    }

    order.remove()

    res.status(200).json({success: true, data: {}})
})

// fixme : Check errors when calculating /radius/:zipcode/:distance
// ----------------------------------------------------------
// @desc      Get order within a radius
// @route     GET /api/v1/order/radius/:zipcode/:distance
// @access    Private
exports.getOrdersInRadius = asyncHandler(async (req, res, next) => {
    const {zipcode, distance} = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;

    const orders = await Order.find({
        // derived from dropLocation
        pickLocation: {$geoWithin: {$centerSphere: [[lng, lat], radius]}}
    });

    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
    });
});

