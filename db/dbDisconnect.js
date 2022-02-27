const mongoose = require('mongoose');

const dbDisconnect = () => mongoose.disconnect();

module.exports = dbDisconnect;
