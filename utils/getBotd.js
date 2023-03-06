const { get, sample } = require('lodash');
const Buster = require('../models/Buster');
const getMostWins = require('./getMostWins');

const getBotd = async members => {
  // get random user and properties that are updated by users so we can update them in our db on win
  // const randomMember = sample(members);
  const randomMember = members[Math.floor(Math.random() * members.length)];
  const randomMemberId = get(randomMember, 'user.id', '404 Buster not found');
  const randomMemberAvatarURL = randomMember.displayAvatarURL();
  const randomMemberUsername = get(
    randomMember,
    'user.username',
    '404 buster not found',
  );
  const randomMemberNickname =
    randomMember.nickname === null
      ? randomMemberUsername
      : randomMember.nickname;

  const dateWon = new Date().toISOString();

  // get existing buster datesWons for milestone check
  // get all busters to find most wins for lead change check
  const [existingBuster, allBusters] = await Promise.all([
    Buster.findOne({ discordId: randomMemberId }),
    Buster.find({}),
  ]);

  const mostWins = getMostWins(allBusters);

  const usersWithMostWins = allBusters.filter(
    b => b.datesWon.length === mostWins,
  );

  return {
    randomMemberId,
    randomMemberAvatarURL,
    randomMemberUsername,
    dateWon,
    datesWon:
      existingBuster && existingBuster.datesWon.length
        ? existingBuster.datesWon
        : [],
    mostWins,
    usersWithMostWins,
    randomMemberNickname,
  };
};

module.exports = getBotd;
