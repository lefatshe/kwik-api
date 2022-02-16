const User = require('../../models/user.model');
const ErrorResponse = require('../../utils/errorResponse');
const asyncHandler = require('../../middleware/async')

// ----------------------------------------------------------
// @desc:   Register user
// @route:   POST /api/v1/auth/register
// @access:   Public
exports.register = asyncHandler(async (req, res, next) => {
    const {name, email, password, role} = req.body;

    // create a user
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    // create token
    sendTokenResponse(user, 200, res)
})


// ----------------------------------------------------------
// @desc:   login user
// @route:   POST /api/v1/auth/login
// @access:   Public
exports.login = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;

    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please check email/password', 400))
    }

    // Check for user
    const user = await User.findOne({email}).select('+password');
    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    // create token
    sendTokenResponse(user, 200, res)
})

// ----------------------------------------------------------
// @desc: Get token from model also create cookie and send respond
const sendTokenResponse = (user, statusCode, res) => {
    // create token
    const token = user.getSignedJwtToken()

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })
}
