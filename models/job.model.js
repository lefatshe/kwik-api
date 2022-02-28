const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    weeks: {
        type: String,
        required: [true, 'Please add number of weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'Please add a tuition cost']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    order: {
        type: mongoose.Schema.ObjectId,
        ref: 'Order',
        required: true
    },
    // user: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'User',
    //     required: true
    // }
});


// Static method to get avg of Job tuition's
JobSchema.statics.getAverageCost = async function(orderId) {

    // console.log('Calculate avg cost...'.blue)

    const obj = await this.aggregate([
        {
            $match: { order: orderId }
        },
        {
            $group: {
                _id: '$order',
                averageCost: { $avg: '$tuition' }
            }
        }
    ]);

    try {
        if (obj[0]) {
            await this.model("Order").findByIdAndUpdate(orderId, {
                averageCost:Math.ceil(obj[0].averageCost / 10) * 10,
            });
        } else {
            await this.model("Order").findByIdAndUpdate(orderId, {
                averageCost: undefined,
            });
        }
    } catch (err) {
        console.error(err);
    }
};


// Call getAverageCost after save
JobSchema.post('save', async function() {
    this.constructor.getAverageCost(this.order)
    // await this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost after remove
JobSchema.post('remove', async function () {
    this.constructor.getAverageCost(this.order)
    // await this.constructor.getAverageCost(this.bootcamp);
});



module.exports = mongoose.model('Job', JobSchema);
