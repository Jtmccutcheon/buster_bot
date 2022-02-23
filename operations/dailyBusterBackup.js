/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const fs = require('fs');
const moment = require('moment');
const orderBy = require('lodash/orderBy');
const Buster = require('../models/Buster');
const Backup = require('../models/Backup');
const Logs = require('../models/Logs');

const dailyBusterBackup = async () => {
  const date = moment().format('YYYY-MM-DD');
  try {
    const busters = await Buster.find();
    // maintain order of first date won
    const orderedBusters = orderBy(busters, ['datesWon'], ['asc']);

    // save local copy
    fs.writeFile(
      `./backups/busters/${date}.json`,
      JSON.stringify(orderedBusters),
      err => {
        if (err) {
          console.log(err);
        }
      },
    );

    // save cloud copy
    const newBackup = new Backup({
      date,
      busters: orderedBusters,
    });

    await newBackup.save();

    const backupLog = new Logs({
      timestamp: new Date().toISOString(),
      log: 'DAILY BACKUP SUCESSFULLY EXECUTED',
      type: 'BUSTER_DATABASE',
    });

    await backupLog.save();
  } catch (error) {
    const errorLog = new Logs({
      timestamp: new Date().toISOString(),
      log: 'DAILY BUSTER BACKUP ERROR',
      error: JSON.stringify(error),
      type: 'BUSTER_DATABASE',
    });

    await errorLog.save();
  }

  return null;
};

module.exports = dailyBusterBackup;
