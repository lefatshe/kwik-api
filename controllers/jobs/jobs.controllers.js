const ErrorResponse = require('../../utils/errorResponse');
const asyncHandler = require('../../middleware/async');
const Job = require('../../models/job.model');

// @desc      Get jobs
// @route     GET /api/v1/jobs
// @route     GET /api/v1/orders/:orderId/orders
// @access    Public
exports.getJobs = asyncHandler(async (req, res, next) => {
    let query

    if (req.params.orderId) {
        query = Job.find({order: req.params.orderId})
    } else {
        query = Job.find()
            // .populate('order')
            .populate({
                path: 'order',
                select: 'name pickUpAddress dropOffAddress'
            })
    }

    const jobs = await query

    return res.status(200).json({
        success: true,
        count: jobs.length,
        data: jobs
    });

    // if (req.params.orderId) {
    //     const courses = await Job.find({ order: req.params.orderId });
    //
    //     return res.status(200).json({
    //         success: true,
    //         count: courses.length,
    //         data: courses
    //     });
    // } else {
    //     res.status(200).json(res.advancedResults);
    // }
});
