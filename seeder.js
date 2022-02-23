const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Order = require('./models/order.model');
const Job = require('./models/job.model');

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Read JSON files
const orders = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/orders.json`, 'utf-8')
);

const jobs = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/jobs.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    await Order.create(orders);
    await Job.create(jobs);
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Order.deleteMany();
    await Job

        .deleteMany();
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
