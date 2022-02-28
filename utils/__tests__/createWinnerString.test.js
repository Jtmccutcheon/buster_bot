const createWinnerString = require('../createWinnerString');

const input = [{ discordId: '1' }, { discordId: '2' }];

const output = '<@1> <@2> ';

test('creates string to mention winners', () => {
  expect(createWinnerString(input)).toStrictEqual(output);
});
