/* eslint-disable no-undef */
/* eslint-disable no-multi-assign */
const mongoose = require('mongoose');

const BusterOTMSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  busters: [
    {
      discordId: {
        type: String,
        required: true,
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
    },
  ],
});

module.exports = BusterOTM = mongoose.model(
  'BustersOfTheMonths',
  BusterOTMSchema,
);
