const Order = require('../../models/order.model');
const ErrorResponse = require('../../utils/errorResponse');
const asyncHandler = require('../../middleware/async')
const geocoder = require('../../utils/geocoder');
const path = require('path');
const fs = require('fs');

// ----------------------------------------------------------
// @desc:   getOrders
// @route:   GET /api/v1/orders
// @access:   Public
exports.getOrders = asyncHandler(async (req, res, next) => {

    // Create advanced search on all : GET /orders
    res
        .status(200)
        .json(res.advancedResults);

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


// @desc      Upload photo for order
// @route     PUT /api/v1/orders/:id/photo
// @access    Private
exports.orderPhotoUpload = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(
            new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is order owner
    // if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    //     return next(
    //         new ErrorResponse(
    //             `User ${req.user.id} is not authorized to update this bootcamp`,
    //             401
    //         )
    //     );
    // }

    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file;

    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(
                `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
                400
            )
        );
    }

    // Create custom filename
    file.name = `photo_${order._id}${path.parse(file.name).ext}`;
    // Upload file path
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }

        await Order.findByIdAndUpdate(req.params.id, {photo: file.name});

        res.status(200).json({
            success: true,
            data: file.name
        });
    });
});

