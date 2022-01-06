/* eslint-disable no-console */
const mongoose = require('mongoose');
require('dotenv').config();

const dbConnect = async () => {
  // mongoose.set('debug', true); // uncomment for mongoose logs
  try {
    // eslint-disable-next-line no-unused-expressions
    await mongoose.connect(
      process.env.MONGO_DB,
      // process.env.TEST_DB,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );
    console.log('mongoDB connected....');
  } catch (err) {
    console.log(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = dbConnect;
