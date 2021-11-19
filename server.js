const colors = require('colors')
const express = require('express')
const dotenv = require('dotenv')
// const logger = require('./middleware/logger')
const morgan = require('morgan')

// load environment variables
dotenv.config({path: './config/config.env'})

// load application routes
const order = require('./routes/order.route')

// load database
const connectDB = require('./config/db')
connectDB;

// load express framework
const app = express()

// environment configurations
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Mount router
app.use('/api/v1/orders', order)


const PORT = process.env.PORT || 5000

const server = app.listen(
    PORT,
    console.log(`...server running, NODE_ENV: ${process.env.NODE_ENV} on http://localhost:${PORT}`.black.bgGreen),
)

// Handle promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.black.bgRed)
    // exit
    server.close(() => process.exit(1))
})
