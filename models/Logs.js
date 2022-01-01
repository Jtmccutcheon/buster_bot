/* eslint-disable no-undef */
/* eslint-disable no-multi-assign */
const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  timestamp: {
    type: String,
    required: true,
    default: '1970-01-01T00:00:01',
  },
  error: {
    type: String,
  },
  log: {
    type: String,
    default: 'no data',
  },
  type: {
    type: String,
    default: 'no data',
  },
});

module.exports = Log = mongoose.model('Log', LogSchema);
