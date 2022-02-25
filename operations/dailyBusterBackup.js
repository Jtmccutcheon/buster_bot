/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const fs = require('fs');
const moment = require('moment');
const orderBy = require('lodash/orderBy');
const Buster = require('../models/Buster');
const Backup = require('../models/Backup');
const { createLogs } = require('../db');

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
      error => {
        if (error) {
          createLogs({
            log: 'DAILY BUSTER BACKUP ERROR',
            error: JSON.stringify(error),
            type: 'DATABASE',
          });
        }
      },
    );

    // save cloud copy
    const newBackup = new Backup({
      date,
      busters: orderedBusters,
    });

    await newBackup.save();

    createLogs({
      log: 'DAILY BACKUP SUCESSFULLY EXECUTED',
      type: 'DATABASE',
    });
  } catch (error) {
    createLogs({
      log: 'DAILY BUSTER BACKUP ERROR',
      error: JSON.stringify(error),
      type: 'DATABASE',
    });
  }

  return null;
};

module.exports = dailyBusterBackup;
