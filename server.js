const express = require('express')
const dotenv = require('dotenv')
// const logger = require('./middleware/logger')
const morgan = require('morgan')

// Route
const order = require('./routes/order.route')

// load env vars
dotenv.config({path: './config/config.env'})

const app = express()

// app.use(logger)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Mount router
app.use('/api/v1/orders', order)


const PORT = process.env.PORT || 5000

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`),
)
