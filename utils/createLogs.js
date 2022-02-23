const Logs = require('../models/Logs');

const createLogs = async ({ log, error, type }) => {
  const timestamp = new Date().toISOString();

  const newLog = new Logs({
    timestamp,
    log,
    error,
    type,
  });
  await newLog.save();
};

module.exports = createLogs;
