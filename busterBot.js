/* eslint-disable no-console */
const cron = require('node-cron');
const { CRON_EXPRESSIONS, CRON_OPTIONS } = require('./constants');
const createBusterBotClient = require('./createBusterBotClient');
const isLastDayOfMonth = require('./utils/isLastDayOfMonth');
const {
  busterOfTheDay,
  busterOfTheMonth,
  busterOfTheYear,
  dailyBusterBackup,
  dailyLogBackup,
} = require('./jobs');

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
  CRON_EXPRESSIONS.logBackup,
  () => {
    console.log('creating logs back up');
    createBusterBotClient(dailyLogBackup);
  },
  CRON_OPTIONS,
);
