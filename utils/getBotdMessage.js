const {
  MILESTONE,
  CRAFTY_BUSTERS,
  IRON_BUSTERS,
  STAR_TREK_BUSTERS,
  FANTASY_FOOTBALL_BUSTERS,
  GOLF_BUSTERS,
} = require('../constants');
const { getHolidayMessage } = require('./getHolidayMessage');

const getBotdMessage = ({
  quote = '',
  datesWon = [],
  randomMemberId = '',
  mostWins = 0,
  usersWithMostWins = {},
  aires = '',
}) => {
  // have to use + 1 at this point in the code we have not updated the buster record in the database to include new win
  const milestoneMessage =
    (datesWon.length + 1) % MILESTONE === 0
      ? ` on achieving milestone ${datesWon.length + 1} wins`
      : '';

  const leadChangeMessage = {
    [true]: 'You did it',
    [datesWon.length + 1 === mostWins]: `Tied the leader ${
      datesWon.length + 1
    } wins`,
    [datesWon.length + 1 > mostWins]: `Gained the lead  ${
      datesWon.length + 1
    } wins`,
    [datesWon.length + 1 > mostWins &&
    usersWithMostWins.length === 1 &&
    usersWithMostWins[0].discordId === randomMemberId]: `Extended the lead ${
      datesWon.length + 1
    } wins`,
  }.true;

  const craftyMessage = CRAFTY_BUSTERS.includes(randomMemberId)
    ? `What's up crafty buster?`
    : '';

  const ironBuster = IRON_BUSTERS.includes(randomMemberId) ? 'Iron buster' : '';

  const starTrekBuster = STAR_TREK_BUSTERS.includes(randomMemberId)
    ? 'Star Trek buster'
    : '';

  const fantasyFootballBuster = FANTASY_FOOTBALL_BUSTERS.includes(
    randomMemberId,
  )
    ? 'Fantasy Footballster'
    : '';

  const golfBuster = GOLF_BUSTERS.includes(randomMemberId) ? 'Golf buster' : '';

  return `Its 6:09 again which means its time to announce Buster of the Day! Congratulations${milestoneMessage} <@${randomMemberId}>!!! ${craftyMessage} ${ironBuster} ${starTrekBuster} ${fantasyFootballBuster} ${golfBuster} ${leadChangeMessage}${getHolidayMessage()}!! And remember, "${
    quote.q
  }" - ${
    quote.a
  } \n\n${aires}\nFor advanced buster analytics please visit https://busteranalytics.netlify.app/`;
};

module.exports = getBotdMessage;
