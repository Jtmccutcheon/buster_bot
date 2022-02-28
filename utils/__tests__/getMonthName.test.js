const getMonthName = require('../getMonthName');

test('get january', () => {
  expect(getMonthName(0)).toStrictEqual('January');
});
