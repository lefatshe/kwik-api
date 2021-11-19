const mongoose = require('mongoose')

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true
    })

    console.log(`MONGO_URI Connected: ${conn.connection.host}`.black.bgGreen)
}

module.exports = connectDB()
