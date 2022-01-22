const mongoose = require('mongoose')
const slug = require('slugify')
const geocoder = require('../utils/geocoder')

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
    dropOffAddress: {
        type: String,
        required: [
            true,
            'Please provide address'
        ]
    },
    pickUpAddress: {
        type: String,
        required: [
            true,
            'Please provide address'
        ]
    },
    pickLocation: {
        // Geo Json default fields
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
    dropLocation: {
        // Geo Json default fields
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

// Create slug from name
OrderSchema.pre('save', function (next) {
    this.slug = slug(this.name, {lower: true})
    next()
})

// Create geoCoder dropOffAddress &&
// Create geoCoder pickUpAddress
OrderSchema.pre('save', async function (next) {
    const pickUp = await geocoder.geocode(this.pickUpAddress);
    const dropOff = await geocoder.geocode(this.dropOffAddress);

    this.pickLocation = {
        type: 'Points',
        coordinates: [pickUp[0].longitude, pickUp[0].latitude],
        formattedAddress: pickUp[0].formattedAddress,
        street: pickUp[0].streetName,
        city: pickUp[0].city,
        state: pickUp[0].stateCode,
        zipCode: pickUp[0].zipCode,
        country: pickUp[0].countryCode
    }

    this.dropLocation = {
        type: 'Points',
        coordinates: [dropOff[0].longitude, dropOff[0].latitude],
        formattedAddress: dropOff[0].formattedAddress,
        street: dropOff[0].streetName,
        city: dropOff[0].city,
        state: dropOff[0].stateCode,
        zipCode: dropOff[0].zipCode,
        country: dropOff[0].countryCode
    }

    // Do not add
    this.pickUpAddress = undefined
    this.dropOffAddress = undefined
    next()
})


// Create slug from name
module.exports = mongoose.model('Order', OrderSchema)
