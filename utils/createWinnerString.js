const winnerString = winners => {
  let str = '';
  // eslint-disable-next-line no-return-assign
  winners.map(w => (str += `<@${w.discordId}> `));
  return str;
};

module.exports = winnerString;
