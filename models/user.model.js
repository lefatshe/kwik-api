const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Should be 50 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please enter email'],
        unique: true,
        match: [
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
            'Please use valid email address'
        ]
    },
    role: {
        type: [String],
        required: true,
        enum: [
            'user',
            'publisher'
        ],default: 'user'
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// bcrypt password
UserSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
    const {JWT_EXPIRE} = process.env;
    const {JWT_SECRET} = process.env;

    return jwt.sign({id: this._id}, JWT_SECRET, {
        expiresIn: JWT_EXPIRE
    })
}

// Match user entered password to hash
UserSchema.methods.matchPassword = async function(enterdPassword) {
    return await bcrypt.compare(enterdPassword, this.password)
}

module.exports = mongoose.model('User', UserSchema);
