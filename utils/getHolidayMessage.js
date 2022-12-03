const moment = require('moment');
const { HOLIDAYS } = require('../constants');

const getHolidayMessage = () => {
  const date = moment().format('MM-DD');
  return {
    [true]: '',
    [date === '01-01']: HOLIDAYS.newYearDay,
    [date === '02-14']: HOLIDAYS.valentinesDay,
    [date === '04-20']: HOLIDAYS.weedDay,
    [date === '05-05']: HOLIDAYS.cincoDeMayo,
    [date === '06-09']: HOLIDAYS.sixNine,
    [date === '07-04']: HOLIDAYS.july4th,
    [date === '10-31']: HOLIDAYS.halloween,
    [date === '12-02']: HOLIDAYS.busterAnniversary,
    [date === '12-24']: HOLIDAYS.christmasEve,
    [date === '12-25']: HOLIDAYS.christmas,
    [date === '12-31']: HOLIDAYS.newYearsEve,
  }.true;
};

module.exports = { getHolidayMessage };
