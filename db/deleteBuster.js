const Buster = require('../models/Buster');
const createLogs = require('./createLogs');

const createBuster = async ({ username }) => {
  createLogs({
    log: `BUSTER REMOVED ${username}`,
    type: 'DATABASE',
  });

  await Buster.deleteOne({ username });
};

module.exports = createBuster;
