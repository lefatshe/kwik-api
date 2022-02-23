const express = require('express');
const {
    getJobs
} = require('../controllers/jobs/jobs.controllers');

const router = express.Router({mergeParams: true});

router.route('/').get(getJobs)

module.exports = router;
