const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please name '],
        unique: true,
        trim: true,
        maxlength: [50, 'Should be 50 characters'],
    },
    slug: String,
    email: {
        type: String,
        match: [
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
            'Please use valid email address'
        ]
    },
    phone: {
        type: String,
        maxlength: [
            20,
            'Please use valid phone number'
        ]
    },
    address: {
        type: String,
        required: [
            true,
            'Please provide address'
        ]
    },
    location: {
        // Geo Json
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        states: String,
        zipcode: String,
        country: String
    },
    description: {
        type: String,
        required: [false],
        maxlength: [500, '']
    },
    priority: {
        type: [String],
        required: true,
        enum: [
            'slow',
            'moderate',
            'kwik'
        ]
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Order', OrderSchema)
