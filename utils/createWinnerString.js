const winnerString = winners =>
  // eslint-disable-next-line no-return-assign
  winners.map(w => `<@${w.discordId}> `).join();

module.exports = winnerString;
