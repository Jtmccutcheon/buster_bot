const { get, sample } = require('lodash');

const getBotd = members => {
  const randomMember = sample(members);

  const randomMemberId = get(randomMember, 'user.id', '404 Buster not found');
  const randomMemberAvatarURL = randomMember.displayAvatarURL();
  const randomMemberUsername = get(
    randomMember,
    'user.username',
    '404 buster not found',
  );
  const dateWon = new Date().toISOString();

  return {
    randomMemberId,
    randomMemberAvatarURL,
    randomMemberUsername,
    dateWon,
  };
};

module.exports = getBotd;
