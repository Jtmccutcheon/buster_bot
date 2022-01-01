/* eslint-disable no-undef */
/* eslint-disable no-multi-assign */
const mongoose = require('mongoose');

const BusterSchema = new mongoose.Schema({
  discordId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
    required: true,
  },
  datesWon: {
    type: [String],
    required: true,
  },
});

module.exports = Buster = mongoose.model('Buster', BusterSchema);
