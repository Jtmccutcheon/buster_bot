const fetchQuote = require('./fetchQuote');
const getColor = require('./getColor');
const getMonthName = require('./getMonthName');
const getMonthString = require('./getMonthString');
const getPrevMonthIndex = require('./getPrevMonthIndex');
const isLastDayOfMonth = require('./isLastDayOfMonth');
const createWinnerString = require('./createWinnerString');
const getMostWins = require('./getMostWins');
const getBotd = require('./getBotd');
const getBotdMessage = require('./getBotdMessage');
const getHolidayMessage = require('./getHolidayMessage');
const createHolidayRole = require('./createHolidayRole');

module.exports = {
  fetchQuote,
  getColor,
  getMonthName,
  getMonthString,
  getPrevMonthIndex,
  isLastDayOfMonth,
  createWinnerString,
  getMostWins,
  getBotd,
  getBotdMessage,
  getHolidayMessage,
  createHolidayRole,
};
