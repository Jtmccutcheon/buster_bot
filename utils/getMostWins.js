const getMostWins = busters => {
  let max = 0;
  busters.forEach(b => {
    if (max < b.datesWon.length) {
      max = b.datesWon.length;
    }
  });
  return max;
};

module.exports = getMostWins;
