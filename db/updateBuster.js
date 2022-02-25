const Buster = require('../models/Buster');
const createLogs = require('./createLogs');

const updateBuster = ({ discordId, updatedBuster }) => {
  createLogs({
    log: `BUSTER RECORD ${updatedBuster.username} FOUND ...UPDATING BUSTER`,
    type: 'DATABASE',
  });
  Buster.updateOne(
    { discordId },
    updatedBuster,
    { new: true },
    (err, busterAfterUpdate) => {
      if (err) {
        createLogs({
          log: `ERROR UPDATING BUSTER RECORD ${updatedBuster.username}`,
          type: 'DATABASE',
          error: JSON.stringify(err),
        });
      }
      if (busterAfterUpdate)
        createLogs({
          log: `BUSTER RECORD ${updatedBuster.username} SUCESSFULLY UPDATED`,
          type: 'DATABASE',
        });
    },
  );
};

module.exports = updateBuster;
