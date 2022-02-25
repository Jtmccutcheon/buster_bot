const Buster = require('../models/Buster');
const createLogs = require('./createLogs');

const createBuster = async ({ discordId, username, avatarUrl, datesWon }) => {
  const newBuster = new Buster({
    discordId,
    username,
    avatarUrl,
    datesWon,
  });
  createLogs({
    log: `BUSTER RECORD DOES NOT EXIST ...CREATING NEW BUSTER RECORD FOR ${username}:${discordId}`,
    type: 'DATABASE',
  });
  await newBuster.save();
};

module.exports = createBuster;
