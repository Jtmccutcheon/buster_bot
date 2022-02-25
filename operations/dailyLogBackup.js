/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const fs = require('fs');
const moment = require('moment');
const { createLogs } = require('../db');
const Logs = require('../models/Logs');

const dailyLogBackup = async () => {
  const date = moment().format('YYYY-MM-DD');
  const startsWithDate = new RegExp(`^${date}`);
  try {
    const logs = await Logs.find({ timestamp: startsWithDate });

    // save local copy
    fs.writeFile(`./backups/logs/${date}.json`, JSON.stringify(logs), error => {
      if (error) {
        createLogs({
          log: 'DAILY BUSTER BACKUP ERROR',
          error: JSON.stringify(error),
          type: 'DATABASE',
        });
      }
    });
  } catch (error) {
    createLogs({
      log: 'DAILY LOG BACKUP ERROR',
      error: JSON.stringify(error),
      type: 'DATABASE',
    });
  }

  return null;
};

module.exports = dailyLogBackup;
