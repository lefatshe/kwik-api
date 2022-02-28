const ErrorResponse = require('../../utils/errorResponse');
const asyncHandler = require('../../middleware/async');
const Job = require('../../models/job.model');
const Order = require('../../models/order.model');

// @desc      Get jobs
// @route     GET /api/v1/jobs
// @route     GET /api/v1/orders/:orderId/orders
// @access    Public
exports.getJobs = asyncHandler(async (req, res, next) => {

    if (req.params.orderId) {
        const jobs = await Job.find({order: req.params.orderId})

        return res.status(200).json({
            success: true, count: jobs.length, data: jobs
        })
    } else {
        res.status(200).json(res.advancedResults);
    }

});


// @desc      Get single job
// @route     GET /api/v1/jobs/:id
// @access    Public
exports.getJob = asyncHandler(async (req, res, next) => {
    const job = await Job.findById(req.params.id).populate({
        path: 'order', select: 'name pickUpAddress dropOffAddress'
    });

    if (!job) {
        return next(new ErrorResponse(`No job with the id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true, data: job
    });
});


// @desc      Add job
// @route     POST /api/v1/orders/:orderId/jobs
// @access    Private
exports.addJob = asyncHandler(async (req, res, next) => {
    req.body.order = req.params.orderId;
    // req.body.user = req.user.id;

    const order = await Order.findById(req.params.orderId);

    if (!order) {
        return next(new ErrorResponse(`No Order with the id of ${req.params.orderId}`, 404));
    }

    // Make sure user is bootcamp owner
    // if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    //     return next(
    //         new ErrorResponse(
    //             `User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`,
    //             401
    //         )
    //     );
    // }

    const job = await Job.create(req.body);

    res.status(200).json({
        success: true, data: job
    });
});


// @desc      Update job
// @route     PUT /api/v1/jobs/:id
// @access    Private
exports.updateJob = asyncHandler(async (req, res, next) => {
    let job = await Job.findById(req.params.id);

    if (!job) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`, 404));
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true, runValidators: true
    })

    res.status(200).json({
        success: true, data: job
    });
});


// @desc      Delete job
// @route     DELETE /api/v1/jobs/:id
// @access    Private
exports.deleteJob = asyncHandler(async (req, res, next) => {
    const job = await Job.findById(req.params.id);

    if (!job) {
        return next(new ErrorResponse(`No job with the id of ${req.params.id}`, 404));
    }

    await job.remove()

    res.status(200).json({
        success: true, data: {}
    });
});
