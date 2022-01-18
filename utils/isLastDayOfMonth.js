const moment = require('moment');

const isLastDayOfMonth = () => {
  const currentDay = moment().format('YYYY-MM-DD');
  const lastDayOfCurrentMonth = moment(currentDay)
    .endOf('month')
    .format('YYYY-MM-DD');

  return currentDay === lastDayOfCurrentMonth;
};

module.exports = isLastDayOfMonth;
