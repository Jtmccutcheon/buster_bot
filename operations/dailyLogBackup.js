/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const fs = require('fs');
const moment = require('moment');
const Logs = require('../models/Logs');

const dailyLogBackup = async () => {
  const date = moment().format('YYYY-MM-DD');
  const startsWithDate = new RegExp(`^${date}`);
  try {
    const logs = await Logs.find({ timestamp: startsWithDate });

    // save local copy
    fs.writeFile(`./backups/logs/${date}.json`, JSON.stringify(logs), err => {
      if (err) {
        console.log(err);
      }
    });
  } catch (error) {
    const errorLog = new Logs({
      timestamp: new Date().toIsoString(),
      log: 'DAILY LOG BACKUP ERROR',
      error: JSON.stringify(error),
      type: 'BUSTER_DATABASE',
    });

    await errorLog.save();
  }

  return null;
};

module.exports = dailyLogBackup;
