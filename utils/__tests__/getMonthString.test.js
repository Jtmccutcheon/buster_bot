const getMonthString = require('../getMonthString');

test('gets month number string', () => {
  expect(getMonthString(0)).toStrictEqual('01');
});
