const getMostWins = require('../getMostWins');

const input = [
  { u: 'a', datesWon: [1, 2, 3] },
  { u: 'b', datesWon: [1, 2, 3, 4, 5] },
  { u: 'c', datesWon: [1, 2] },
  { u: 'd', datesWon: [1] },
  { u: 'e', datesWon: [1, 2, 3, 4] },
];

test('gets most wins', () => {
  expect(getMostWins(input)).toStrictEqual(5);
});
