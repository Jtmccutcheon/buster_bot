/* eslint-disable no-undef */
/* eslint-disable no-multi-assign */
const mongoose = require('mongoose');

const BusterOTYSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
  },
  busters: [
    {
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
    },
  ],
});

module.exports = BusterOTY = mongoose.model(
  'BustersOfTheYears',
  BusterOTYSchema,
);
