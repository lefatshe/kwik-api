const express = require('express');

const {
    register
} = require('../controllers/auth/auth.controllers')

const router = express.Router()

router
    .route('/register')
    .post(register)

module.exports = router;