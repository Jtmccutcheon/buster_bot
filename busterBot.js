/* eslint-disable no-console */
require('dotenv').config();
const cron = require('node-cron');
const { CRON_EXPRESSIONS, CRON_OPTIONS } = require('./constants');
const createBusterBotClient = require('./createBusterBotClient');
const busterOfTheDay = require('./operations/busterOfTheDay');
const busterOfTheMonth = require('./operations/busterOfTheMonth');
const busterOfTheYear = require('./operations/busterOfTheYear');
const dailyBusterBackup = require('./operations/dailyBusterBackup');
const dailyLogBackup = require('./operations/dailyLogBackup');
const isLastDayOfMonth = require('./utils/isLastDayOfMonth');

// Buster of the day
cron.schedule(
  CRON_EXPRESSIONS.botd,
  () => {
    console.log('running buster of the day');
    createBusterBotClient(busterOfTheDay);
  },
  CRON_OPTIONS,
);

// Buster of the month
cron.schedule(
  CRON_EXPRESSIONS.botm,
  () => {
    if (isLastDayOfMonth()) {
      console.log('running buster of the month');
      createBusterBotClient(busterOfTheMonth);
    }
  },
  CRON_OPTIONS,
);

// Buster of the year
cron.schedule(
  CRON_EXPRESSIONS.boty,
  () => {
    console.log('running buster of the year');
    createBusterBotClient(busterOfTheYear);
  },
  CRON_OPTIONS,
);

// daily db backup
cron.schedule(
  CRON_EXPRESSIONS.backup,
  () => {
    console.log('creating buster back up');
    createBusterBotClient(dailyBusterBackup);
  },
  CRON_OPTIONS,
);

// daily Log backup
cron.schedule(
  CRON_EXPRESSIONS.debug,
  () => {
    console.log('creating logs back up');
    createBusterBotClient(dailyLogBackup);
  },
  CRON_OPTIONS,
);
