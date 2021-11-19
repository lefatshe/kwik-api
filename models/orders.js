const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    pickUp: {
        type: String,
        required: [true, 'Please add your location'],
        unique: true,
        trim: true,
        maxlength: [50, 'Should be 50 characters'],
    },
    dropOf: {
        type: String,
        required: [true, 'Please add your location'],
        unique: true,
        trim: true,
        maxlength: [50, 'Should be 50 characters'],
    }
})
