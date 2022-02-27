/* eslint-disable no-multi-assign */
/* eslint-disable no-undef */

// schema should be 1 to 1 with Buster
// used to create a daily backup collection
const mongoose = require('mongoose');

const BackupSchema = new mongoose.Schema({
  date: String,
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

module.exports = Backup = mongoose.model('Backup', BackupSchema);
