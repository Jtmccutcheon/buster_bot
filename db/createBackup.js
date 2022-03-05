const Backup = require('../models/Backup');

const createBackup = async ({ date, busters }) => {
  const newBackup = new Backup({
    date,
    busters,
  });

  await newBackup.save();
};

module.exports = createBackup;
