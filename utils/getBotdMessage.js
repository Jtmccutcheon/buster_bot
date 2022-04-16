const { MILESTONE } = require('../constants');

const getBotdMessage = ({ quote, datesWon, randomMemberId, mostWins }) => {
  // have to use + 1 at this point in the code we have not updated the buster record in the database to include new win
  const milestoneMessage =
    (datesWon.length + 1) % MILESTONE === 0
      ? ` on achieving Buster of The Day milestone ${datesWon.length + 1} wins`
      : '';

  const leadChangeMessage = {
    [true]: 'You did it',
    [datesWon.length + 1 === mostWins]: 'Tied the leader',
    [datesWon.length + 1 > mostWins]: 'Gained the lead',
  }.true;

  return `Its 6:09 again which means its time to announce Buster of the Day! Congratulations${milestoneMessage} <@${randomMemberId}>!!! ${leadChangeMessage}!! \nAnd remember, "${quote.q}" - ${quote.a}\nFor advanced buster analytics please visit https://busteranalytics-beta.netlify.app/`;
};

module.exports = getBotdMessage;
