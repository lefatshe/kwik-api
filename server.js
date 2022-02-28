const colors = require('colors')
const express = require('express')
const dotenv = require('dotenv')
// const logger = require('./middleware/logger')
const morgan = require('morgan')
const errorHandler = require('./middleware/error');
// Coookie
const cookieParser = require('cookie-parser')
// file upload
const fileupload = require('express-fileupload')
const path = require('path');

// load environment variables
dotenv.config({path: './config/config.env'})

// Route files
const job = require('./routes/jobs.route')
const order = require('./routes/order.route')
const auth = require('./routes/auth.route')

// load database
const connectDB = require('./config/db')
connectDB;

// load express framework
const app = express()

// environment configurations
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Body parser
app.use(express.json())
// Cookie parse
app.use(cookieParser())
// fileupload
app.use(fileupload())
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount router
app.use('/api/v1/jobs', job)
app.use('/api/v1/orders', order)
app.use('/api/v1/auth', auth)
app.use(errorHandler)

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
