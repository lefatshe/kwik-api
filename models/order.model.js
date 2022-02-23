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

    // pickLocation - set as Geo-location
    pickLocation: {
        // Geo Json default fields
        // GeoJSON Point
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
        state: String,
        zipcode: String,
        country: String
    },

    // dropLocation - set as Geo-location
    dropLocation: {
        // GeoJSON Point
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
        state: String,
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
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

// Create slug from name
OrderSchema.pre('save', function (next) {
    this.slug = slug(this.name, {lower: true})
    next()
})

// Create geoCoder dropOffAddress &&
// Create geoCoder pickUpAddress
OrderSchema.pre('save', async function (next) {

    const defaultCountry = 'South Africa'
    const pickUpAddress = await geocoder.geocode(this.pickUpAddress);
    const dropOffAddress = await geocoder.geocode(this.dropOffAddress);

    // pickUpAddress
    this.pickUpAddress = pickUpAddress[0].formattedAddress;
    this.pickLocation = {
        type: 'Points',
        coordinates: [pickUpAddress[0].longitude, pickUpAddress[0].latitude],
        formattedAddress: pickUpAddress[0].formattedAddress,
        street: pickUpAddress[0].streetName,
        city: pickUpAddress[0].city,
        state: pickUpAddress[0].stateCode,
        zipcode: pickUpAddress[0].zipcode,
        country: defaultCountry
    };

    // dropOffAddress
    this.dropOffAddress = dropOffAddress[0].formattedAddress;
    this.dropLocation = {
        type: 'Points',
        coordinates: [dropOffAddress[0].longitude, dropOffAddress[0].latitude],
        formattedAddress: dropOffAddress[0].formattedAddress,
        street: dropOffAddress[0].streetName,
        city: dropOffAddress[0].city,
        state: dropOffAddress[0].stateCode,
        zipcode: dropOffAddress[0].zipcode,
        country: defaultCountry
    }

    next()
})

// Cascade delete courses when a bootcamp is deleted
OrderSchema.pre('remove', async function(next) {

    console.log(`Jobs being removed from Order ${this._id}`);

    await this.model('Job').deleteMany({ order: this._id });

    next();
});

// ----------------------------------------------------------------
// Reverse populate with virtuals
OrderSchema.virtual('jobs', {
    ref: 'Job',
    localField: '_id',
    foreignField: 'order',
    justOne: false
});


// Create slug from name
module.exports = mongoose.model('Order', OrderSchema)
