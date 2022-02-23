const express = require('express');
const {
    getJobs,
    getJob,
    addJob,
    updateJob,
    deleteJob
} = require('../controllers/jobs/jobs.controllers');

const router = express.Router({mergeParams: true});

router
    .route('/')
    .get(getJobs)
    .post(addJob)

router
    .route('/:id')
    .get(getJob)
    .put(updateJob)
    .delete(deleteJob)

module.exports = router;
