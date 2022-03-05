const fs = require('fs');
const moment = require('moment');
const orderBy = require('lodash/orderBy');
const Buster = require('../models/Buster');
const { createLogs, createBackup } = require('../db');

const dailyBusterBackup = async () => {
  const date = moment().format('YYYY-MM-DD');
  try {
    const busterResponse = await Buster.find();
    // maintain order of first date won
    const busters = orderBy(busterResponse, ['datesWon'], ['asc']);

    // save local copy
    fs.writeFile(
      `../backups/busters/${date}.json`,
      JSON.stringify(busters),
      error => {
        if (error) {
          createLogs({
            log: 'DAILY BUSTER BACKUP ERROR',
            error: JSON.stringify(error),
            type: 'DATABASE',
          });
        } else {
          createLogs({
            log: 'DAILY BACKUP SUCESSFULLY EXECUTED',
            type: 'DATABASE',
          });
        }
      },
    );

    // save cloud copy
    createBackup({ date, busters });
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
