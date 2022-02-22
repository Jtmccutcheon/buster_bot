const CRON_EXPRESSIONS = {
  botd: '9 18 * * *', // At 06:09 PM everday
  backup: '11 18 * * *', // At 06:11 PM everday
  botm: '50 9 18 28-31 * *', // At 06:09:50 PM, between day 28 and 31 of the month
  boty: '12 18 31 12 *', // At 06:12 PM, on day 31 of the month, only in December
  debug: '16 23 * * *',
};

const CRON_OPTIONS = {
  scheduled: true,
  timezone: 'America/New_York',
};

module.exports = {
  CRON_EXPRESSIONS,
  CRON_OPTIONS,
};
