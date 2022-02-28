const express = require('express');
const {
    getJobs, getJob, addJob, updateJob, deleteJob
} = require('../controllers/jobs/jobs.controllers');

const router = express.Router({mergeParams: true});

// -------------------------------------------------------------------------------------
// Add advanced search
const Job = require('../models/job.model');
const advancedResults = require('../middleware/advancedResults');
// -------------------------------------------------------------------------------------

router
    .route('/')
    .get(advancedResults(Job, {
        path: 'order', select: 'name pickUpAddress dropOffAddress'
    }), getJobs)
    .post(addJob)

router
    .route('/:id')
    .get(getJob)
    .put(updateJob)
    .delete(deleteJob)

module.exports = router;
