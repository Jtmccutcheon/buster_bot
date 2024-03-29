const CRON_EXPRESSIONS = {
  botd: '9 18 * * *', // At 06:09 PM everday
  backup: '11 18 * * *', // At 06:11 PM everday
  logBackup: '12 18 * * *', // At 06:12 PM everday
  botm: '50 9 18 28-31 * *', // At 06:09:50 PM, between day 28 and 31 of the month
  boty: '12 18 31 12 *', // At 06:12 PM, on day 31 of the month, only in December
  debug: '12 15 * * *',
};

const CRON_OPTIONS = {
  scheduled: true,
  timezone: 'America/New_York',
};

const MILESTONE = 5 || 10;

const HOLIDAYS = {
  newYearDay: ' New Year new Buster',
  valentinesDay: ' Valentine Buster',
  weedDay: ' 420 Buster',
  cincoDeMayo: ' Cinco de Buster',
  sixNine: ' 6/9 Buster',
  july4th: ' Freedom Buster',
  halloween: ' Halloween Buster',
  busterAnniversary: ' Buster anniversary Buster',
  christmasEve: ' Chirstmas Eve Buster',
  christmas: ' Christmas Buster',
  newYearsEve: ' New Years Eve Buster',
};

const CRAFTY_BUSTERS = [
  '269681242335739905',
  '181658815106777089',
  '299780772456431627',
  '544765071662776322',
  '532089837818216459',
];

const IRON_BUSTERS = ['181658815106777089', '222538757067374602'];

const STAR_TREK_BUSTERS = [];

module.exports = {
  CRON_EXPRESSIONS,
  CRON_OPTIONS,
  MILESTONE,
  HOLIDAYS,
  CRAFTY_BUSTERS,
  IRON_BUSTERS,
  STAR_TREK_BUSTERS,
};
